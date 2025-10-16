import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { AnalyticsProvider, useAnalytics } from '../AnalyticsContext'

// Mock the analytics service
const mockAnalyticsService = {
  getAnalyticsData: vi.fn(() => ({
    totalDownloads: 5,
    totalViews: 10,
    totalContacts: 2,
    events: [],
    lastUpdated: new Date(),
  })),
}

vi.mock('../../services/analytics', () => ({
  analyticsService: mockAnalyticsService,
}))

// Test component that uses the analytics context
const TestComponent = () => {
  const {
    analyticsData,
    refreshAnalytics,
    isAnalyticsDashboardOpen,
    openAnalyticsDashboard,
    closeAnalyticsDashboard,
    toggleAnalyticsDashboard,
  } = useAnalytics()

  return (
    <div>
      <div data-testid="downloads">{analyticsData.totalDownloads}</div>
      <div data-testid="views">{analyticsData.totalViews}</div>
      <div data-testid="contacts">{analyticsData.totalContacts}</div>
      <div data-testid="dashboard-open">{isAnalyticsDashboardOpen.toString()}</div>
      
      <button onClick={refreshAnalytics} data-testid="refresh">
        Refresh
      </button>
      <button onClick={openAnalyticsDashboard} data-testid="open">
        Open Dashboard
      </button>
      <button onClick={closeAnalyticsDashboard} data-testid="close">
        Close Dashboard
      </button>
      <button onClick={toggleAnalyticsDashboard} data-testid="toggle">
        Toggle Dashboard
      </button>
    </div>
  )
}

describe('AnalyticsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('provides analytics data to children', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    expect(screen.getByTestId('downloads')).toHaveTextContent('5')
    expect(screen.getByTestId('views')).toHaveTextContent('10')
    expect(screen.getByTestId('contacts')).toHaveTextContent('2')
    expect(screen.getByTestId('dashboard-open')).toHaveTextContent('false')
  })

  it('refreshes analytics data when requested', () => {
    mockAnalyticsService.getAnalyticsData
      .mockReturnValueOnce({
        totalDownloads: 5,
        totalViews: 10,
        totalContacts: 2,
        events: [],
        lastUpdated: new Date(),
      })
      .mockReturnValueOnce({
        totalDownloads: 8,
        totalViews: 15,
        totalContacts: 3,
        events: [],
        lastUpdated: new Date(),
      })

    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    expect(screen.getByTestId('downloads')).toHaveTextContent('5')

    act(() => {
      fireEvent.click(screen.getByTestId('refresh'))
    })

    expect(screen.getByTestId('downloads')).toHaveTextContent('8')
    expect(screen.getByTestId('views')).toHaveTextContent('15')
    expect(screen.getByTestId('contacts')).toHaveTextContent('3')
  })

  it('manages dashboard open/close state', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    expect(screen.getByTestId('dashboard-open')).toHaveTextContent('false')

    act(() => {
      fireEvent.click(screen.getByTestId('open'))
    })

    expect(screen.getByTestId('dashboard-open')).toHaveTextContent('true')

    act(() => {
      fireEvent.click(screen.getByTestId('close'))
    })

    expect(screen.getByTestId('dashboard-open')).toHaveTextContent('false')
  })

  it('toggles dashboard state', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    expect(screen.getByTestId('dashboard-open')).toHaveTextContent('false')

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'))
    })

    expect(screen.getByTestId('dashboard-open')).toHaveTextContent('true')

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'))
    })

    expect(screen.getByTestId('dashboard-open')).toHaveTextContent('false')
  })

  it('refreshes data when opening dashboard', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    const initialCalls = mockAnalyticsService.getAnalyticsData.mock.calls.length

    act(() => {
      fireEvent.click(screen.getByTestId('open'))
    })

    expect(mockAnalyticsService.getAnalyticsData).toHaveBeenCalledTimes(initialCalls + 1)
  })

  it('listens for storage events and refreshes data', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    const initialCalls = mockAnalyticsService.getAnalyticsData.mock.calls.length

    // Simulate storage event
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'portfolio_analytics',
        newValue: 'new data',
      })
      window.dispatchEvent(storageEvent)
    })

    expect(mockAnalyticsService.getAnalyticsData).toHaveBeenCalledTimes(initialCalls + 1)
  })

  it('ignores storage events for other keys', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    const initialCalls = mockAnalyticsService.getAnalyticsData.mock.calls.length

    // Simulate storage event for different key
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'other_key',
        newValue: 'other data',
      })
      window.dispatchEvent(storageEvent)
    })

    expect(mockAnalyticsService.getAnalyticsData).toHaveBeenCalledTimes(initialCalls)
  })

  it('refreshes data periodically', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    const initialCalls = mockAnalyticsService.getAnalyticsData.mock.calls.length

    // Fast-forward 30 seconds
    act(() => {
      vi.advanceTimersByTime(30000)
    })

    expect(mockAnalyticsService.getAnalyticsData).toHaveBeenCalledTimes(initialCalls + 1)

    // Fast-forward another 30 seconds
    act(() => {
      vi.advanceTimersByTime(30000)
    })

    expect(mockAnalyticsService.getAnalyticsData).toHaveBeenCalledTimes(initialCalls + 2)
  })

  it('cleans up event listeners and intervals on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')

    const { unmount } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function))
    expect(clearIntervalSpy).toHaveBeenCalled()

    removeEventListenerSpy.mockRestore()
    clearIntervalSpy.mockRestore()
  })

  it('throws error when useAnalytics is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAnalytics must be used within an AnalyticsProvider')

    consoleSpy.mockRestore()
  })
})