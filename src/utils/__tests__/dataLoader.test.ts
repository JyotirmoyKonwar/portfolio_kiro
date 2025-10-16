/**
 * Tests for data loading utilities
 * Note: These are basic validation tests to ensure data structure integrity
 */

import { describe, it, expect } from 'vitest'
import { DataLoader, DataValidator } from '../dataLoader'

describe('DataValidator', () => {
  describe('validatePortfolioData', () => {
    it('should validate correct portfolio data', () => {
      const validData = {
        personal: {
          name: 'Test Name',
          title: 'Test Title',
          email: 'test@example.com',
          tagline: 'Test tagline',
          location: 'Test location',
          bio: 'Test bio',
          resumeUrl: '/test-resume.pdf'
        },
        social: {
          linkedin: 'https://linkedin.com/test',
          github: 'https://github.com/test',
          scholar: 'https://scholar.google.com/test',
          twitter: 'https://twitter.com/test'
        }
      };

      expect(DataValidator.validatePortfolioData(validData)).toBe(true);
    });

    it('should reject invalid portfolio data', () => {
      const invalidData = {
        personal: {
          name: 'Test Name'
          // Missing required fields
        }
      };

      expect(DataValidator.validatePortfolioData(invalidData)).toBe(false);
    });
  });

  describe('validateProject', () => {
    it('should validate correct project data', () => {
      const validProject = {
        id: 'test-1',
        title: 'Test Project',
        description: 'Test description',
        techStack: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/test/project',
        imageUrl: '/test-image.jpg',
        featured: true,
        category: 'AI'
      };

      expect(DataValidator.validateProject(validProject)).toBe(true);
    });

    it('should reject invalid project data', () => {
      const invalidProject = {
        id: 'test-1',
        title: 'Test Project'
        // Missing required fields
      };

      expect(DataValidator.validateProject(invalidProject)).toBe(false);
    });
  });

  describe('validateSkillCategory', () => {
    it('should validate correct skill category data', () => {
      const validCategory = {
        category: 'Programming Languages',
        skills: [
          { name: 'JavaScript', level: 'Advanced' },
          { name: 'Python', level: 'Expert' }
        ]
      };

      expect(DataValidator.validateSkillCategory(validCategory)).toBe(true);
    });

    it('should reject invalid skill category data', () => {
      const invalidCategory = {
        category: 'Programming Languages',
        skills: 'not an array'
      };

      expect(DataValidator.validateSkillCategory(invalidCategory)).toBe(false);
    });
  });

  describe('validateResearchEntry', () => {
    it('should validate correct research entry data', () => {
      const validEntry = {
        id: 'research-1',
        title: 'Test Research',
        authors: ['Author 1', 'Author 2'],
        venue: 'Test Conference',
        year: 2024,
        abstract: 'Test abstract',
        status: 'published'
      };

      expect(DataValidator.validateResearchEntry(validEntry)).toBe(true);
    });

    it('should reject invalid research entry data', () => {
      const invalidEntry = {
        id: 'research-1',
        title: 'Test Research',
        authors: 'not an array'
      };

      expect(DataValidator.validateResearchEntry(invalidEntry)).toBe(false);
    });
  });
});

describe('DataLoader', () => {
  describe('getPortfolioData', () => {
    it('should load portfolio data without errors', () => {
      expect(() => DataLoader.getPortfolioData()).not.toThrow();
    });

    it('should return valid portfolio data structure', () => {
      const data = DataLoader.getPortfolioData();
      expect(data).toHaveProperty('personal');
      expect(data).toHaveProperty('social');
      expect(data.personal).toHaveProperty('name');
      expect(data.personal).toHaveProperty('email');
    });
  });

  describe('getProjects', () => {
    it('should load projects data without errors', () => {
      expect(() => DataLoader.getProjects()).not.toThrow();
    });

    it('should return array of projects', () => {
      const projects = DataLoader.getProjects();
      expect(Array.isArray(projects)).toBe(true);
      if (projects.length > 0) {
        expect(projects[0]).toHaveProperty('id');
        expect(projects[0]).toHaveProperty('title');
        expect(projects[0]).toHaveProperty('techStack');
      }
    });
  });

  describe('getSkills', () => {
    it('should load skills data without errors', () => {
      expect(() => DataLoader.getSkills()).not.toThrow();
    });

    it('should return array of skill categories', () => {
      const skills = DataLoader.getSkills();
      expect(Array.isArray(skills)).toBe(true);
      if (skills.length > 0) {
        expect(skills[0]).toHaveProperty('category');
        expect(skills[0]).toHaveProperty('skills');
        expect(Array.isArray(skills[0].skills)).toBe(true);
      }
    });
  });

  describe('getResearch', () => {
    it('should load research data without errors', () => {
      expect(() => DataLoader.getResearch()).not.toThrow();
    });

    it('should return array of research entries', () => {
      const research = DataLoader.getResearch();
      expect(Array.isArray(research)).toBe(true);
      if (research.length > 0) {
        expect(research[0]).toHaveProperty('id');
        expect(research[0]).toHaveProperty('title');
        expect(research[0]).toHaveProperty('authors');
      }
    });
  });

  describe('utility methods', () => {
    it('should get featured projects', () => {
      const featured = DataLoader.getFeaturedProjects();
      expect(Array.isArray(featured)).toBe(true);
      featured.forEach(project => {
        expect(project.featured).toBe(true);
      });
    });

    it('should get projects by category', () => {
      const aiProjects = DataLoader.getProjectsByCategory('AI');
      expect(Array.isArray(aiProjects)).toBe(true);
      aiProjects.forEach(project => {
        expect(project.category).toBe('AI');
      });
    });

    it('should get all technologies', () => {
      const technologies = DataLoader.getAllTechnologies();
      expect(Array.isArray(technologies)).toBe(true);
      // Should be unique and sorted
      const uniqueTech = [...new Set(technologies)];
      expect(technologies).toEqual(uniqueTech.sort());
    });

    it('should get project statistics', () => {
      const stats = DataLoader.getProjectStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('featured');
      expect(stats).toHaveProperty('categories');
      expect(stats).toHaveProperty('technologies');
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.featured).toBe('number');
    });
  });
});