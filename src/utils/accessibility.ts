/**
 * Accessibility utilities for keyboard navigation and screen reader support
 */

// Skip link functionality
export const createSkipLink = (targetId: string, text: string = 'Skip to main content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500';
  
  return skipLink;
};

// Focus management for modals and overlays
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  // Focus the first element
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Escape key handler for modals
export const handleEscapeKey = (callback: () => void) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

// Announce content changes to screen readers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Generate unique IDs for form labels and ARIA relationships
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate color contrast (basic implementation)
export const hasGoodContrast = (foreground: string, background: string): boolean => {
  // This is a simplified implementation
  // In a real application, you'd use a proper color contrast calculation
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  
  const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
  
  return contrast >= 4.5; // WCAG AA standard
};

// Helper function to calculate luminance (simplified)
const getLuminance = (color: string): number => {
  // This is a very basic implementation
  // In production, you'd want a more robust color parsing library
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Keyboard navigation helpers
export const isNavigationKey = (key: string): boolean => {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(key);
};

export const isActionKey = (key: string): boolean => {
  return ['Enter', ' ', 'Space'].includes(key);
};

// Screen reader text utilities
export const createScreenReaderText = (text: string): HTMLSpanElement => {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
};

// Focus visible utilities
export const addFocusVisiblePolyfill = () => {
  // Add focus-visible polyfill behavior
  let hadKeyboardEvent = true;
  
  const keyboardThrottleTimeout = 100;
  let keyboardThrottleTimeoutID = 0;
  
  const pointerInitialPress = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || e.pointerType === 'touch') {
      hadKeyboardEvent = false;
    }
  };
  
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }
    
    hadKeyboardEvent = true;
    
    clearTimeout(keyboardThrottleTimeoutID);
    keyboardThrottleTimeoutID = window.setTimeout(() => {
      hadKeyboardEvent = false;
    }, keyboardThrottleTimeout);
  };
  
  const onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (hadKeyboardEvent || target.matches(':focus-visible')) {
      target.classList.add('focus-visible');
    }
  };
  
  const onBlur = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove('focus-visible');
  };
  
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('pointerdown', pointerInitialPress, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
};