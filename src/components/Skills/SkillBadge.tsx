import React from 'react';
import { motion } from 'framer-motion';
import type { Skill } from '../../types';

interface SkillBadgeProps {
  skill: Skill;
  size?: 'sm' | 'md' | 'lg';
  showLevel?: boolean;
  className?: string;
}

// Skill level configurations
const levelConfig = {
  'Beginner': {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    dots: 1,
    label: 'Beginner'
  },
  'Intermediate': {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dots: 2,
    label: 'Intermediate'
  },
  'Advanced': {
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    dots: 3,
    label: 'Advanced'
  },
  'Expert': {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    dots: 4,
    label: 'Expert'
  }
};

// Skill-specific color mapping (similar to TechBadge but optimized for skills)
const skillColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  // Programming Languages
  'Python': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', accent: 'bg-blue-500' },
  'JavaScript': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', accent: 'bg-yellow-500' },
  'TypeScript': { bg: 'bg-blue-600/10', text: 'text-blue-300', border: 'border-blue-600/30', accent: 'bg-blue-600' },
  'R': { bg: 'bg-blue-700/10', text: 'text-blue-300', border: 'border-blue-700/30', accent: 'bg-blue-700' },
  'Java': { bg: 'bg-orange-600/10', text: 'text-orange-400', border: 'border-orange-600/30', accent: 'bg-orange-600' },
  'SQL': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', accent: 'bg-indigo-500' },
  
  // AI/ML Frameworks
  'TensorFlow': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', accent: 'bg-orange-500' },
  'PyTorch': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', accent: 'bg-red-500' },
  'scikit-learn': { bg: 'bg-orange-400/10', text: 'text-orange-300', border: 'border-orange-400/30', accent: 'bg-orange-400' },
  'Keras': { bg: 'bg-red-600/10', text: 'text-red-400', border: 'border-red-600/30', accent: 'bg-red-600' },
  'OpenCV': { bg: 'bg-green-600/10', text: 'text-green-400', border: 'border-green-600/30', accent: 'bg-green-600' },
  'Hugging Face': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', accent: 'bg-yellow-500' },
  
  // Data Science Tools
  'Pandas': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', accent: 'bg-indigo-500' },
  'NumPy': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', accent: 'bg-blue-500' },
  'Matplotlib': { bg: 'bg-blue-600/10', text: 'text-blue-300', border: 'border-blue-600/30', accent: 'bg-blue-600' },
  'Seaborn': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', accent: 'bg-teal-500' },
  'Jupyter': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', accent: 'bg-orange-500' },
  'Apache Spark': { bg: 'bg-red-600/10', text: 'text-red-400', border: 'border-red-600/30', accent: 'bg-red-600' },
  
  // Web Technologies
  'React': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', accent: 'bg-cyan-500' },
  'Node.js': { bg: 'bg-green-600/10', text: 'text-green-400', border: 'border-green-600/30', accent: 'bg-green-600' },
  'Flask': { bg: 'bg-gray-600/10', text: 'text-gray-300', border: 'border-gray-600/30', accent: 'bg-gray-600' },
  'FastAPI': { bg: 'bg-teal-600/10', text: 'text-teal-400', border: 'border-teal-600/30', accent: 'bg-teal-600' },
  'HTML/CSS': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', accent: 'bg-orange-500' },
  'Tailwind CSS': { bg: 'bg-cyan-400/10', text: 'text-cyan-300', border: 'border-cyan-400/30', accent: 'bg-cyan-400' },
  
  // Tools & Platforms
  'Git': { bg: 'bg-orange-600/10', text: 'text-orange-400', border: 'border-orange-600/30', accent: 'bg-orange-600' },
  'Docker': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', accent: 'bg-blue-500' },
  'AWS': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', accent: 'bg-orange-500' },
  'Google Cloud': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', accent: 'bg-blue-500' },
  'PostgreSQL': { bg: 'bg-blue-600/10', text: 'text-blue-400', border: 'border-blue-600/30', accent: 'bg-blue-600' },
  'MongoDB': { bg: 'bg-green-600/10', text: 'text-green-400', border: 'border-green-600/30', accent: 'bg-green-600' },
  
  // Default fallback
  'default': { bg: 'bg-slate-600/10', text: 'text-slate-400', border: 'border-slate-600/30', accent: 'bg-slate-600' }
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base'
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const ProficiencyIndicator: React.FC<{ level: string; size: 'sm' | 'md' | 'lg' }> = ({ level, size }) => {
  const config = levelConfig[level as keyof typeof levelConfig];
  if (!config) return null;

  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  
  return (
    <div className="flex items-center gap-1 mt-1">
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={index}
          className={`${dotSize} rounded-full ${
            index < config.dots ? config.color.replace('text-', 'bg-') : 'bg-slate-600'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.2 }}
        />
      ))}
      <span className={`text-xs ${config.color} ml-1 font-medium`}>
        {config.label}
      </span>
    </div>
  );
};

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  size = 'md',
  showLevel = true,
  className = ''
}) => {
  const colors = skillColors[skill.name] || skillColors.default;
  const sizeClass = sizeClasses[size];
  
  const baseClasses = 'relative group cursor-pointer rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10';
  const colorClasses = `${colors.bg} ${colors.text} ${colors.border} hover:${colors.border.replace('/30', '/50')}`;
  const combinedClasses = `${baseClasses} ${sizeClass} ${colorClasses} ${className}`;

  return (
    <motion.div
      className={combinedClasses}
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      title={`${skill.name}${skill.level ? ` - ${skill.level}` : ''}`}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.accent} rounded-l-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="font-medium">{skill.name}</span>
          {skill.icon && (
            <span className="text-lg ml-2">{skill.icon}</span>
          )}
        </div>
        
        {showLevel && skill.level && (
          <ProficiencyIndicator level={skill.level} size={size} />
        )}
      </div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.div>
  );
};

// Utility component for rendering skill badges in a grid
interface SkillBadgeGridProps {
  skills: Skill[];
  size?: 'sm' | 'md' | 'lg';
  showLevel?: boolean;
  columns?: number;
  className?: string;
}

export const SkillBadgeGrid: React.FC<SkillBadgeGridProps> = ({
  skills,
  size = 'md',
  showLevel = true,
  columns = 3,
  className = ''
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-3 ${className}`}>
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <SkillBadge skill={skill} size={size} showLevel={showLevel} />
        </motion.div>
      ))}
    </div>
  );
};