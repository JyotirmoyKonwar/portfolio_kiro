import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * Custom hook for scroll-triggered animations with performance optimization
 */
export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.3,
    rootMargin = '-50px',
    triggerOnce = true,
    delay = 0
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: rootMargin as any,
    amount: threshold
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      if (delay > 0) {
        const timer = setTimeout(() => setShouldAnimate(true), delay);
        return () => clearTimeout(timer);
      } else {
        setShouldAnimate(true);
      }
    }
  }, [isInView, delay]);

  return {
    ref,
    isInView,
    shouldAnimate,
    controls: {
      initial: 'hidden',
      animate: shouldAnimate ? 'visible' : 'hidden',
      viewport: { once: triggerOnce, margin: rootMargin, amount: threshold }
    }
  };
};

/**
 * Hook for staggered scroll animations
 */
export const useStaggeredScrollAnimation = (
  itemCount: number,
  options: ScrollAnimationOptions & { staggerDelay?: number } = {}
) => {
  const {
    threshold = 0.3,
    rootMargin = '-50px',
    triggerOnce = true,
    staggerDelay = 0.1
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: rootMargin as any,
    amount: threshold
  });

  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isInView) {
      // Stagger the animation of items
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setAnimatedItems(prev => new Set([...prev, i]));
        }, i * staggerDelay * 1000);
      }
    }
  }, [isInView, itemCount, staggerDelay]);

  const getItemAnimation = (index: number) => ({
    initial: 'hidden',
    animate: animatedItems.has(index) ? 'visible' : 'hidden'
  });

  return {
    ref,
    isInView,
    getItemAnimation,
    containerControls: {
      initial: 'hidden',
      animate: isInView ? 'visible' : 'hidden',
      viewport: { once: triggerOnce, margin: rootMargin, amount: threshold }
    }
  };
};

/**
 * Hook for parallax scroll effects
 */
export const useParallaxScroll = (speed: number = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      setOffsetY(rate);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [speed]);

  return {
    ref,
    offsetY,
    transform: `translateY(${offsetY}px)`
  };
};

/**
 * Hook for scroll progress tracking
 */
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  return scrollProgress;
};

/**
 * Hook for element visibility tracking
 */
export const useElementVisibility = (threshold: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, hasBeenVisible]);

  return {
    ref,
    isVisible,
    hasBeenVisible
  };
};