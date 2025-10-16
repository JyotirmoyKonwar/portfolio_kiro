import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  globalErrorHandler, 
  reportReactError, 
  handleNetworkError, 
  withErrorHandling,
  initializeErrorHandling 
} from '../errorHandling'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('[]')
    
    // Clear any existing error listeners
    window.removeEventListener('error', () => {})
    window.removeEventListener('unhandledrejection', () => {})
  })

  afterEach(() => {
    globalErrorHandler.clearErrorReports()
  })

  describe('GlobalErrorHandler', () => {
    it('captures JavaScript errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Disable reporting to prevent cascade
      globalErrorHandler.disableReporting()
      globalErrorHandler.clearErrorReports()
      globalErrorHandler.enableReporting()
      
      // Simulate a JavaScript error
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
        error: new Error('Test error')
      })
      
      window.dispatchEvent(errorEvent)
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports).toHaveLength(1)
      expect(reports[0].message).toBe('Test error')
      expect(reports[0].line).toBe(10)
      expect(reports[0].column).toBe(5)
      
      consoleSpy.mockRestore()
    })

    it('captures unhandled promise rejections', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Clear previous reports and disable/enable to reset
      globalErrorHandler.disableReporting()
      globalErrorHandler.clearErrorReports()
      globalErrorHandler.enableReporting()
      
      // Create a mock rejection event without actually rejecting a promise
      const mockReason = { message: 'Promise rejection', stack: 'mock stack' }
      const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.resolve(), // Use resolved promise to avoid actual rejection
        reason: mockReason
      })
      
      window.dispatchEvent(rejectionEvent)
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports).toHaveLength(1)
      expect(reports[0].message).toContain('Unhandled Promise Rejection')
      
      consoleSpy.mockRestore()
    })

    it('handles image loading errors', () => {
      const img = document.createElement('img')
      img.src = 'invalid-image.jpg'
      img.dataset.fallback = 'fallback.jpg'
      document.body.appendChild(img)
      
      // Simulate image error
      const errorEvent = new Event('error')
      Object.defineProperty(errorEvent, 'target', { value: img })
      
      window.dispatchEvent(errorEvent)
      
      expect(img.src).toContain('fallback.jpg')
      
      document.body.removeChild(img)
    })

    it('stores errors in localStorage', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const errorEvent = new ErrorEvent('error', {
        message: 'Storage test error',
        error: new Error('Storage test error')
      })
      
      window.dispatchEvent(errorEvent)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'portfolio_errors',
        expect.stringContaining('Storage test error')
      )
      
      consoleSpy.mockRestore()
    })

    it('maintains error queue size limit', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Clear and reset error handler
      globalErrorHandler.disableReporting()
      globalErrorHandler.clearErrorReports()
      globalErrorHandler.enableReporting()
      
      // Manually add errors to test queue limit without triggering global handlers
      for (let i = 0; i < 55; i++) {
        globalErrorHandler['handleError']({
          message: `Error ${i}`,
          url: 'test.js',
          timestamp: new Date(),
          userAgent: 'test-agent'
        })
      }
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports.length).toBeLessThanOrEqual(50)
      
      consoleSpy.mockRestore()
    })

    it('can enable and disable reporting', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Clear and disable reporting
      globalErrorHandler.clearErrorReports()
      globalErrorHandler.disableReporting()
      
      // Try to add error directly (should be ignored when disabled)
      globalErrorHandler['handleError']({
        message: 'Disabled error',
        url: 'test.js',
        timestamp: new Date(),
        userAgent: 'test-agent'
      })
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports).toHaveLength(0)
      
      globalErrorHandler.enableReporting()
      consoleSpy.mockRestore()
    })

    it('retrieves stored errors from localStorage', () => {
      const storedErrors = [
        {
          message: 'Stored error',
          url: 'test.html',
          timestamp: new Date().toISOString(),
          userAgent: 'test-agent'
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedErrors))
      
      const errors = globalErrorHandler.getStoredErrors()
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toBe('Stored error')
    })

    it('handles localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full')
      })
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      // Clear and enable reporting
      globalErrorHandler.clearErrorReports()
      globalErrorHandler.enableReporting()
      
      // Test localStorage error handling directly
      globalErrorHandler['handleError']({
        message: 'Test error',
        url: 'test.js',
        timestamp: new Date(),
        userAgent: 'test-agent'
      })
      
      // Should not throw and should log warning
      expect(consoleSpy).toHaveBeenCalledWith('Could not store error report:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('reportReactError', () => {
    it('reports React component errors', () => {
      const error = new Error('React component error')
      const errorInfo = { componentStack: 'Component stack trace' }
      
      reportReactError(error, errorInfo)
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports).toHaveLength(1)
      expect(reports[0].message).toContain('React Error')
      expect(reports[0].message).toContain('React component error')
    })
  })

  describe('handleNetworkError', () => {
    it('reports network errors with URL context', () => {
      const error = new Error('Network timeout')
      const url = 'https://api.example.com/data'
      
      handleNetworkError(url, error)
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports).toHaveLength(1)
      expect(reports[0].message).toContain('Network Error')
      expect(reports[0].message).toContain(url)
    })
  })

  describe('withErrorHandling', () => {
    it('wraps async functions with error handling', async () => {
      const asyncFn = vi.fn().mockRejectedValue(new Error('Async error'))
      const wrappedFn = withErrorHandling(asyncFn, 'Test context')
      
      await expect(wrappedFn()).rejects.toThrow('Async error')
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports).toHaveLength(1)
      expect(reports[0].message).toContain('Test context')
      expect(reports[0].message).toContain('Async error')
    })

    it('passes through successful async function results', async () => {
      const asyncFn = vi.fn().mockResolvedValue('success')
      const wrappedFn = withErrorHandling(asyncFn)
      
      const result = await wrappedFn()
      expect(result).toBe('success')
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports).toHaveLength(0)
    })

    it('handles non-Error rejections', async () => {
      const asyncFn = vi.fn().mockRejectedValue('String error')
      const wrappedFn = withErrorHandling(asyncFn)
      
      await expect(wrappedFn()).rejects.toBe('String error')
      
      const reports = globalErrorHandler.getErrorReports()
      expect(reports).toHaveLength(1)
      expect(reports[0].message).toContain('String error')
    })
  })

  describe('initializeErrorHandling', () => {
    it('sets up CSP violation reporting', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      
      initializeErrorHandling()
      
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'securitypolicyviolation',
        expect.any(Function)
      )
      
      addEventListenerSpy.mockRestore()
    })

    it('logs initialization in development', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      // Mock development environment
      vi.stubEnv('DEV', true)
      
      initializeErrorHandling()
      
      expect(consoleSpy).toHaveBeenCalledWith('Error handling initialized')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })
  })
})