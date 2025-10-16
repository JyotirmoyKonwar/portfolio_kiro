/**
 * Animation utilities and configurations for consistent animations across the portfolio
 * Optimized for 60fps performance and smooth user experience
 */

import type { Variants } from 'framer-motion';

// Easing functions optimized for performance
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  spring: { type: 'spring', damping: 25, stiffness: 120 },
  springBounce: { type: 'spring', damping: 15, stiffness: 100 },
} as const;

// Duration constants for consistent timing
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

// Scroll-triggered animation variants
export const scrollAnimations = {
  // Fade in from bottom
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 30,
      transition: { duration: durations.normal }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: durations.slow,
        ease: easings.easeOut
      }
    }
  },

  // Fade in from left
  fadeInLeft: {
    hidden: { 
      opacity: 0, 
      x: -30,
      transition: { duration: durations.normal }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: durations.slow,
        ease: easings.easeOut
      }
    }
  },

  // Fade in from right
  fadeInRight: {
    hidden: { 
      opacity: 0, 
      x: 30,
      transition: { duration: durations.normal }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: durations.slow,
        ease: easings.easeOut
      }
    }
  },

  // Scale in
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: durations.normal }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: durations.slow,
        ease: easings.easeOut
      }
    }
  },

  // Stagger container for child animations
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: durations.normal
      }
    }
  },

  // Fast stagger for grids
  fastStaggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: durations.fast
      }
    }
  }
} satisfies Record<string, Variants>;

// Hover animation variants
export const hoverAnimations = {
  // Subtle lift effect
  lift: {
    rest: { 
      y: 0, 
      scale: 1,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    hover: { 
      y: -4, 
      scale: 1.02,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    tap: { 
      y: 0, 
      scale: 0.98,
      transition: { duration: durations.fast, ease: easings.easeOut }
    }
  },

  // Scale effect
  scale: {
    rest: { 
      scale: 1,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: durations.fast, ease: easings.easeOut }
    }
  },

  // Glow effect (for buttons and cards)
  glow: {
    rest: { 
      boxShadow: '0 0 0 0 rgba(6, 182, 212, 0)',
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    hover: { 
      boxShadow: '0 0 20px 0 rgba(6, 182, 212, 0.3)',
      transition: { duration: durations.fast, ease: easings.easeOut }
    }
  },

  // Rotate effect (for icons)
  rotate: {
    rest: { 
      rotate: 0,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    hover: { 
      rotate: 5,
      transition: { duration: durations.fast, ease: easings.easeOut }
    }
  },

  // Slide effect
  slide: {
    rest: { 
      x: 0,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    hover: { 
      x: 5,
      transition: { duration: durations.fast, ease: easings.easeOut }
    }
  }
} satisfies Record<string, Variants>;

// Loading animation variants
export const loadingAnimations = {
  // Pulse effect
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: easings.easeInOut
      }
    }
  },

  // Spin effect
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  },

  // Bounce effect
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: easings.easeInOut
      }
    }
  },

  // Skeleton loading
  skeleton: {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: easings.easeInOut
      }
    }
  }
} satisfies Record<string, Variants>;

// Page transition variants
export const pageTransitions = {
  // Fade transition
  fade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: durations.slow, ease: easings.easeOut }
    },
    exit: { 
      opacity: 0,
      transition: { duration: durations.normal, ease: easings.easeIn }
    }
  },

  // Slide up transition
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: durations.slow, ease: easings.easeOut }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: durations.normal, ease: easings.easeIn }
    }
  }
} satisfies Record<string, Variants>;

// Utility functions for animation optimization
export const animationUtils = {
  // Viewport configuration for scroll animations
  viewport: {
    once: true,
    margin: '-50px',
    amount: 0.3
  },

  // Reduced motion configuration
  reducedMotion: {
    duration: 0.01,
    ease: 'linear'
  },

  // Performance optimized transform properties
  optimizedTransform: {
    // Use transform3d to enable hardware acceleration
    transform: 'translate3d(0, 0, 0)',
    // Use will-change sparingly and remove after animation
    willChange: 'transform, opacity'
  },

  // Create staggered animation with custom delay
  createStagger: (baseDelay = 0.1) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: baseDelay,
        delayChildren: baseDelay * 0.5
      }
    }
  }),

  // Create responsive animation based on screen size
  createResponsiveAnimation: (mobile: Variants, desktop: Variants) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile ? mobile : desktop;
  }
};

// Animation presets for common components
export const componentAnimations = {
  // Card hover effect
  card: {
    rest: { 
      y: 0, 
      scale: 1,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    hover: { 
      y: -8, 
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: durations.fast, ease: easings.easeOut }
    }
  },

  // Button hover effect
  button: {
    rest: { 
      scale: 1,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: durations.fast, ease: easings.easeOut }
    }
  },

  // Icon hover effect
  icon: {
    rest: { 
      rotate: 0, 
      scale: 1,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    hover: { 
      rotate: 5, 
      scale: 1.1,
      transition: { duration: durations.fast, ease: easings.easeOut }
    }
  },

  // Text reveal effect
  textReveal: {
    hidden: { 
      opacity: 0, 
      y: 20,
      skewY: 5
    },
    visible: { 
      opacity: 1, 
      y: 0,
      skewY: 0,
      transition: { 
        duration: durations.slow,
        ease: easings.easeOut
      }
    }
  }
};

// Performance monitoring utilities
export const performanceUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get optimized animation config based on device capabilities
  getOptimizedConfig: () => {
    if (typeof window === 'undefined') return {};
    
    const isLowEndDevice = navigator.hardwareConcurrency <= 2;
    const prefersReduced = performanceUtils.prefersReducedMotion();
    
    if (prefersReduced || isLowEndDevice) {
      return {
        duration: 0.01,
        ease: 'linear',
        reduce: true
      };
    }
    
    return {
      duration: durations.normal,
      ease: easings.easeOut,
      reduce: false
    };
  }
};