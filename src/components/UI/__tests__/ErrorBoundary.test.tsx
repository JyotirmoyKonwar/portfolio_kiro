import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary, withErrorBoundary, SectionErrorBoundary } from '../ErrorBoundary'

// Mock the Button component
vi.mock('../Button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}))

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Go Home')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('handles retry button click', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    // After retry, re-render with no error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('handles go home button click', () => {
    // Mock window.location
    const mockLocation = { href: '' }
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const homeButton = screen.getByText('Go Home')
    fireEvent.click(homeButton)

    expect(mockLocation.href).toBe('/')
  })

  it('shows error details in development mode', () => {
    vi.stubEnv('DEV', true)

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

    vi.unstubAllEnvs()
  })

  it('hides error details in production mode', () => {
    vi.stubEnv('DEV', false)

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument()

    vi.unstubAllEnvs()
  })
})

describe('withErrorBoundary', () => {
  it('wraps component with error boundary', () => {
    const TestComponent = ({ shouldThrow }: { shouldThrow: boolean }) => (
      <ThrowError shouldThrow={shouldThrow} />
    )

    const WrappedComponent = withErrorBoundary(TestComponent)

    render(<WrappedComponent shouldThrow={false} />)
    expect(screen.getByText('No error')).toBeInTheDocument()

    const { rerender } = render(<WrappedComponent shouldThrow={true} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('uses custom fallback and error handler', () => {
    const customFallback = <div>HOC Custom Error</div>
    const onError = vi.fn()

    const TestComponent = () => <ThrowError shouldThrow={true} />
    const WrappedComponent = withErrorBoundary(TestComponent, customFallback, onError)

    render(<WrappedComponent />)

    expect(screen.getByText('HOC Custom Error')).toBeInTheDocument()
    expect(onError).toHaveBeenCalled()
  })

  it('sets correct display name', () => {
    const TestComponent = () => <div>Test</div>
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withErrorBoundary(TestComponent)

    expect(WrappedComponent.displayName).toBe('withErrorBoundary(TestComponent)')
  })
})

describe('SectionErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <SectionErrorBoundary sectionName="Test Section">
        <div>Section content</div>
      </SectionErrorBoundary>
    )

    expect(screen.getByText('Section content')).toBeInTheDocument()
  })

  it('renders section-specific error UI when child throws', () => {
    render(
      <SectionErrorBoundary sectionName="Projects">
        <ThrowError shouldThrow={true} />
      </SectionErrorBoundary>
    )

    expect(screen.getByText('Projects Unavailable')).toBeInTheDocument()
    expect(screen.getByText(/This section is temporarily unavailable/)).toBeInTheDocument()
  })

  it('logs section-specific error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <SectionErrorBoundary sectionName="Skills">
        <ThrowError shouldThrow={true} />
      </SectionErrorBoundary>
    )

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in Skills section:',
      expect.any(Error),
      expect.any(Object)
    )

    consoleSpy.mockRestore()
  })
})