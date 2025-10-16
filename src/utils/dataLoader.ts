import type { 
  PortfolioData, 
  Project, 
  SkillCategory, 
  ResearchEntry,
  AboutData,
  Experience
} from '../types';

// Import JSON data
import portfolioDataJson from '../data/portfolio.json';
import aboutDataJson from '../data/about.json';
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';
import researchData from '../data/research.json';
import experienceData from '../data/experience.json';

/**
 * Data validation utilities
 */
export class DataValidator {
  static validatePortfolioData(data: any): data is PortfolioData {
    return (
      data &&
      typeof data === 'object' &&
      data.personal &&
      typeof data.personal.name === 'string' &&
      typeof data.personal.title === 'string' &&
      typeof data.personal.email === 'string' &&
      data.social &&
      typeof data.social.linkedin === 'string' &&
      typeof data.social.github === 'string'
    );
  }

  static validateProject(project: any): project is Project {
    return (
      project &&
      typeof project.id === 'string' &&
      typeof project.title === 'string' &&
      typeof project.description === 'string' &&
      Array.isArray(project.techStack) &&
      typeof project.githubUrl === 'string' &&
      typeof project.featured === 'boolean' &&
      ['ML', 'AI', 'Data Science', 'Research', 'NLP', 'Agentic AI'].includes(project.category)
    );
  }

  static validateSkillCategory(category: any): category is SkillCategory {
    return (
      category &&
      typeof category.category === 'string' &&
      Array.isArray(category.skills) &&
      category.skills.every((skill: any) => 
        typeof skill.name === 'string' &&
        (!skill.level || ['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(skill.level))
      )
    );
  }

  static validateResearchEntry(entry: any): entry is ResearchEntry {
    return (
      entry &&
      typeof entry.id === 'string' &&
      typeof entry.title === 'string' &&
      Array.isArray(entry.authors) &&
      typeof entry.venue === 'string' &&
      typeof entry.year === 'number' &&
      typeof entry.abstract === 'string' &&
      ['published', 'submitted', 'in-progress'].includes(entry.status)
    );
  }

  static validateAboutData(data: any): data is AboutData {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.name === 'string' &&
      typeof data.title === 'string' &&
      typeof data.introduction === 'string' &&
      typeof data.summary === 'string' &&
      typeof data.detailedBackground === 'string' &&
      typeof data.currentFocus === 'string' &&
      typeof data.careerGoals === 'string' &&
      Array.isArray(data.education) &&
      data.stats &&
      typeof data.stats.yearsOfStudy === 'number' &&
      typeof data.stats.projectsCompleted === 'number'
    );
  }

  static validateExperience(experience: any): experience is Experience {
    return (
      experience &&
      typeof experience.id === 'string' &&
      typeof experience.title === 'string' &&
      typeof experience.company === 'string' &&
      typeof experience.location === 'string' &&
      typeof experience.startDate === 'string' &&
      typeof experience.endDate === 'string' &&
      typeof experience.description === 'string' &&
      Array.isArray(experience.technologies) &&
      ['internship', 'full-time', 'part-time', 'freelance', 'project'].includes(experience.type)
    );
  }
}

/**
 * Data loading utilities with validation
 */
export class DataLoader {
  private static handleDataError(dataType: string, error: any): never {
    console.error(`Error loading ${dataType} data:`, error);
    throw new Error(`Failed to load ${dataType} data. Please check the data format.`);
  }

  /**
   * Load and validate portfolio data
   */
  static getPortfolioData(): PortfolioData {
    try {
      if (!DataValidator.validatePortfolioData(portfolioDataJson)) {
        throw new Error('Invalid portfolio data format');
      }
      return portfolioDataJson as PortfolioData;
    } catch (error) {
      this.handleDataError('portfolio', error);
    }
  }

  /**
   * Load and validate about data
   */
  static getAboutData(): AboutData {
    try {
      if (!DataValidator.validateAboutData(aboutDataJson)) {
        throw new Error('Invalid about data format');
      }
      return aboutDataJson as AboutData;
    } catch (error) {
      this.handleDataError('about', error);
    }
  }

  /**
   * Load and validate projects data
   */
  static getProjects(): Project[] {
    try {
      if (!Array.isArray(projectsData)) {
        throw new Error('Projects data must be an array');
      }
      
      const validatedProjects = projectsData.filter(project => {
        const isValid = DataValidator.validateProject(project);
        if (!isValid) {
          console.warn('Invalid project data found:', project);
        }
        return isValid;
      });

      return validatedProjects as Project[];
    } catch (error) {
      this.handleDataError('projects', error);
    }
  }

  /**
   * Load and validate skills data
   */
  static getSkills(): SkillCategory[] {
    try {
      if (!Array.isArray(skillsData)) {
        throw new Error('Skills data must be an array');
      }

      const validatedSkills = skillsData.filter(category => {
        const isValid = DataValidator.validateSkillCategory(category);
        if (!isValid) {
          console.warn('Invalid skill category data found:', category);
        }
        return isValid;
      });

      return validatedSkills as SkillCategory[];
    } catch (error) {
      this.handleDataError('skills', error);
    }
  }

  /**
   * Load and validate research data
   */
  static getResearch(): ResearchEntry[] {
    try {
      if (!Array.isArray(researchData)) {
        throw new Error('Research data must be an array');
      }

      const validatedResearch = researchData.filter(entry => {
        const isValid = DataValidator.validateResearchEntry(entry);
        if (!isValid) {
          console.warn('Invalid research entry data found:', entry);
        }
        return isValid;
      });

      return validatedResearch as ResearchEntry[];
    } catch (error) {
      this.handleDataError('research', error);
    }
  }

  /**
   * Get featured projects only
   */
  static getFeaturedProjects(): Project[] {
    return this.getProjects().filter(project => project.featured);
  }

  /**
   * Get projects by category
   */
  static getProjectsByCategory(category: Project['category']): Project[] {
    return this.getProjects().filter(project => project.category === category);
  }

  /**
   * Get skills by category
   */
  static getSkillsByCategory(categoryName: string): SkillCategory | undefined {
    return this.getSkills().find(category => category.category === categoryName);
  }

  /**
   * Get research by status
   */
  static getResearchByStatus(status: ResearchEntry['status']): ResearchEntry[] {
    return this.getResearch().filter(entry => entry.status === status);
  }

  /**
   * Get published research only
   */
  static getPublishedResearch(): ResearchEntry[] {
    return this.getResearchByStatus('published');
  }

  /**
   * Search projects by technology
   */
  static searchProjectsByTech(technology: string): Project[] {
    const searchTerm = technology.toLowerCase();
    return this.getProjects().filter(project => 
      project.techStack.some(tech => tech.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get all unique technologies from projects
   */
  static getAllTechnologies(): string[] {
    const allTech = this.getProjects().flatMap(project => project.techStack);
    return [...new Set(allTech)].sort();
  }

  /**
   * Load and validate experience data
   */
  static getExperience(): Experience[] {
    try {
      if (!Array.isArray(experienceData)) {
        throw new Error('Experience data must be an array');
      }

      const validatedExperience = experienceData.filter(experience => {
        const isValid = DataValidator.validateExperience(experience);
        if (!isValid) {
          console.warn('Invalid experience data found:', experience);
        }
        return isValid;
      });

      return validatedExperience as Experience[];
    } catch (error) {
      this.handleDataError('experience', error);
    }
  }

  /**
   * Get experience by type
   */
  static getExperienceByType(type: Experience['type']): Experience[] {
    return this.getExperience().filter(experience => experience.type === type);
  }

  /**
   * Get project statistics
   */
  static getProjectStats() {
    const projects = this.getProjects();
    const categories = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      categories,
      technologies: this.getAllTechnologies().length
    };
  }
}

/**
 * Data transformation utilities
 */
export class DataTransformer {
  /**
   * Transform project data for display
   */
  static formatProjectForDisplay(project: Project) {
    return {
      ...project,
      techStackString: project.techStack.join(', '),
      hasLiveDemo: !!project.liveUrl,
      categoryLabel: this.getCategoryLabel(project.category)
    };
  }

  /**
   * Get user-friendly category labels
   */
  static getCategoryLabel(category: Project['category']): string {
    const labels = {
      'ML': 'Machine Learning',
      'AI': 'Artificial Intelligence',
      'Data Science': 'Data Science',
      'Research': 'Research',
      'NLP': 'Natural Language Processing',
      'Agentic AI': 'Agentic AI'
    };
    return labels[category] || category;
  }

  /**
   * Format research entry for display
   */
  static formatResearchForDisplay(entry: ResearchEntry) {
    return {
      ...entry,
      authorsString: entry.authors.join(', '),
      statusLabel: this.getStatusLabel(entry.status),
      hasLinks: !!(entry.pdfUrl || entry.arxivUrl)
    };
  }

  /**
   * Get user-friendly status labels
   */
  static getStatusLabel(status: ResearchEntry['status']): string {
    const labels = {
      'published': 'Published',
      'submitted': 'Under Review',
      'in-progress': 'In Progress'
    };
    return labels[status] || status;
  }

  /**
   * Format skill level for display
   */
  static getSkillLevelColor(level?: string): string {
    const colors = {
      'Beginner': 'bg-yellow-500',
      'Intermediate': 'bg-blue-500',
      'Advanced': 'bg-green-500',
      'Expert': 'bg-purple-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  }
}

// Export default data loaders for convenience
export const getPortfolioData = () => DataLoader.getPortfolioData();
export const getAboutData = () => DataLoader.getAboutData();
export const getProjects = () => DataLoader.getProjects();
export const getSkills = () => DataLoader.getSkills();
export const getResearch = () => DataLoader.getResearch();
export const getExperience = () => DataLoader.getExperience();

export default DataLoader;