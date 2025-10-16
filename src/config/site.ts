/**
 * Site configuration file
 * This file contains global settings and constants for the portfolio website
 */

export const siteConfig = {
  // Site metadata
  meta: {
    title: 'AI Portfolio - CS M. Tech Student',
    description: 'Professional portfolio showcasing AI and Data Science projects, research, and skills',
    keywords: ['AI', 'Data Science', 'Machine Learning', 'Computer Science', 'Portfolio'],
    author: 'Your Name',
    url: 'https://your-portfolio-url.com',
    image: '/images/og-image.jpg'
  },

  // Navigation sections
  navigation: [
    { id: 'hero', label: 'Home', href: '#hero' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'experience', label: 'Experience', href: '#experience' },
    { id: 'research', label: 'Research', href: '#research' },
    { id: 'skills', label: 'Skills', href: '#skills' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ],

  // Animation settings
  animations: {
    // Duration in milliseconds
    duration: {
      fast: 200,
      normal: 300,
      slow: 500
    },
    // Easing functions
    easing: {
      default: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    // Stagger delays for list animations
    stagger: {
      children: 0.1,
      items: 0.05
    }
  },

  // Theme colors (matching Tailwind config)
  colors: {
    primary: {
      bg: '#0f172a',      // slate-900
      bgSecondary: '#1e293b', // slate-800
      accent: '#06b6d4',   // cyan-500
      accentSecondary: '#3b82f6', // blue-500
      text: '#f8fafc',     // slate-50
      textSecondary: '#94a3b8', // slate-400
      highlight: '#818cf8'  // indigo-400
    }
  },

  // Layout settings
  layout: {
    maxWidth: '1200px',
    padding: {
      mobile: '1rem',
      tablet: '2rem',
      desktop: '3rem'
    },
    section: {
      spacing: '6rem', // Space between sections
      paddingY: '4rem' // Vertical padding within sections
    }
  },

  // Project settings
  projects: {
    featuredCount: 3,
    categories: ['ML', 'AI', 'Data Science', 'Research'] as const,
    defaultImage: '/images/project-placeholder.jpg'
  },

  // Skills settings
  skills: {
    categories: [
      'Programming Languages',
      'AI/ML Frameworks',
      'Data Science Tools',
      'Web Technologies',
      'Tools & Platforms'
    ],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const
  },

  // Research settings
  research: {
    statuses: ['published', 'submitted', 'in-progress'] as const,
    maxAbstractLength: 300 // Characters to show before truncation
  },

  // Contact settings
  contact: {
    email: {
      subject: 'Portfolio Contact',
      body: 'Hello, I found your portfolio and would like to connect...'
    }
  },

  // Analytics settings
  analytics: {
    enabled: true,
    trackDownloads: true,
    trackViews: true,
    trackContacts: true,
    storageKey: 'portfolio-analytics'
  },

  // Performance settings
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    preloadCritical: true
  },

  // External links
  external: {
    resume: '/documents/resume.pdf',
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourprofile'
  }
} as const;

// Type for the site configuration
export type SiteConfig = typeof siteConfig;

// Helper functions for configuration
export const getNavigationItem = (id: string) => 
  siteConfig.navigation.find(item => item.id === id);

export const getProjectCategory = (category: string) =>
  siteConfig.projects.categories.includes(category as any);

export const getSkillLevel = (level: string) =>
  siteConfig.skills.levels.includes(level as any);

export const getResearchStatus = (status: string) =>
  siteConfig.research.statuses.includes(status as any);

export default siteConfig;