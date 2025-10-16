import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '../UI/Card';
import { Button } from '../UI/Button';
import { LazyImage, generateImageSources } from '../UI/LazyImage';
import { TechBadge } from './TechBadge';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  hover: {
    y: -8,
    transition: { duration: 0.2 }
  }
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  featured = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate optimized image sources
  const imageSources = generateImageSources(project.imageUrl, {
    sizes: [400, 600, 800]
  });

  const handleGitHubClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLiveClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`group ${className}`}
    >
      <Card 
        variant={featured ? 'elevated' : 'default'}
        padding="none"
        className={`h-full overflow-hidden ${featured ? 'ring-1 ring-cyan-500/20' : ''}`}
      >
        {/* Project Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-slate-700">
          <motion.div variants={imageVariants} className="w-full h-full">
            <LazyImage
              src={imageSources.original}
              webpSrc={imageSources.webp}
              avifSrc={imageSources.avif}
              alt={`${project.title} preview`}
              className="w-full h-full"
              aspectRatio="16/9"
              sizes={imageSources.sizes}
              fallbackSrc="/images/project-placeholder.jpg"
            />
          </motion.div>

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            variants={overlayVariants}
          >
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGitHubClick}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation"
              >
                <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                Code
              </Button>
              {project.liveUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLiveClick}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  Live
                </Button>
              )}
            </div>
          </motion.div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 right-3">
              <div className="px-2 py-1 bg-cyan-500 text-slate-900 text-xs font-semibold rounded-full">
                Featured
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <div className="px-2 py-1 bg-slate-800/80 backdrop-blur-sm text-slate-200 text-xs font-medium rounded-full border border-slate-600/50">
              {project.category}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-6">
          <CardHeader className="mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-50 mb-2 group-hover:text-cyan-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {project.description}
            </p>
          </CardHeader>

          <CardContent>
            {/* Tech Stack */}
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.techStack.map((tech) => (
                  <TechBadge key={tech} tech={tech} size="sm" />
                ))}
              </div>
            </div>

            {/* Expandable Long Description */}
            {project.longDescription && (
              <div className="mb-4">
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 pt-3 border-t border-slate-700/50">
                        {project.longDescription}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={toggleExpanded}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm font-medium transition-colors touch-manipulation"
                >
                  {isExpanded ? (
                    <>
                      <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      Read More
                    </>
                  )}
                </button>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-3 sm:pt-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGitHubClick}
                  className="flex items-center gap-1 sm:gap-2 text-slate-400 hover:text-slate-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation"
                >
                  <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                  GitHub
                </Button>
                {project.liveUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLiveClick}
                    className="flex items-center gap-1 sm:gap-2 text-slate-400 hover:text-slate-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Live Demo</span>
                    <span className="xs:hidden">Live</span>
                  </Button>
                )}
              </div>
              
              {featured && (
                <div className="text-xs text-cyan-400 font-medium">
                  ⭐ Featured
                </div>
              )}
            </div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};