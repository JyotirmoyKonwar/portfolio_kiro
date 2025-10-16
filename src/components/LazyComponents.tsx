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
const LazyExperienceComponent = lazy(() => import('./Experience/Experience').then(module => ({ default: module.Experience })));
const LazyResearchComponent = lazy(() => import('./Research/Research').then(module => ({ default: module.Research })));
const LazySkillsComponent = lazy(() => import('./Skills/Skills').then(module => ({ default: module.Skills })));
const LazyContactComponent = lazy(() => import('./Contact/Contact').then(module => ({ default: module.Contact })));


// Wrapped components with error boundaries and loading states
export const LazyProjects: React.FC = () => (
  <SectionErrorBoundary sectionName="Projects">
    <Suspense fallback={<ProjectsLoadingFallback />}>
      <LazyProjectsComponent />
    </Suspense>
  </SectionErrorBoundary>
);

export const LazyExperience: React.FC = () => (
  <SectionErrorBoundary sectionName="Experience">
    <Suspense fallback={<SectionLoadingFallback title="Experience" />}>
      <LazyExperienceComponent />
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
      import('./Experience/Experience');
      import('./Research/Research');
      import('./Skills/Skills');
      import('./Contact/Contact');
    });
  } else {
    setTimeout(() => {
      import('./Experience/Experience');
      import('./Research/Research');
      import('./Skills/Skills');
      import('./Contact/Contact');
    }, 2000);
  }
};