import React, { Suspense, lazy } from 'react';
import type { ComponentType } from 'react';
import { LoadingSpinner, SkeletonGrid } from '../components/UI/LoadingSpinner';
import { ErrorBoundary } from '../components/UI/ErrorBoundary';

// Generic lazy loading wrapper with error boundary and loading state
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode,
  errorFallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);

  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || <LoadingSpinner size="lg" />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `LazyLoaded(Component)`;
  
  return WrappedComponent;
};

// Specific loading fallbacks for different component types
export const SectionLoadingFallback: React.FC<{ title?: string }> = ({ title }) => (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      {title && (
        <div className="text-center mb-12">
          <div className="h-8 bg-slate-700 rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-slate-700 rounded w-96 mx-auto animate-pulse" />
        </div>
      )}
      <SkeletonGrid items={6} columns={3} />
    </div>
  </section>
);

export const ProjectsLoadingFallback = () => (
  <SectionLoadingFallback title="Projects" />
);

export const SkillsLoadingFallback = () => (
  <section className="py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-8 bg-slate-700 rounded w-32 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-slate-700 rounded w-64 mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-slate-700 rounded w-24 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-8 bg-slate-700 rounded-full w-16 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ResearchLoadingFallback = () => (
  <section className="py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-8 bg-slate-700 rounded w-40 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-slate-700 rounded w-80 mx-auto animate-pulse" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
            <div className="h-6 bg-slate-700 rounded w-3/4 mb-3 animate-pulse" />
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-700 rounded w-full animate-pulse" />
              <div className="h-3 bg-slate-700 rounded w-5/6 animate-pulse" />
              <div className="h-3 bg-slate-700 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Intersection Observer hook for lazy loading sections
export const useIntersectionObserver = (
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  const [ref, setRef] = React.useState<Element | null>(null);

  React.useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, callback, options]);

  return setRef;
};

// Note: For Vite compatibility, use static imports in LazyComponents.tsx instead of dynamic paths
// This ensures proper code splitting and bundle analysis

// Preload function for critical components
export const preloadComponent = (importFunc: () => Promise<any>) => {
  // Preload on idle or after a delay
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => importFunc());
  } else {
    setTimeout(() => importFunc(), 100);
  }
};

// Bundle splitting configuration helper
export const getBundleConfig = () => ({
  // Critical components (loaded immediately)
  critical: ['Hero', 'Navigation', 'Layout'],
  
  // Above-the-fold components (preloaded)
  aboveFold: ['About'],
  
  // Below-the-fold components (lazy loaded)
  belowFold: ['Projects', 'Research', 'Skills', 'Contact'],
  
  // Optional components (loaded on demand)
  optional: ['AnalyticsDashboard', 'ContactForm']
});

// Performance monitoring
export const measureComponentLoad = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    if (import.meta.env.DEV) {
      console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    // Report to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'component_load_time', {
        component_name: componentName,
        load_time: Math.round(loadTime)
      });
    }
  };
};