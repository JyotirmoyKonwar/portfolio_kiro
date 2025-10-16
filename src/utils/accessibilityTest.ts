/**
 * Simple accessibility testing utilities for development
 */

// Check if all images have alt text
export const checkImageAltText = (): void => {
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt: HTMLImageElement[] = [];
  
  images.forEach(img => {
    if (!img.alt || img.alt.trim() === '') {
      imagesWithoutAlt.push(img);
    }
  });
  
  if (imagesWithoutAlt.length > 0) {
    console.warn('Images without alt text found:', imagesWithoutAlt);
  } else {
    console.log('✓ All images have alt text');
  }
};

// Check if all buttons have accessible names
export const checkButtonAccessibility = (): void => {
  const buttons = document.querySelectorAll('button, [role="button"]');
  const buttonsWithoutNames: Element[] = [];
  
  buttons.forEach(button => {
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
    const hasTextContent = button.textContent?.trim();
    
    if (!hasAriaLabel && !hasAriaLabelledBy && !hasTextContent) {
      buttonsWithoutNames.push(button);
    }
  });
  
  if (buttonsWithoutNames.length > 0) {
    console.warn('Buttons without accessible names found:', buttonsWithoutNames);
  } else {
    console.log('✓ All buttons have accessible names');
  }
};

// Check heading hierarchy
export const checkHeadingHierarchy = (): void => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingLevels: number[] = [];
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    headingLevels.push(level);
  });
  
  let hasProperHierarchy = true;
  let previousLevel = 0;
  
  headingLevels.forEach((level, index) => {
    if (index === 0 && level !== 1) {
      console.warn('First heading should be h1');
      hasProperHierarchy = false;
    } else if (level > previousLevel + 1) {
      console.warn(`Heading hierarchy skip detected: h${previousLevel} to h${level}`);
      hasProperHierarchy = false;
    }
    previousLevel = level;
  });
  
  if (hasProperHierarchy) {
    console.log('✓ Heading hierarchy is proper');
  }
};

// Check color contrast (basic implementation)
export const checkColorContrast = (): void => {
  const elements = document.querySelectorAll('*');
  const lowContrastElements: Element[] = [];
  
  elements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // Skip elements without text or transparent backgrounds
    if (!element.textContent?.trim() || backgroundColor === 'rgba(0, 0, 0, 0)') {
      return;
    }
    
    // This is a simplified check - in production, use a proper contrast calculation library
    const isLowContrast = color === backgroundColor || 
                         (color.includes('rgb(128') && backgroundColor.includes('rgb(128'));
    
    if (isLowContrast) {
      lowContrastElements.push(element);
    }
  });
  
  if (lowContrastElements.length > 0) {
    console.warn('Potential low contrast elements found:', lowContrastElements);
  } else {
    console.log('✓ No obvious contrast issues detected');
  }
};

// Check for keyboard navigation support
export const checkKeyboardNavigation = (): void => {
  const interactiveElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  
  const elementsWithoutFocus: Element[] = [];
  
  interactiveElements.forEach(element => {
    const tabIndex = element.getAttribute('tabindex');
    const isHidden = element.getAttribute('aria-hidden') === 'true';
    
    if (tabIndex === '-1' || isHidden) {
      return; // Skip intentionally non-focusable elements
    }
    
    // Check if element can receive focus
    if (!(element as HTMLElement).focus) {
      elementsWithoutFocus.push(element);
    }
  });
  
  if (elementsWithoutFocus.length > 0) {
    console.warn('Interactive elements that may not be keyboard accessible:', elementsWithoutFocus);
  } else {
    console.log('✓ Interactive elements appear to be keyboard accessible');
  }
};

// Run all accessibility checks
export const runAccessibilityChecks = (): void => {
  console.group('🔍 Accessibility Checks');
  
  checkImageAltText();
  checkButtonAccessibility();
  checkHeadingHierarchy();
  checkColorContrast();
  checkKeyboardNavigation();
  
  console.groupEnd();
};

// Auto-run checks in development
if (import.meta.env.DEV) {
  // Run checks after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runAccessibilityChecks, 1000);
    });
  } else {
    setTimeout(runAccessibilityChecks, 1000);
  }
}