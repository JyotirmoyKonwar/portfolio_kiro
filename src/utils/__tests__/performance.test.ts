import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  performanceMonitor,
  measureImageLoad,
  reportBundleSize,
  monitorMemoryUsage,
  addResourceHints,
  initializePerformanceMonitoring,
} from '../performance'

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1024 * 1024 * 10, // 10MB
    totalJSHeapSize: 1024 * 1024 * 50, // 50MB
    jsHeapSizeLimit: 1024 * 1024 * 100, // 100MB
  },
}

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
})

// Mock PerformanceObserver
class MockPerformanceObserver {
  callback: (list: any) => void
  
  constructor(callback: (list: any) => void) {
    this.callback = callback
  }
  
  observe() {}
  disconnect() {}
}

Object.defineProperty(window, 'PerformanceObserver', {
  value: MockPerformanceObserver,
})

// Mock navigator.connection
Object.defineProperty(navigator, 'connection', {
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
  },
  configurable: true,
})

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPerformance.now.mockReturnValue(1000)
    document.head.innerHTML = ''
  })

  afterEach(() => {
    performanceMonitor.cleanup()
  })

  describe('PerformanceMonitor', () => {
    it('records metrics correctly', () => {
      const metrics = {
        loadTime: 100,
        renderTime: 50,
        interactionTime: 25,
      }
      
      performanceMonitor.recordMetric('test-metric', metrics)
      
      const allMetrics = performanceMonitor.getMetrics()
      expect(allMetrics.get('test-metric')).toEqual(metrics)
    })

    it('measures component render time', () => {
      const mockRenderFunction = vi.fn(() => 'rendered')
      mockPerformance.now
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1050) // end time
      
      const measuredFunction = performanceMonitor.measureComponentRender(
        'TestComponent',
        mockRenderFunction
      )
      
      const result = measuredFunction('arg1', 'arg2')
      
      expect(result).toBe('rendered')
      expect(mockRenderFunction).toHaveBeenCalledWith('arg1', 'arg2')
      
      const metrics = performanceMonitor.getMetrics()
      const componentMetrics = metrics.get('component-TestComponent')
      expect(componentMetrics?.renderTime).toBe(50)
    })

    it('measures async operations', () => {
      mockPerformance.now
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1200) // end time
      
      const measurement = performanceMonitor.measureAsyncOperation('async-test')
      measurement.end()
      
      const metrics = performanceMonitor.getMetrics()
      const asyncMetrics = metrics.get('async-test')
      expect(asyncMetrics?.loadTime).toBe(200)
    })

    it('gets web vitals metrics', () => {
      performanceMonitor.recordMetric('fcp', { loadTime: 1500, renderTime: 0, interactionTime: 0 })
      performanceMonitor.recordMetric('lcp', { loadTime: 2500, renderTime: 0, interactionTime: 0 })
      performanceMonitor.recordMetric('cls', { loadTime: 0.1, renderTime: 0, interactionTime: 0 })
      
      const webVitals = performanceMonitor.getWebVitals()
      
      expect(webVitals.fcp).toBe(1500)
      expect(webVitals.lcp).toBe(2500)
      expect(webVitals.cls).toBe(0.1)
    })

    it('cleans up observers and metrics', () => {
      performanceMonitor.recordMetric('test', { loadTime: 100, renderTime: 0, interactionTime: 0 })
      
      expect(performanceMonitor.getMetrics().size).toBeGreaterThan(0)
      
      performanceMonitor.cleanup()
      
      expect(performanceMonitor.getMetrics().size).toBe(0)
    })
  })

  describe('measureImageLoad', () => {
    it('measures successful image load time', () => {
      mockPerformance.now
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1300) // end time
      
      const measurement = measureImageLoad('test-image.jpg')
      measurement.onLoad()
      
      const metrics = performanceMonitor.getMetrics()
      const imageMetrics = metrics.get('image-load-test-image.jpg')
      expect(imageMetrics?.loadTime).toBe(300)
    })

    it('measures image load errors', () => {
      mockPerformance.now
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1500) // end time
      
      const measurement = measureImageLoad('broken-image.jpg')
      measurement.onError()
      
      const metrics = performanceMonitor.getMetrics()
      const errorMetrics = metrics.get('image-error-broken-image.jpg')
      expect(errorMetrics?.loadTime).toBe(500)
    })
  })

  describe('reportBundleSize', () => {
    it('reports network information when available', () => {
      reportBundleSize()
      
      const metrics = performanceMonitor.getMetrics()
      const networkInfo = metrics.get('network-info')
      
      expect(networkInfo?.loadTime).toBe(100) // rtt
      expect(networkInfo?.renderTime).toBe(10) // downlink
    })

    it('handles missing connection API gracefully', () => {
      // Temporarily remove connection
      const originalConnection = (navigator as any).connection
      delete (navigator as any).connection
      
      expect(() => reportBundleSize()).not.toThrow()
      
      // Restore connection
      ;(navigator as any).connection = originalConnection
    })
  })

  describe('monitorMemoryUsage', () => {
    it('returns memory usage when available', () => {
      const memory = monitorMemoryUsage()
      
      expect(memory).toEqual({
        used: 1024 * 1024 * 10,
        total: 1024 * 1024 * 50,
        limit: 1024 * 1024 * 100,
      })
    })

    it('returns null when memory API is not available', () => {
      const originalMemory = mockPerformance.memory
      delete (mockPerformance as any).memory
      
      const memory = monitorMemoryUsage()
      expect(memory).toBeNull()
      
      // Restore memory
      mockPerformance.memory = originalMemory
    })
  })

  describe('addResourceHints', () => {
    it('adds preconnect links for external domains', () => {
      addResourceHints()
      
      const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]')
      expect(preconnectLinks.length).toBeGreaterThan(0)
      
      const googleFontsLink = Array.from(preconnectLinks).find(
        link => (link as HTMLLinkElement).href === 'https://fonts.googleapis.com/'
      )
      expect(googleFontsLink).toBeTruthy()
    })

    it('adds DNS prefetch links for external resources', () => {
      addResourceHints()
      
      const dnsPrefetchLinks = document.querySelectorAll('link[rel="dns-prefetch"]')
      expect(dnsPrefetchLinks.length).toBeGreaterThan(0)
      
      const githubLink = Array.from(dnsPrefetchLinks).find(
        link => (link as HTMLLinkElement).href === 'https://api.github.com/'
      )
      expect(githubLink).toBeTruthy()
    })
  })

  describe('initializePerformanceMonitoring', () => {
    it('sets up performance monitoring', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      
      initializePerformanceMonitoring()
      
      // Should add beforeunload listener
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      )
      
      // Should add resource hints
      const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]')
      expect(preconnectLinks.length).toBeGreaterThan(0)
      
      addEventListenerSpy.mockRestore()
    })

    it('sets up memory monitoring in development', () => {
      vi.stubEnv('DEV', true)
      
      const setIntervalSpy = vi.spyOn(window, 'setInterval')
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      initializePerformanceMonitoring()
      
      expect(setIntervalSpy).toHaveBeenCalledWith(
        expect.any(Function),
        30000
      )
      
      setIntervalSpy.mockRestore()
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })
  })
})