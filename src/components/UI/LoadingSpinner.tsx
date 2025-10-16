import React from 'react';
import { motion } from 'framer-motion';
import { loadingAnimations } from '../../utils/animations';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-cyan-500',
  secondary: 'text-blue-500',
  accent: 'text-indigo-400'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  className = ''
}) => {
  const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  if (variant === 'spinner') {
    return (
      <motion.div
        className={`${baseClasses} border-2 border-current border-t-transparent rounded-full`}
        variants={loadingAnimations.spin}
        animate="animate"
        style={{ willChange: 'transform' }}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 ${colorClasses[color]} bg-current rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut'
            }}
            style={{ willChange: 'transform, opacity' }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${baseClasses} bg-current rounded-full`}
        variants={loadingAnimations.pulse}
        animate="animate"
        style={{ willChange: 'transform, opacity' }}
      />
    );
  }

  if (variant === 'skeleton') {
    return (
      <motion.div
        className={`${baseClasses} bg-slate-700 rounded`}
        variants={loadingAnimations.skeleton}
        animate="animate"
        style={{ willChange: 'opacity' }}
      />
    );
  }

  return null;
};

// Skeleton loading components for different content types
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <motion.div
        key={index}
        className={`h-4 bg-slate-700 rounded ${
          index === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
        variants={loadingAnimations.skeleton}
        animate="animate"
        style={{ 
          willChange: 'opacity',
          animationDelay: `${index * 0.1}s`
        }}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{
  className?: string;
  showImage?: boolean;
}> = ({ className = '', showImage = true }) => (
  <div className={`p-6 bg-slate-800/50 rounded-lg border border-slate-700/50 ${className}`}>
    {showImage && (
      <motion.div
        className="w-full h-48 bg-slate-700 rounded-lg mb-4"
        variants={loadingAnimations.skeleton}
        animate="animate"
        style={{ willChange: 'opacity' }}
      />
    )}
    <motion.div
      className="h-6 bg-slate-700 rounded w-3/4 mb-3"
      variants={loadingAnimations.skeleton}
      animate="animate"
      style={{ willChange: 'opacity', animationDelay: '0.1s' }}
    />
    <SkeletonText lines={3} />
    <div className="flex space-x-2 mt-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-6 w-16 bg-slate-700 rounded-full"
          variants={loadingAnimations.skeleton}
          animate="animate"
          style={{ 
            willChange: 'opacity',
            animationDelay: `${0.2 + i * 0.1}s`
          }}
        />
      ))}
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{
  items?: number;
  columns?: number;
  className?: string;
}> = ({ items = 6, columns = 3, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);