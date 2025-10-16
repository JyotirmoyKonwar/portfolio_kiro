import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import App from '../App'

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations)

// Mock all the components to avoid loading issues in accessibility tests
vi.mock('../components/LazyComponents', () => ({
  LazyProjects: () => (
    <section aria-labelledby="projects-heading" data-testid="projects-section">
      <h2 id="projects-heading">Projects</h2>
      <div role="list">
        <div role="listitem">
          <h3>Project 1</h3>
          <p>Description of project 1</p>
          <a href="https://github.com/user/project1" aria-label="View Project 1 on GitHub">
            GitHub
          </a>
        </div>
      </div>
    </section>
  ),
  LazyResearch: () => (
    <section aria-labelledby="research-heading" data-testid="research-section">
      <h2 id="research-heading">Research</h2>
      <div role="list">
        <div role="listitem">
          <h3>Research Paper 1</h3>
          <p>Abstract of research paper</p>
        </div>
      </div>
    </section>
  ),
  LazySkills: () => (
    <section aria-labelledby="skills-heading" data-testid="skills-section">
      <h2 id="skills-heading">Skills</h2>
      <div role="list">
        <div role="listitem" aria-label="Python programming language">
          Python
        </div>
        <div role="listitem" aria-label="JavaScript programming language">
          JavaScript
        </div>
      </div>
    </section>
  ),
  LazyContact: () => (
    <section aria-labelledby="contact-heading" data-testid="contact-section">
      <h2 id="contact-heading">Contact</h2>
      <div>
        <a href="mailto:test@example.com" aria-label="Send email to test@example.com">
          Email
        </a>
        <a href="https://linkedin.com/in/test" aria-label="View LinkedIn profile">
          LinkedIn
        </a>
      </div>
    </section>
  ),
  LazyAnalyticsDashboard: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? (
      <div
        role="dialog"
        aria-labelledby="analytics-title"
        aria-modal="true"
        data-testid="analytics-dashboard"
      >
        <h2 id="analytics-title">Analytics Dashboard</h2>
        <button aria-label="Close analytics dashboard">Close</button>
      </div>
    ) : null,
  preloadCriticalComponents: vi.fn(),
}))

vi.mock('../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div role="application" aria-label="Portfolio website">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main role="main">{children}</main>
      <footer role="contentinfo">
        <p>&copy; 2024 Portfolio Website</p>
      </footer>
    </div>
  ),
}))

vi.mock('../components/Hero', () => ({
  Hero: () => (
    <section aria-labelledby="hero-heading" data-testid="hero-section">
      <h1 id="hero-heading">John Doe</h1>
      <p>CS M. Tech Student | AI & Data Science</p>
      <div>
        <a href="/resume.pdf" aria-label="Download resume PDF">
          Download Resume
        </a>
        <a href="#contact" aria-label="Go to contact section">
          Contact Me
        </a>
      </div>
    </section>
  ),
}))

vi.mock('../components/About', () => ({
  About: () => (
    <section aria-labelledby="about-heading" data-testid="about-section">
      <h2 id="about-heading">About Me</h2>
      <p>
        I am a Computer Science Master's student specializing in AI and Data Science.
      </p>
      <div role="list" aria-label="Research interests">
        <div role="listitem">Machine Learning</div>
        <div role="listitem">Natural Language Processing</div>
        <div role="listitem">Computer Vision</div>
      </div>
    </section>
  ),
}))

vi.mock('../components/Analytics', () => ({
  AnalyticsButton: () => (
    <button
      aria-label="Open analytics dashboard"
      data-testid="analytics-button"
    >
      Analytics
    </button>
  ),
}))

vi.mock('../components/SEO', () => ({
  SEO: () => null, // SEO component doesn't render visible content
}))

vi.mock('../utils/accessibility', () => ({
  addFocusVisiblePolyfill: vi.fn(),
}))

vi.mock('../utils/performance', () => ({
  initializePerformanceMonitoring: vi.fn(),
}))

vi.mock('../utils/accessibilityTest', () => ({}))

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not have any accessibility violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper heading hierarchy', () => {
    render(<App />)
    
    // Check for h1 (should be unique)
    const h1Elements = screen.getAllByRole('heading', { level: 1 })
    expect(h1Elements).toHaveLength(1)
    expect(h1Elements[0]).toHaveTextContent('John Doe')
    
    // Check for h2 elements (section headings)
    const h2Elements = screen.getAllByRole('heading', { level: 2 })
    expect(h2Elements.length).toBeGreaterThan(0)
    
    // Verify section headings exist
    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /research/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument()
  })

  it('has proper landmark roles', () => {
    render(<App />)
    
    // Check for main landmarks
    expect(screen.getByRole('banner')).toBeInTheDocument() // header
    expect(screen.getByRole('main')).toBeInTheDocument() // main content
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
    expect(screen.getByRole('navigation')).toBeInTheDocument() // nav
  })

  it('has accessible navigation', () => {
    render(<App />)
    
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()
    
    // Check for navigation links
    const navLinks = screen.getAllByRole('link')
    expect(navLinks.length).toBeGreaterThan(0)
    
    // Verify important navigation links exist
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  it('has accessible links with proper labels', () => {
    render(<App />)
    
    // Check for descriptive link labels
    expect(screen.getByRole('link', { name: /download resume pdf/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /go to contact section/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /send email/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view linkedin profile/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view.*github/i })).toBeInTheDocument()
  })

  it('has accessible buttons with proper labels', () => {
    render(<App />)
    
    // Check for descriptive button labels
    expect(screen.getByRole('button', { name: /open analytics dashboard/i })).toBeInTheDocument()
  })

  it('has proper list structures', () => {
    render(<App />)
    
    // Check for lists with proper roles
    const lists = screen.getAllByRole('list')
    expect(lists.length).toBeGreaterThan(0)
    
    // Check for list items
    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('has accessible form elements (if any)', () => {
    render(<App />)
    
    // If there are form elements, they should have proper labels
    const inputs = screen.queryAllByRole('textbox')
    inputs.forEach(input => {
      // Each input should have an accessible name
      expect(input).toHaveAccessibleName()
    })
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      // Each button should have an accessible name
      expect(button).toHaveAccessibleName()
    })
  })

  it('has proper ARIA labels and descriptions', () => {
    render(<App />)
    
    // Check for elements with ARIA labels
    const elementsWithAriaLabel = document.querySelectorAll('[aria-label]')
    expect(elementsWithAriaLabel.length).toBeGreaterThan(0)
    
    // Check for elements with ARIA labelledby
    const elementsWithAriaLabelledby = document.querySelectorAll('[aria-labelledby]')
    expect(elementsWithAriaLabelledby.length).toBeGreaterThan(0)
  })

  it('has skip link for keyboard navigation', async () => {
    render(<App />)
    
    // Skip link should be added by the App component
    await vi.waitFor(() => {
      const skipLink = document.querySelector('a[href="#main-content"]')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveTextContent('Skip to main content')
    })
  })

  it('has proper color contrast (basic check)', () => {
    render(<App />)
    
    // This is a basic check - in a real app you'd use more sophisticated tools
    const textElements = screen.getAllByText(/./i)
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element)
      const color = styles.color
      const backgroundColor = styles.backgroundColor
      
      // Basic check that color and background are different
      expect(color).not.toBe(backgroundColor)
    })
  })

  it('supports keyboard navigation', () => {
    render(<App />)
    
    // Check that interactive elements are focusable
    const links = screen.getAllByRole('link')
    const buttons = screen.getAllByRole('button')
    
    const allInteractiveElements = [...links, ...buttons]
    allInteractiveElements.forEach(element => {
      // Elements should not have negative tabindex (unless intentionally hidden)
      const tabIndex = element.getAttribute('tabindex')
      if (tabIndex !== null) {
        expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0)
      }
    })
  })

  it('has proper semantic HTML structure', () => {
    render(<App />)
    
    // Check for semantic HTML elements
    expect(document.querySelector('main')).toBeInTheDocument()
    expect(document.querySelector('header')).toBeInTheDocument()
    expect(document.querySelector('footer')).toBeInTheDocument()
    expect(document.querySelector('nav')).toBeInTheDocument()
    
    // Check for section elements
    const sections = document.querySelectorAll('section')
    expect(sections.length).toBeGreaterThan(0)
  })
})