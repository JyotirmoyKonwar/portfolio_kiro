import React from 'react';
import type { ComponentProps } from '../../types';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps extends ComponentProps {
  size?: ContainerSize;
  padding?: boolean;
  center?: boolean;
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'lg',
  padding = true,
  center = true,
  ...props
}) => {
  const sizeClasses = containerSizes[size];
  // Enhanced responsive padding with better mobile spacing and safe areas
  const paddingClasses = padding ? 'px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 safe-area-inset-x' : '';
  const centerClasses = center ? 'mx-auto' : '';
  
  const combinedClasses = `${sizeClasses} ${paddingClasses} ${centerClasses} ${className}`;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

interface SectionProps extends ComponentProps {
  id?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'primary' | 'secondary';
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const sectionPadding = {
  none: '',
  sm: 'py-8 sm:py-12 md:py-16',
  md: 'py-12 sm:py-16 md:py-20 lg:py-24',
  lg: 'py-16 sm:py-20 md:py-24 lg:py-28',
  xl: 'py-20 sm:py-24 md:py-28 lg:py-32'
};

const sectionBackgrounds = {
  transparent: '',
  primary: 'bg-slate-900',
  secondary: 'bg-slate-800/50'
};

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  padding = 'lg',
  background = 'transparent',
  ...props
}) => {
  const paddingClasses = sectionPadding[padding];
  const backgroundClasses = sectionBackgrounds[background];
  
  const combinedClasses = `${paddingClasses} ${backgroundClasses} ${className}`;

  return (
    <section id={id} className={combinedClasses} {...props}>
      {children}
    </section>
  );
};