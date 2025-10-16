// Global error handling utilities

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: Date;
  userAgent: string;
  userId?: string;
}

class GlobalErrorHandler {
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;
  private reportingEnabled = true;

  constructor() {
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        line: event.lineno,
        column: event.colno,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        this.handleResourceError(target);
      }
    }, true);
  }

  private handleError(errorReport: ErrorReport) {
    if (!this.reportingEnabled) return;

    // Add to queue
    this.errorQueue.push(errorReport);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.error('Global Error:', errorReport);
    }

    // Report to analytics
    this.reportToAnalytics(errorReport);
  }

  private handleResourceError(element: HTMLElement) {
    if (!element || !element.tagName) {
      return; // Skip if element is invalid
    }
    
    const tagName = element.tagName.toLowerCase();
    let resourceType = 'unknown';
    let resourceUrl = '';

    switch (tagName) {
      case 'img':
        resourceType = 'image';
        resourceUrl = (element as HTMLImageElement).src;
        this.handleImageError(element as HTMLImageElement);
        break;
      case 'script':
        resourceType = 'script';
        resourceUrl = (element as HTMLScriptElement).src;
        break;
      case 'link':
        resourceType = 'stylesheet';
        resourceUrl = (element as HTMLLinkElement).href;
        break;
    }

    this.handleError({
      message: `Failed to load ${resourceType}: ${resourceUrl}`,
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    });
  }

  private handleImageError(img: HTMLImageElement) {
    // Try to provide a fallback image
    const fallbackSrc = img.dataset.fallback || '/images/placeholder.jpg';
    
    if (img.src !== fallbackSrc) {
      img.src = fallbackSrc;
      img.alt = img.alt || 'Image not available';
    } else {
      // Even fallback failed, replace with a styled div
      const placeholder = document.createElement('div');
      placeholder.className = 'w-full h-full bg-slate-700 flex items-center justify-center text-slate-400';
      placeholder.innerHTML = `
        <div class="text-center">
          <div class="w-12 h-12 mx-auto mb-2 opacity-50">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xs">Image unavailable</span>
        </div>
      `;
      
      if (img.parentNode) {
        img.parentNode.replaceChild(placeholder, img);
      }
    }
  }

  private reportToAnalytics(errorReport: ErrorReport) {
    // Report to Google Analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: errorReport.message,
        fatal: false,
        custom_map: {
          error_url: errorReport.url,
          error_line: errorReport.line,
          error_column: errorReport.column
        }
      });
    }

    // Store in localStorage for later analysis
    try {
      const storedErrors = JSON.parse(localStorage.getItem('portfolio_errors') || '[]');
      storedErrors.push(errorReport);
      
      // Keep only last 20 errors
      if (storedErrors.length > 20) {
        storedErrors.splice(0, storedErrors.length - 20);
      }
      
      localStorage.setItem('portfolio_errors', JSON.stringify(storedErrors));
    } catch (e) {
      // localStorage might be full or unavailable
      console.warn('Could not store error report:', e);
    }
  }

  getErrorReports(): ErrorReport[] {
    return [...this.errorQueue];
  }

  clearErrorReports() {
    this.errorQueue = [];
    try {
      localStorage.removeItem('portfolio_errors');
    } catch (e) {
      console.warn('Could not clear stored errors:', e);
    }
  }

  enableReporting() {
    this.reportingEnabled = true;
  }

  disableReporting() {
    this.reportingEnabled = false;
  }

  getStoredErrors(): ErrorReport[] {
    try {
      return JSON.parse(localStorage.getItem('portfolio_errors') || '[]');
    } catch (e) {
      return [];
    }
  }
}

// Global instance
export const globalErrorHandler = new GlobalErrorHandler();

// React error boundary helper
export const reportReactError = (error: Error, _errorInfo: any) => {
  globalErrorHandler['handleError']({
    message: `React Error: ${error.message}`,
    stack: error.stack,
    url: window.location.href,
    timestamp: new Date(),
    userAgent: navigator.userAgent
  });
};

// Network error handler
export const handleNetworkError = (url: string, error: Error) => {
  globalErrorHandler['handleError']({
    message: `Network Error: ${error.message} (${url})`,
    stack: error.stack,
    url: window.location.href,
    timestamp: new Date(),
    userAgent: navigator.userAgent
  });
};

// Async operation error wrapper
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  context?: string
): T => {
  return (async (...args: any[]) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      globalErrorHandler['handleError']({
        message: `${context ? `${context}: ` : ''}${errorMessage}`,
        stack: error instanceof Error ? error.stack : undefined,
        url: window.location.href,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
      throw error;
    }
  }) as T;
};

// Initialize error handling
export const initializeErrorHandling = () => {
  // Set up CSP violation reporting
  document.addEventListener('securitypolicyviolation', (event) => {
    globalErrorHandler['handleError']({
      message: `CSP Violation: ${event.violatedDirective} - ${event.blockedURI}`,
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    });
  });

  // Report initial page load errors
  if (import.meta.env.DEV) {
    console.log('Error handling initialized');
  }
};