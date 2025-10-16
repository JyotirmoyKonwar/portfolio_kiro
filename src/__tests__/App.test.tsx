import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

// Mock the lazy components to avoid loading issues in tests
vi.mock('../components/LazyComponents', () => ({
  LazyProjects: () => <div data-testid="projects-section">Projects</div>,
  LazyResearch: () => <div data-testid="research-section">Research</div>,
  LazySkills: () => <div data-testid="skills-section">Skills</div>,
  LazyContact: () => <div data-testid="contact-section">Contact</div>,
  LazyAnalyticsDashboard: ({ isOpen }: { isOpen: boolean }) => 
    isOpen ? <div data-testid="analytics-dashboard">Analytics Dashboard</div> : null,
  preloadCriticalComponents: vi.fn(),
}))

// Mock the utility functions
vi.mock('../utils/accessibility', () => ({
  addFocusVisiblePolyfill: vi.fn(),
}))

vi.mock('../utils/performance', () => ({
  initializePerformanceMonitoring: vi.fn(),
}))

vi.mock('../utils/accessibilityTest', () => ({}))

// Mock the components
vi.mock('../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}))

vi.mock('../components/Hero', () => ({
  Hero: () => <section data-testid="hero-section">Hero</section>,
}))

vi.mock('../components/About', () => ({
  About: () => <section data-testid="about-section">About</section>,
}))

vi.mock('../components/Analytics', () => ({
  AnalyticsButton: () => <button data-testid="analytics-button">Analytics</button>,
}))

vi.mock('../components/SEO', () => ({
  SEO: () => <div data-testid="seo">SEO</div>,
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('renders all main sections', async () => {
    render(<App />)
    
    // Check for critical sections that load immediately
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('about-section')).toBeInTheDocument()
    
    // Check for lazy-loaded sections
    await waitFor(() => {
      expect(screen.getByTestId('projects-section')).toBeInTheDocument()
      expect(screen.getByTestId('research-section')).toBeInTheDocument()
      expect(screen.getByTestId('skills-section')).toBeInTheDocument()
      expect(screen.getByTestId('contact-section')).toBeInTheDocument()
    })
  })

  it('includes SEO component', () => {
    render(<App />)
    expect(screen.getByTestId('seo')).toBeInTheDocument()
  })

  it('includes analytics button', () => {
    render(<App />)
    expect(screen.getByTestId('analytics-button')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<App />)
    
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('id', 'main-content')
    expect(main).toHaveAttribute('aria-label', 'Portfolio content')
  })

  it('adds skip link for accessibility', async () => {
    render(<App />)
    
    await waitFor(() => {
      const skipLink = document.querySelector('a[href="#main-content"]')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveTextContent('Skip to main content')
    })
  })

  it('initializes performance monitoring and accessibility features', async () => {
    const { initializePerformanceMonitoring } = await import('../utils/performance')
    const { addFocusVisiblePolyfill } = await import('../utils/accessibility')
    const { preloadCriticalComponents } = await import('../components/LazyComponents')
    
    render(<App />)
    
    await waitFor(() => {
      expect(initializePerformanceMonitoring).toHaveBeenCalled()
      expect(addFocusVisiblePolyfill).toHaveBeenCalled()
      expect(preloadCriticalComponents).toHaveBeenCalled()
    })
  })

  it('handles errors gracefully with error boundary', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock a component that throws an error
    vi.doMock('../components/Hero', () => ({
      Hero: () => {
        throw new Error('Test error')
      },
    }))
    
    render(<App />)
    
    // The error boundary should catch the error and log it
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })
})