import React from 'react';
import { Navigation } from './Navigation';
import { ScrollProgress, ScrollToTop } from '../UI';
import type { ComponentProps } from '../../types';

interface LayoutProps extends ComponentProps {
  showNavigation?: boolean;
  showScrollProgress?: boolean;
  showScrollToTop?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  showNavigation = true,
  showScrollProgress = true,
  showScrollToTop = true,
  ...props
}) => {
  return (
    <div 
      className={`min-h-screen bg-slate-900 text-slate-50 ${className}`} 
      {...props}
    >
      {/* Header with navigation */}
      {showNavigation && (
        <header role="banner" aria-label="Site navigation">
          <Navigation />
        </header>
      )}
      
      {/* Scroll progress indicator */}
      {showScrollProgress && (
        <div role="progressbar" aria-label="Page scroll progress">
          <ScrollProgress />
        </div>
      )}
      
      {/* Main content area - children should include main element */}
      <div className={showNavigation ? 'pt-14 sm:pt-16' : ''}>
        {children}
      </div>
      
      {/* Scroll to top button */}
      {showScrollToTop && (
        <aside aria-label="Scroll to top">
          <ScrollToTop />
        </aside>
      )}
    </div>
  );
};