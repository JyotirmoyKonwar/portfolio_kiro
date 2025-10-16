// Portfolio data types
export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  bio: string;
  resumeUrl: string;
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  scholar: string;
  twitter: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  social: SocialLinks;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl: string;
  featured: boolean;
  category: 'ML' | 'AI' | 'Data Science' | 'Research' | 'NLP' | 'Agentic AI';
}

// Skills types
export interface Skill {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon?: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

// About section types
export interface Education {
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface ResearchInterest {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
}

export interface AboutStats {
  yearsOfStudy: number;
  projectsCompleted: number;
}

export interface AboutData {
  name: string;
  title: string;
  introduction: string;
  summary: string;
  detailedBackground: string;
  currentFocus: string;
  careerGoals: string;
  education: Education[];
  researchInterests: ResearchInterest[];
  stats: AboutStats;
}

// Research types
export interface ResearchEntry {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  pdfUrl?: string;
  arxivUrl?: string;
  status: 'published' | 'submitted' | 'in-progress';
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  type: 'download' | 'view' | 'contact';
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
  ipHash?: string;
}

export interface AnalyticsData {
  events: AnalyticsEvent[];
  totalDownloads: number;
  totalViews: number;
  totalContacts: number;
}

// Component props types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SectionProps extends ComponentProps {
  id?: string;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}