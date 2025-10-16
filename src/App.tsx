
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SEO } from './components/SEO';
import { ErrorBoundary, SectionErrorBoundary } from './components/UI/ErrorBoundary';
import { 
  LazyProjects, 
  LazyExperience,
  LazyResearch, 
  LazySkills, 
  LazyContact,
  preloadCriticalComponents 
} from './components/LazyComponents';
import { addFocusVisiblePolyfill } from './utils/accessibility';
import { initializePerformanceMonitoring } from './utils/performance';
import { initializeEmailService } from './config/emailConfig';
import './utils/accessibilityTest'; // Auto-run accessibility checks in development

// Main App Content Component
const AppContent = () => {

  useEffect(() => {
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Initialize accessibility features
    addFocusVisiblePolyfill();
    
    // Initialize email service
    initializeEmailService();
    
    // Preload critical components
    preloadCriticalComponents();
    
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    return () => {
      // Cleanup skip link
      if (document.body.contains(skipLink)) {
        document.body.removeChild(skipLink);
      }
    };
  }, []);

  return (
    <>
      <SEO />
      <Layout>
        {/* Main content with proper semantic structure */}
        <main id="main-content" role="main" aria-label="Portfolio content">
          {/* Hero Section - Critical, load immediately */}
          <SectionErrorBoundary sectionName="Hero">
            <Hero />
          </SectionErrorBoundary>
          
          {/* About Section - Above fold, load immediately */}
          <SectionErrorBoundary sectionName="About">
            <About />
          </SectionErrorBoundary>
          
          {/* Projects Section - Lazy loaded */}
          <LazyProjects />

          {/* Experience Section - Lazy loaded */}
          <LazyExperience />

          {/* Research Section - Lazy loaded */}
          <LazyResearch />

          {/* Skills Section - Lazy loaded */}
          <LazySkills />

          {/* Contact Section - Lazy loaded */}
          <LazyContact />
        </main>


      </Layout>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application error:', error, errorInfo);
        // Report to analytics if available
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'exception', {
            description: error.message,
            fatal: true
          });
        }
      }}
    >
      <HelmetProvider>
        <ThemeProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
