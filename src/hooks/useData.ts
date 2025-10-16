import { useState, useEffect, useMemo } from 'react';
import { DataLoader, DataTransformer } from '../utils/dataLoader';
import type { 
  PortfolioData, 
  Project, 
  SkillCategory, 
  ResearchEntry,
  AboutData,
  Experience
} from '../types';

/**
 * Custom hook for loading and managing about data
 */
export const useAboutData = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const aboutData = DataLoader.getAboutData();
      setData(aboutData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load about data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
};

/**
 * Custom hook for loading and managing portfolio data
 */
export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const portfolioData = DataLoader.getPortfolioData();
      setData(portfolioData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
};

/**
 * Custom hook for loading and managing projects data
 */
export const useProjectsData = () => {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const projects = DataLoader.getProjects();
      setData(projects);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized computed values
  const featuredProjects = useMemo(() => 
    data.filter(project => project.featured), [data]
  );

  const projectsByCategory = useMemo(() => 
    data.reduce((acc, project) => {
      if (!acc[project.category]) {
        acc[project.category] = [];
      }
      acc[project.category].push(project);
      return acc;
    }, {} as Record<string, Project[]>), [data]
  );

  const allTechnologies = useMemo(() => 
    [...new Set(data.flatMap(project => project.techStack))].sort(), [data]
  );

  const stats = useMemo(() => DataLoader.getProjectStats(), [data]);

  return { 
    data, 
    loading, 
    error, 
    featuredProjects, 
    projectsByCategory, 
    allTechnologies,
    stats
  };
};

/**
 * Custom hook for loading and managing skills data
 */
export const useSkillsData = () => {
  const [data, setData] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const skills = DataLoader.getSkills();
      setData(skills);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized computed values
  const skillsByCategory = useMemo(() => 
    data.reduce((acc, category) => {
      acc[category.category] = category.skills;
      return acc;
    }, {} as Record<string, SkillCategory['skills']>), [data]
  );

  const allSkills = useMemo(() => 
    data.flatMap(category => category.skills), [data]
  );

  const skillLevels = useMemo(() => {
    const levels = allSkills.reduce((acc, skill) => {
      if (skill.level) {
        acc[skill.level] = (acc[skill.level] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    return levels;
  }, [allSkills]);

  return { 
    data, 
    loading, 
    error, 
    skillsByCategory, 
    allSkills, 
    skillLevels 
  };
};

/**
 * Custom hook for loading and managing research data
 */
export const useResearchData = () => {
  const [data, setData] = useState<ResearchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const research = DataLoader.getResearch();
      setData(research);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load research data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized computed values
  const publishedResearch = useMemo(() => 
    data.filter(entry => entry.status === 'published'), [data]
  );

  const researchByStatus = useMemo(() => 
    data.reduce((acc, entry) => {
      if (!acc[entry.status]) {
        acc[entry.status] = [];
      }
      acc[entry.status].push(entry);
      return acc;
    }, {} as Record<string, ResearchEntry[]>), [data]
  );

  const recentResearch = useMemo(() => 
    [...data].sort((a, b) => b.year - a.year).slice(0, 3), [data]
  );

  return { 
    data, 
    loading, 
    error, 
    publishedResearch, 
    researchByStatus, 
    recentResearch 
  };
};

/**
 * Custom hook for loading and managing experience data
 */
export const useExperienceData = () => {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const experience = DataLoader.getExperience();
      setData(experience);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load experience data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized computed values
  const experienceByType = useMemo(() => 
    data.reduce((acc, exp) => {
      if (!acc[exp.type]) {
        acc[exp.type] = [];
      }
      acc[exp.type].push(exp);
      return acc;
    }, {} as Record<string, Experience[]>), [data]
  );

  const allTechnologies = useMemo(() => 
    [...new Set(data.flatMap(exp => exp.technologies))].sort(), [data]
  );

  const recentExperience = useMemo(() => 
    [...data].sort((a, b) => {
      // Sort by end date, with "Present" being most recent
      if (a.endDate === 'Present') return -1;
      if (b.endDate === 'Present') return 1;
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }).slice(0, 3), [data]
  );

  return { 
    data, 
    loading, 
    error, 
    experienceByType, 
    allTechnologies,
    recentExperience
  };
};

/**
 * Custom hook for searching and filtering data
 */
export const useDataSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const searchProjects = useMemo(() => {
    return (projects: Project[]) => {
      let filtered = projects;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(project => 
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.techStack.some(tech => tech.toLowerCase().includes(term))
        );
      }
      
      if (selectedCategory) {
        filtered = filtered.filter(project => project.category === selectedCategory);
      }
      
      return filtered;
    };
  }, [searchTerm, selectedCategory]);

  const searchSkills = useMemo(() => {
    return (skills: SkillCategory[]) => {
      if (!searchTerm) return skills;
      
      const term = searchTerm.toLowerCase();
      return skills.map(category => ({
        ...category,
        skills: category.skills.filter(skill => 
          skill.name.toLowerCase().includes(term)
        )
      })).filter(category => category.skills.length > 0);
    };
  }, [searchTerm]);

  const searchResearch = useMemo(() => {
    return (research: ResearchEntry[]) => {
      if (!searchTerm) return research;
      
      const term = searchTerm.toLowerCase();
      return research.filter(entry => 
        entry.title.toLowerCase().includes(term) ||
        entry.abstract.toLowerCase().includes(term) ||
        entry.authors.some(author => author.toLowerCase().includes(term))
      );
    };
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    searchProjects,
    searchSkills,
    searchResearch
  };
};

/**
 * Custom hook for data transformations
 */
export const useDataTransforms = () => {
  const formatProjectForDisplay = (project: Project) => 
    DataTransformer.formatProjectForDisplay(project);

  const formatResearchForDisplay = (entry: ResearchEntry) => 
    DataTransformer.formatResearchForDisplay(entry);

  const getCategoryLabel = (category: Project['category']) => 
    DataTransformer.getCategoryLabel(category);

  const getStatusLabel = (status: ResearchEntry['status']) => 
    DataTransformer.getStatusLabel(status);

  const getSkillLevelColor = (level?: string) => 
    DataTransformer.getSkillLevelColor(level);

  return {
    formatProjectForDisplay,
    formatResearchForDisplay,
    getCategoryLabel,
    getStatusLabel,
    getSkillLevelColor
  };
};

/**
 * Main data hook that combines all data sources
 */
export const useData = () => {
  const { data: portfolioData, loading: portfolioLoading, error: portfolioError } = usePortfolioData();
  const { data: aboutData, loading: aboutLoading, error: aboutError } = useAboutData();
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useProjectsData();
  const { data: skillsData, loading: skillsLoading, error: skillsError } = useSkillsData();
  const { data: researchData, loading: researchLoading, error: researchError } = useResearchData();
  const { data: experienceData, loading: experienceLoading, error: experienceError } = useExperienceData();

  const loading = portfolioLoading || aboutLoading || projectsLoading || skillsLoading || researchLoading || experienceLoading;
  const error = portfolioError || aboutError || projectsError || skillsError || researchError || experienceError;

  return {
    portfolioData,
    aboutData,
    projectsData,
    skillsData,
    researchData,
    experienceData,
    loading,
    error
  };
};