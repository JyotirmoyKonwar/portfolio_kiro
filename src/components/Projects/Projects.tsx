import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../UI/Button';
import { Container } from '../UI/Container';
import { SkeletonGrid, AnimatedSection, AnimatedGrid } from '../UI';
import { ProjectCard } from './ProjectCard';
import { TechBadge } from './TechBadge';
import { useProjectsData } from '../../hooks/useData';

import type { SectionProps } from '../../types';

interface ProjectsProps extends SectionProps {
  showAll?: boolean;
  maxProjects?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const Projects: React.FC<ProjectsProps> = ({
  className = '',
  id = 'projects',
  showAll = false,
  maxProjects = 6,
  ...props
}) => {
  const { data: projects, loading, error } = useProjectsData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllProjects, setShowAllProjects] = useState(showAll);

  if (loading) {
    return (
      <section id={id} className={`py-20 bg-slate-900/50 ${className}`} {...props}>
        <Container>
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <div className="h-8 bg-slate-700 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-slate-700 rounded w-96 mx-auto mb-8 animate-pulse"></div>
          </AnimatedSection>
          <SkeletonGrid items={maxProjects} columns={3} />
        </Container>
      </section>
    );
  }

  if (error || !projects) {
    return (
      <section id={id} className={`py-20 ${className}`} {...props}>
        <Container>
          <div className="text-center text-slate-400">
            <p>Unable to load projects. Please try again later.</p>
          </div>
        </Container>
      </section>
    );
  }

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter projects by category
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  // Limit projects if not showing all
  const displayedProjects = showAllProjects 
    ? filteredProjects 
    : filteredProjects.slice(0, maxProjects);

  // Get featured projects for highlighting
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <section id={id} className={`py-20 bg-slate-900/50 ${className}`} {...props}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <AnimatedSection animation="fadeInUp" className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-50 mb-3 sm:mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Explore my AI and Data Science projects, from machine learning applications 
              to research implementations. Each project showcases different aspects of 
              modern AI development.
            </p>
          </AnimatedSection>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4 sm:px-0">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize touch-manipulation text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                {category === 'all' ? 'All Projects' : category}
              </Button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <AnimatedGrid 
            columns={3}
            gap="gap-4 sm:gap-6 lg:gap-8"
            staggerDelay={0.1}
            className="mb-8 sm:mb-12"
          >
            {displayedProjects.map((project) => (
              <ProjectCard 
                key={project.id}
                project={project} 
                featured={project.featured}
                className={project.featured ? 'ring-2 ring-cyan-500/30' : ''}
              />
            ))}
          </AnimatedGrid>

          {/* Show More/Less Button */}
          {filteredProjects.length > maxProjects && (
            <motion.div variants={itemVariants} className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="group"
              >
                {showAllProjects ? 'Show Less' : `Show All ${filteredProjects.length} Projects`}
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ rotate: showAllProjects ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ↓
                </motion.span>
              </Button>
            </motion.div>
          )}

          {/* Featured Projects Highlight */}
          {featuredProjects.length > 0 && selectedCategory === 'all' && (
            <motion.div variants={itemVariants} className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-slate-50 mb-2">
                  Featured Work
                </h3>
                <p className="text-slate-400">
                  Highlighted projects that showcase key skills and achievements
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-cyan-500/30">
                    <span className="text-sm text-slate-300">{project.title}</span>
                    <div className="flex gap-1">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <TechBadge key={tech} tech={tech} size="xs" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
};