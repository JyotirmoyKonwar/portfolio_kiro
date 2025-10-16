import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { scrollAnimations, performanceUtils } from '../../utils/animations';
import type { ComponentProps } from '../../types';

interface AnimatedSectionProps extends ComponentProps {
  animation?: keyof typeof scrollAnimations;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.3,
  rootMargin = '-50px',
  triggerOnce = true,
  stagger = false,
  staggerDelay = 0.1,
  as: Component = 'div',
  ...props
}) => {
  const { ref, controls } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
    delay
  });

  // Get optimized animation config based on user preferences and device capabilities
  const optimizedConfig = performanceUtils.getOptimizedConfig();
  
  // Use reduced motion if user prefers it or device is low-end
  const animationVariants = optimizedConfig.reduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } }
      }
    : stagger 
      ? {
          ...scrollAnimations.staggerContainer,
          visible: {
            ...scrollAnimations.staggerContainer.visible,
            transition: {
              ...scrollAnimations.staggerContainer.visible.transition,
              staggerChildren: staggerDelay
            }
          }
        }
      : scrollAnimations[animation];

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={animationVariants}
      {...controls}
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Specialized animated components
export const AnimatedCard: React.FC<ComponentProps & {
  hoverEffect?: boolean;
  delay?: number;
}> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  delay = 0,
  ...props 
}) => {
  const { ref, controls } = useScrollAnimation({ delay });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={scrollAnimations.scaleIn}
      {...controls}
      whileHover={hoverEffect ? { 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : undefined}
      whileTap={hoverEffect ? { 
        scale: 0.98,
        transition: { duration: 0.1, ease: 'easeOut' }
      } : undefined}
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedText: React.FC<ComponentProps & {
  delay?: number;
  stagger?: boolean;
}> = ({ 
  children, 
  className = '', 
  delay = 0,
  stagger = false,
  ...props 
}) => {
  const { ref, controls } = useScrollAnimation({ delay });

  if (stagger && typeof children === 'string') {
    // Split text into words for stagger effect
    const words = children.split(' ');
    
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={scrollAnimations.staggerContainer}
        {...controls}
        {...props}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            className="inline-block mr-1"
            variants={scrollAnimations.fadeInUp}
            style={{ willChange: 'transform, opacity' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={scrollAnimations.fadeInUp}
      {...controls}
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedList: React.FC<ComponentProps & {
  staggerDelay?: number;
}> = ({ 
  children, 
  className = '', 
  staggerDelay = 0.1,
  ...props 
}) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      {...controls}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={scrollAnimations.fadeInUp}
          style={{ willChange: 'transform, opacity' }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Performance-optimized animated grid
export const AnimatedGrid: React.FC<ComponentProps & {
  columns?: number;
  gap?: string;
  staggerDelay?: number;
}> = ({ 
  children, 
  className = '', 
  columns = 3,
  gap = 'gap-6',
  staggerDelay = 0.05,
  ...props 
}) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-${columns} ${gap} ${className}`}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      {...controls}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={scrollAnimations.scaleIn}
          style={{ willChange: 'transform, opacity' }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};