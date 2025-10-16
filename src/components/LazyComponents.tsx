import React, { Suspense, lazy } from 'react';
import { 
  ProjectsLoadingFallback, 
  SkillsLoadingFallback, 
  ResearchLoadingFallback,
  SectionLoadingFallback 
} from '../utils/lazyLoading';
import { SectionErrorBoundary } from './UI/ErrorBoundary';

// Create lazy components using React.lazy
const LazyProjectsComponent = lazy(() => import('./Projects/Projects').then(module => ({ default: module.Projects })));
const LazyResearchComponent = lazy(() => import('./Research/Research').then(module => ({ default: module.Research })));
const LazySkillsComponent = lazy(() => import('./Skills/Skills').then(module => ({ default: module.Skills })));
const LazyContactComponent = lazy(() => import('./Contact/Contact').then(module => ({ default: module.Contact })));
const LazyAnalyticsDashboardComponent = lazy(() => import('./Analytics/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));

// Wrapped components with error boundaries and loading states
export const LazyProjects: React.FC = () => (
  <SectionErrorBoundary sectionName="Projects">
    <Suspense fallback={<ProjectsLoadingFallback />}>
      <LazyProjectsComponent />
    </Suspense>
  </SectionErrorBoundary>
);

export const LazyResearch: React.FC = () => (
  <SectionErrorBoundary sectionName="Research">
    <Suspense fallback={<ResearchLoadingFallback />}>
      <LazyResearchComponent />
    </Suspense>
  </SectionErrorBoundary>
);

export const LazySkills: React.FC = () => (
  <SectionErrorBoundary sectionName="Skills">
    <Suspense fallback={<SkillsLoadingFallback />}>
      <LazySkillsComponent />
    </Suspense>
  </SectionErrorBoundary>
);

export const LazyContact: React.FC = () => (
  <SectionErrorBoundary sectionName="Contact">
    <Suspense fallback={<SectionLoadingFallback title="Contact" />}>
      <LazyContactComponent />
    </Suspense>
  </SectionErrorBoundary>
);

export const LazyAnalyticsDashboard: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <Suspense fallback={
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="text-slate-300 mt-4">Loading Analytics...</p>
      </div>
    </div>
  }>
    <LazyAnalyticsDashboardComponent {...props} />
  </Suspense>
);

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload About component since it's above the fold
  import('./About/About');
  
  // Preload Projects after a short delay since it's likely to be viewed
  setTimeout(() => {
    import('./Projects/Projects');
  }, 1000);
  
  // Preload other components on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('./Research/Research');
      import('./Skills/Skills');
      import('./Contact/Contact');
    });
  } else {
    setTimeout(() => {
      import('./Research/Research');
      import('./Skills/Skills');
      import('./Contact/Contact');
    }, 2000);
  }
};