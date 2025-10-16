// Performance monitoring utilities

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observe paint timing
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.recordMetric('fcp', { 
                loadTime: entry.startTime,
                renderTime: 0,
                interactionTime: 0
              });
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', paintObserver);
      } catch (e) {
        console.warn('Paint observer not supported');
      }

      // Observe largest contentful paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('lcp', {
            loadTime: lastEntry.startTime,
            renderTime: 0,
            interactionTime: 0
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Observe layout shifts
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.recordMetric('cls', {
            loadTime: clsValue,
            renderTime: 0,
            interactionTime: 0
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  recordMetric(name: string, metrics: PerformanceMetrics) {
    this.metrics.set(name, metrics);
    
    if (import.meta.env.DEV) {
      console.log(`Performance metric [${name}]:`, metrics);
    }
  }

  measureComponentRender<T extends (...args: any[]) => any>(
    componentName: string,
    renderFunction: T
  ): T {
    return ((...args: any[]) => {
      const startTime = performance.now();
      const result = renderFunction(...args);
      const endTime = performance.now();
      
      this.recordMetric(`component-${componentName}`, {
        loadTime: 0,
        renderTime: endTime - startTime,
        interactionTime: 0
      });
      
      return result;
    }) as T;
  }

  measureAsyncOperation(name: string) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        this.recordMetric(name, {
          loadTime: endTime - startTime,
          renderTime: 0,
          interactionTime: 0
        });
      }
    };
  }

  getMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  getWebVitals() {
    return {
      fcp: this.metrics.get('fcp')?.loadTime || 0,
      lcp: this.metrics.get('lcp')?.loadTime || 0,
      cls: this.metrics.get('cls')?.loadTime || 0,
      fid: this.getFirstInputDelay()
    };
  }

  private getFirstInputDelay(): number {
    if ('PerformanceObserver' in window) {
      try {
        let fidValue = 0;
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            fidValue = (entry as any).processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        return fidValue;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const measureRender = React.useCallback(() => {
    return performanceMonitor.measureAsyncOperation(`render-${componentName}`);
  }, [componentName]);

  React.useEffect(() => {
    const measurement = measureRender();
    return () => measurement.end();
  }, [measureRender]);

  return {
    measureRender,
    measureAsync: (operationName: string) => 
      performanceMonitor.measureAsyncOperation(`${componentName}-${operationName}`)
  };
};

// Image loading performance
export const measureImageLoad = (src: string) => {
  const startTime = performance.now();
  
  return {
    onLoad: () => {
      const endTime = performance.now();
      performanceMonitor.recordMetric(`image-load-${src}`, {
        loadTime: endTime - startTime,
        renderTime: 0,
        interactionTime: 0
      });
    },
    onError: () => {
      const endTime = performance.now();
      performanceMonitor.recordMetric(`image-error-${src}`, {
        loadTime: endTime - startTime,
        renderTime: 0,
        interactionTime: 0
      });
    }
  };
};

// Bundle size monitoring
export const reportBundleSize = () => {
  if ('navigator' in window && 'connection' in navigator) {
    const connection = (navigator as any).connection;
    const bundleInfo = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    };
    
    performanceMonitor.recordMetric('network-info', {
      loadTime: bundleInfo.rtt,
      renderTime: bundleInfo.downlink,
      interactionTime: 0
    });
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit
    };
  }
  return null;
};

// Critical resource hints
export const addResourceHints = () => {
  const head = document.head;
  
  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
  });
  
  // DNS prefetch for external resources
  const dnsPrefetchDomains = [
    'https://api.github.com',
    'https://scholar.google.com'
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    head.appendChild(link);
  });
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  // Add resource hints
  addResourceHints();
  
  // Report initial bundle size
  reportBundleSize();
  
  // Monitor memory usage periodically
  if (import.meta.env.DEV) {
    setInterval(() => {
      const memory = monitorMemoryUsage();
      if (memory) {
        console.log('Memory usage:', {
          used: `${(memory.used / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memory.total / 1024 / 1024).toFixed(2)} MB`,
          percentage: `${((memory.used / memory.total) * 100).toFixed(1)}%`
        });
      }
    }, 30000); // Every 30 seconds
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.cleanup();
  });
};

// React import to fix the useCallback and useEffect usage
import React from 'react';