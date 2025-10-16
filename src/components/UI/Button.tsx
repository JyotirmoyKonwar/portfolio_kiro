import React from 'react';
import { motion } from 'framer-motion';
import type { ComponentProps } from '../../types';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  href?: string;
  target?: string;
  type?: 'button' | 'submit' | 'reset';
}

const buttonVariants = {
  primary: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-cyan-500/25',
  secondary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25',
  outline: 'bg-transparent border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white',
  ghost: 'bg-transparent text-slate-400 hover:text-cyan-500 hover:bg-slate-800/50'
};

const buttonSizes = {
  sm: 'px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base min-h-[44px]',
  md: 'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base min-h-[44px]',
  lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg min-h-[48px]'
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  href,
  target,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';
  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        className={combinedClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        role="button"
        {...props}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};