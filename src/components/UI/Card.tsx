import React from 'react';
import { motion } from 'framer-motion';
import type { ComponentProps } from '../../types';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

interface CardProps extends ComponentProps {
  variant?: CardVariant;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const cardVariants = {
  default: 'bg-slate-800 border border-slate-700/50',
  elevated: 'bg-slate-800 border border-slate-700/50 shadow-xl',
  outlined: 'bg-transparent border-2 border-slate-700',
  glass: 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/30'
};

const cardPadding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  padding = 'md',
  onClick,
  ...props
}) => {
  const baseClasses = 'rounded-lg transition-all duration-300';
  const variantClasses = cardVariants[variant];
  const paddingClasses = cardPadding[padding];
  const hoverClasses = hover ? 'hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${paddingClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <motion.div
      className={combinedClasses}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps extends ComponentProps {
  title?: string;
  subtitle?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  title,
  subtitle,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {title && (
        <h3 className="text-xl font-semibold text-slate-50 mb-1">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-slate-400 text-sm">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};

interface CardContentProps extends ComponentProps {}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`text-slate-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends ComponentProps {}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-700/50 ${className}`} {...props}>
      {children}
    </div>
  );
};