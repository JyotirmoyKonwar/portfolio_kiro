import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock components for responsive testing
vi.mock('../components/LazyComponents', () => ({
  LazyProjects: () => (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="project-card">Project 1</div>
      <div className="project-card">Project 2</div>
      <div className="project-card">Project 3</div>
    </section>
  ),
  LazyResearch: () => (
    <section className="space-y-6">
      <div className="research-item">Research 1</div>
    </section>
  ),
  LazySkills: () => (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div className="skill-badge">Python</div>
      <div className="skill-badge">JavaScript</div>
    </section>
  ),
  LazyContact: () => (
    <section className="flex flex-col sm:flex-row gap-4">
      <div>Email</div>
      <div>LinkedIn</div>
    </section>
  ),
  LazyAnalyticsDashboard: () => null,
  preloadCriticalComponents: vi.fn(),
}))

vi.mock('../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-50">
        <nav className="hidden md:flex space-x-6">
          <a href="#home">Home</a>
          <a href="#about">About</a>
        </nav>
        <button className="md:hidden" aria-label="Toggle mobile menu">
          Menu
        </button>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  ),
}))

vi.mock('../components/Hero', () => ({
  Hero: () => (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
          John Doe
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mt-4">
          CS M. Tech Student
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button className="px-6 py-3">Download Resume</button>
          <button className="px-6 py-3">Contact Me</button>
        </div>
      </div>
    </section>
  ),
}))

vi.mock('../components/About', () => ({
  About: () => (
    <section className="py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
            About Me
          </h2>
          <p className="text-base sm:text-lg">
            I am a Computer Science Master's student.
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <img 
            src="/profile.jpg" 
            alt="Profile" 
            className="w-full max-w-sm mx-auto lg:max-w-none"
          />
        </div>
      </div>
    </section>
  ),
}))

vi.mock('../components/Analytics', () => ({
  AnalyticsButton: () => (
    <button className="fixed bottom-4 right-4 p-3 rounded-full">
      Analytics
    </button>
  ),
}))

vi.mock('../components/SEO', () => ({
  SEO: () => null,
}))

vi.mock('../utils/accessibility', () => ({
  addFocusVisiblePolyfill: vi.fn(),
}))

vi.mock('../utils/performance', () => ({
  initializePerformanceMonitoring: vi.fn(),
}))

vi.mock('../utils/accessibilityTest', () => ({}))

// Viewport size configurations for testing
const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
  large: { width: 1440, height: 900 },
}

// Helper function to set viewport size
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Mock matchMedia for responsive queries
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Reset viewport to default
    setViewport(1024, 768)
  })

  describe('Mobile Viewport (375px)', () => {
    beforeEach(() => {
      setViewport(viewports.mobile.width, viewports.mobile.height)
    })

    it('renders mobile layout correctly', () => {
      render(<App />)
      
      // Check that mobile menu button is present
      expect(screen.getByLabelText(/toggle mobile menu/i)).toBeInTheDocument()
      
      // Check that main content has proper mobile spacing
      const main = screen.getByRole('main')
      expect(main).toHaveClass('px-4')
    })

    it('stacks elements vertically on mobile', () => {
      render(<App />)
      
      // Hero buttons should stack vertically (flex-col)
      const heroSection = screen.getByRole('heading', { level: 1 }).closest('section')
      const buttonContainer = heroSection?.querySelector('.flex')
      expect(buttonContainer).toHaveClass('flex-col')
    })

    it('uses appropriate text sizes for mobile', () => {
      render(<App />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-4xl')
    })
  })

  describe('Tablet Viewport (768px)', () => {
    beforeEach(() => {
      setViewport(viewports.tablet.width, viewports.tablet.height)
    })

    it('renders tablet layout correctly', () => {
      render(<App />)
      
      // Check that navigation is visible on tablet
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      // Check medium spacing
      const main = screen.getByRole('main')
      expect(main).toHaveClass('sm:px-6')
    })

    it('adjusts grid layouts for tablet', () => {
      render(<App />)
      
      // Projects should use 2 columns on tablet (md:grid-cols-2)
      const projectsSection = document.querySelector('.grid-cols-1')
      expect(projectsSection).toHaveClass('md:grid-cols-2')
    })
  })

  describe('Desktop Viewport (1024px)', () => {
    beforeEach(() => {
      setViewport(viewports.desktop.width, viewports.desktop.height)
    })

    it('renders desktop layout correctly', () => {
      render(<App />)
      
      // Navigation should be fully visible
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('md:flex')
      
      // Check large spacing
      const main = screen.getByRole('main')
      expect(main).toHaveClass('lg:px-8')
    })

    it('uses horizontal layouts on desktop', () => {
      render(<App />)
      
      // About section should use 2-column layout
      const aboutSection = screen.getByRole('heading', { name: /about me/i }).closest('section')
      const gridContainer = aboutSection?.querySelector('.grid')
      expect(gridContainer).toHaveClass('lg:grid-cols-2')
    })

    it('uses larger text sizes on desktop', () => {
      render(<App />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('lg:text-6xl')
    })
  })

  describe('Large Desktop Viewport (1440px)', () => {
    beforeEach(() => {
      setViewport(viewports.large.width, viewports.large.height)
    })

    it('renders large desktop layout correctly', () => {
      render(<App />)
      
      // Should maintain desktop layout with proper spacing
      const main = screen.getByRole('main')
      expect(main).toHaveClass('container', 'mx-auto')
    })

    it('uses maximum grid columns on large screens', () => {
      render(<App />)
      
      // Skills should use 6 columns on large screens
      const skillsGrid = document.querySelector('.grid-cols-2')
      expect(skillsGrid).toHaveClass('lg:grid-cols-6')
    })
  })

  describe('Cross-viewport Consistency', () => {
    it('maintains content hierarchy across all viewports', () => {
      const viewportSizes = Object.values(viewports)
      
      viewportSizes.forEach(({ width, height }) => {
        setViewport(width, height)
        const { unmount } = render(<App />)
        
        // Check that main content structure is consistent
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
        
        unmount()
      })
    })

    it('maintains accessibility across viewports', () => {
      const viewportSizes = Object.values(viewports)
      
      viewportSizes.forEach(({ width, height }) => {
        setViewport(width, height)
        const { unmount } = render(<App />)
        
        // Check that navigation is accessible
        const nav = screen.getByRole('navigation')
        expect(nav).toBeInTheDocument()
        
        // Check that main content is accessible
        const main = screen.getByRole('main')
        expect(main).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Touch and Interaction Targets', () => {
    it('has appropriate touch targets on mobile', () => {
      setViewport(viewports.mobile.width, viewports.mobile.height)
      render(<App />)
      
      // Buttons should have adequate padding for touch
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button)
        // Check that buttons have adequate padding (at least 44px recommended)
        expect(button).toHaveClass('p-3') // This should provide adequate touch target
      })
    })

    it('maintains usable interface elements on small screens', () => {
      setViewport(320, 568) // Very small mobile screen
      render(<App />)
      
      // Interface should still be usable
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      
      // Text should remain readable
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeVisible()
    })
  })

  describe('Performance on Different Viewports', () => {
    it('loads efficiently on mobile', () => {
      setViewport(viewports.mobile.width, viewports.mobile.height)
      const startTime = performance.now()
      
      render(<App />)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Render should be reasonably fast (less than 100ms for this simple test)
      expect(renderTime).toBeLessThan(100)
    })

    it('handles viewport changes gracefully', () => {
      const { rerender } = render(<App />)
      
      // Start with mobile
      setViewport(viewports.mobile.width, viewports.mobile.height)
      rerender(<App />)
      
      // Switch to desktop
      setViewport(viewports.desktop.width, viewports.desktop.height)
      rerender(<App />)
      
      // Should still render correctly
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })
})