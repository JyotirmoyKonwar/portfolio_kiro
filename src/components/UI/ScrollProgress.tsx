import React from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useScrollAnimation';

interface ScrollProgressProps {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
  height?: 'thin' | 'medium' | 'thick';
  position?: 'top' | 'bottom';
}

const colorClasses = {
  primary: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  secondary: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  accent: 'bg-gradient-to-r from-indigo-400 to-purple-500'
};

const heightClasses = {
  thin: 'h-0.5',
  medium: 'h-1',
  thick: 'h-1.5'
};

const positionClasses = {
  top: 'top-0',
  bottom: 'bottom-0'
};

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = '',
  color = 'primary',
  height = 'thin',
  position = 'top'
}) => {
  const scrollProgress = useScrollProgress();

  return (
    <div 
      className={`fixed left-0 right-0 z-50 ${positionClasses[position]} ${className}`}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`w-full ${heightClasses[height]} bg-slate-800/50`}>
        <motion.div
          className={`${heightClasses[height]} ${colorClasses[color]} origin-left`}
          style={{
            scaleX: scrollProgress,
            willChange: 'transform'
          }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </div>
  );
};

// Circular scroll progress indicator
interface CircularScrollProgressProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
  showPercentage?: boolean;
}

const sizeClasses = {
  sm: { container: 'w-12 h-12', stroke: '2', text: 'text-xs' },
  md: { container: 'w-16 h-16', stroke: '3', text: 'text-sm' },
  lg: { container: 'w-20 h-20', stroke: '4', text: 'text-base' }
};

const strokeColors = {
  primary: 'stroke-cyan-500',
  secondary: 'stroke-blue-500',
  accent: 'stroke-indigo-400'
};

export const CircularScrollProgress: React.FC<CircularScrollProgressProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  showPercentage = false
}) => {
  const scrollProgress = useScrollProgress();
  const { container, stroke, text } = sizeClasses[size];
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress * circumference);
  const percentage = Math.round(scrollProgress * 100);

  return (
    <div className={`${container} ${className}`}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 50 50"
      >
        {/* Background circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={strokeColors[color]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{ willChange: 'stroke-dashoffset' }}
        />
      </svg>
      
      {showPercentage && (
        <div className={`absolute inset-0 flex items-center justify-center ${text} font-medium text-slate-300`}>
          {percentage}%
        </div>
      )}
    </div>
  );
};

// Scroll to top button with progress
interface ScrollToTopProps {
  threshold?: number;
  className?: string;
  showProgress?: boolean;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 0.2,
  className = '',
  showProgress = true
}) => {
  const scrollProgress = useScrollProgress();
  const isVisible = scrollProgress > threshold;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className={`fixed bottom-6 right-6 z-40 p-3 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 touch-manipulation ${className}`}
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{ 
        pointerEvents: isVisible ? 'auto' : 'none',
        willChange: 'transform, opacity'
      }}
      aria-label="Scroll to top of page"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      {showProgress ? (
        <CircularScrollProgress size="sm" showPercentage={false} />
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      )}
    </motion.button>
  );
};