import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createSkipLink,
  trapFocus,
  handleEscapeKey,
  announceToScreenReader,
  prefersReducedMotion,
  generateId,
  hasGoodContrast,
  isNavigationKey,
  isActionKey,
  createScreenReaderText,
  addFocusVisiblePolyfill,
} from '../accessibility'

describe('Accessibility Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('createSkipLink', () => {
    it('creates a skip link with correct attributes', () => {
      const skipLink = createSkipLink('main-content')
      
      expect(skipLink.tagName).toBe('A')
      expect(skipLink.href).toContain('#main-content')
      expect(skipLink.textContent).toBe('Skip to main content')
      expect(skipLink.className).toContain('sr-only')
    })

    it('creates a skip link with custom text', () => {
      const skipLink = createSkipLink('navigation', 'Skip to navigation')
      
      expect(skipLink.textContent).toBe('Skip to navigation')
      expect(skipLink.href).toContain('#navigation')
    })
  })

  describe('trapFocus', () => {
    it('traps focus within an element', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      
      button1.textContent = 'First'
      button2.textContent = 'Last'
      
      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)

      const cleanup = trapFocus(container)
      
      // Should focus the first element
      expect(document.activeElement).toBe(button1)
      
      // Simulate Tab key on last element
      button2.focus()
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      container.dispatchEvent(tabEvent)
      
      cleanup()
    })

    it('handles shift+tab correctly', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      
      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)

      const cleanup = trapFocus(container)
      
      // Simulate Shift+Tab on first element
      button1.focus()
      const shiftTabEvent = new KeyboardEvent('keydown', { 
        key: 'Tab', 
        shiftKey: true 
      })
      container.dispatchEvent(shiftTabEvent)
      
      cleanup()
    })
  })

  describe('handleEscapeKey', () => {
    it('calls callback when Escape key is pressed', () => {
      const callback = vi.fn()
      const cleanup = handleEscapeKey(callback)
      
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)
      
      expect(callback).toHaveBeenCalled()
      cleanup()
    })

    it('does not call callback for other keys', () => {
      const callback = vi.fn()
      const cleanup = handleEscapeKey(callback)
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(enterEvent)
      
      expect(callback).not.toHaveBeenCalled()
      cleanup()
    })
  })

  describe('announceToScreenReader', () => {
    it('creates an announcement element', () => {
      announceToScreenReader('Test announcement')
      
      const announcement = document.querySelector('[aria-live]')
      expect(announcement).toBeInTheDocument()
      expect(announcement?.textContent).toBe('Test announcement')
      expect(announcement?.getAttribute('aria-live')).toBe('polite')
    })

    it('creates assertive announcements', () => {
      announceToScreenReader('Urgent message', 'assertive')
      
      const announcement = document.querySelector('[aria-live="assertive"]')
      expect(announcement).toBeInTheDocument()
    })

    it('removes announcement after timeout', async () => {
      vi.useFakeTimers()
      
      announceToScreenReader('Test message')
      
      const announcement = document.querySelector('[aria-live]')
      expect(announcement).toBeInTheDocument()
      
      vi.advanceTimersByTime(1000)
      
      expect(document.querySelector('[aria-live]')).not.toBeInTheDocument()
      
      vi.useRealTimers()
    })
  })

  describe('prefersReducedMotion', () => {
    it('returns true when user prefers reduced motion', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
        })),
      })

      expect(prefersReducedMotion()).toBe(true)
    })

    it('returns false when user does not prefer reduced motion', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: '',
        })),
      })

      expect(prefersReducedMotion()).toBe(false)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs with default prefix', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toMatch(/^id-/)
      expect(id2).toMatch(/^id-/)
      expect(id1).not.toBe(id2)
    })

    it('generates IDs with custom prefix', () => {
      const id = generateId('custom')
      expect(id).toMatch(/^custom-/)
    })
  })

  describe('hasGoodContrast', () => {
    it('returns true for high contrast colors', () => {
      // Black on white should have good contrast
      expect(hasGoodContrast('#000000', '#ffffff')).toBe(true)
    })

    it('returns false for low contrast colors', () => {
      // Light gray on white should have poor contrast
      expect(hasGoodContrast('#cccccc', '#ffffff')).toBe(false)
    })
  })

  describe('isNavigationKey', () => {
    it('returns true for navigation keys', () => {
      expect(isNavigationKey('ArrowUp')).toBe(true)
      expect(isNavigationKey('ArrowDown')).toBe(true)
      expect(isNavigationKey('Home')).toBe(true)
      expect(isNavigationKey('End')).toBe(true)
    })

    it('returns false for non-navigation keys', () => {
      expect(isNavigationKey('Enter')).toBe(false)
      expect(isNavigationKey('a')).toBe(false)
    })
  })

  describe('isActionKey', () => {
    it('returns true for action keys', () => {
      expect(isActionKey('Enter')).toBe(true)
      expect(isActionKey(' ')).toBe(true)
      expect(isActionKey('Space')).toBe(true)
    })

    it('returns false for non-action keys', () => {
      expect(isActionKey('ArrowUp')).toBe(false)
      expect(isActionKey('a')).toBe(false)
    })
  })

  describe('createScreenReaderText', () => {
    it('creates a screen reader only span', () => {
      const span = createScreenReaderText('Screen reader text')
      
      expect(span.tagName).toBe('SPAN')
      expect(span.textContent).toBe('Screen reader text')
      expect(span.className).toBe('sr-only')
    })
  })

  describe('addFocusVisiblePolyfill', () => {
    it('adds event listeners for focus management', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      
      addFocusVisiblePolyfill()
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true)
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function), true)
      expect(addEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function), true)
      expect(addEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function), true)
      
      addEventListenerSpy.mockRestore()
    })
  })
})