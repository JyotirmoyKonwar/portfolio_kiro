// Data loading and validation utilities
export {
  DataLoader,
  DataValidator,
  DataTransformer,
  getPortfolioData,
  getProjects,
  getSkills,
  getResearch
} from './dataLoader';

// Animation utilities
export {
  easings,
  durations,
  scrollAnimations,
  hoverAnimations,
  loadingAnimations,
  pageTransitions,
  animationUtils,
  componentAnimations,
  performanceUtils
} from './animations';

// Re-export types for convenience
export type {
  PortfolioData,
  PersonalInfo,
  SocialLinks,
  Project,
  Skill,
  SkillCategory,
  ResearchEntry,
  AnalyticsEvent,
  AnalyticsData
} from '../types';