/**
 * Application constants
 */

// API endpoints (for future use)
export const API_ENDPOINTS = {
  CONTACT: '/api/contact',
  ANALYTICS: '/api/analytics',
  RESUME_DOWNLOAD: '/api/resume/download'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  ANALYTICS: 'portfolio-analytics',
  THEME: 'portfolio-theme',
  PREFERENCES: 'portfolio-preferences'
} as const;

// Event types for analytics
export const ANALYTICS_EVENTS = {
  RESUME_DOWNLOAD: 'resume_download',
  RESUME_VIEW: 'resume_view',
  CONTACT_FORM: 'contact_form',
  PROJECT_VIEW: 'project_view',
  EXTERNAL_LINK: 'external_link',
  SECTION_VIEW: 'section_view'
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// Animation variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
} as const;

// Social media platforms
export const SOCIAL_PLATFORMS = {
  LINKEDIN: 'linkedin',
  GITHUB: 'github',
  TWITTER: 'twitter',
  SCHOLAR: 'scholar',
  EMAIL: 'email'
} as const;

// File types and extensions
export const FILE_TYPES = {
  PDF: 'application/pdf',
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const;

// Error messages
export const ERROR_MESSAGES = {
  DATA_LOAD_FAILED: 'Failed to load data. Please try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  REQUIRED_FIELD: 'This field is required.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CONTACT_SENT: 'Message sent successfully!',
  RESUME_DOWNLOADED: 'Resume downloaded successfully!',
  DATA_LOADED: 'Data loaded successfully!'
} as const;

// Regular expressions for validation
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  GITHUB_URL: /^https:\/\/github\.com\/.+/,
  LINKEDIN_URL: /^https:\/\/(www\.)?linkedin\.com\/.+/
} as const;

// Default values
export const DEFAULTS = {
  PROJECT_IMAGE: '/images/project-placeholder.jpg',
  AVATAR_IMAGE: '/images/avatar-placeholder.jpg',
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  SCROLL_OFFSET: 80
} as const;

// Feature flags (for enabling/disabling features)
export const FEATURES = {
  ANALYTICS: true,
  CONTACT_FORM: true,
  RESUME_DOWNLOAD: true,
  DARK_MODE: false, // Only dark mode for now
  ANIMATIONS: true,
  LAZY_LOADING: true
} as const;

export default {
  API_ENDPOINTS,
  STORAGE_KEYS,
  ANALYTICS_EVENTS,
  BREAKPOINTS,
  ANIMATION_VARIANTS,
  SOCIAL_PLATFORMS,
  FILE_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  DEFAULTS,
  FEATURES
};