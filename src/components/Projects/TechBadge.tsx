import React from 'react';
import { motion } from 'framer-motion';

interface TechBadgeProps {
  tech: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'default' | 'outlined' | 'filled';
  className?: string;
}

// Tech stack color mapping for consistent styling
const techColors: Record<string, { bg: string; text: string; border: string }> = {
  // Programming Languages
  'Python': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'JavaScript': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'TypeScript': { bg: 'bg-blue-600/10', text: 'text-blue-300', border: 'border-blue-600/30' },
  'R': { bg: 'bg-blue-700/10', text: 'text-blue-300', border: 'border-blue-700/30' },
  'Java': { bg: 'bg-orange-600/10', text: 'text-orange-400', border: 'border-orange-600/30' },
  'C++': { bg: 'bg-purple-600/10', text: 'text-purple-400', border: 'border-purple-600/30' },
  
  // ML/AI Frameworks
  'TensorFlow': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'PyTorch': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  'scikit-learn': { bg: 'bg-orange-400/10', text: 'text-orange-300', border: 'border-orange-400/30' },
  'Keras': { bg: 'bg-red-600/10', text: 'text-red-400', border: 'border-red-600/30' },
  'Transformers': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  'OpenCV': { bg: 'bg-green-600/10', text: 'text-green-400', border: 'border-green-600/30' },
  
  // Data Science
  'Pandas': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'NumPy': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Matplotlib': { bg: 'bg-blue-600/10', text: 'text-blue-300', border: 'border-blue-600/30' },
  'Seaborn': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  'Plotly': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'D3.js': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  
  // Web Technologies
  'React': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'Vue': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  'Angular': { bg: 'bg-red-600/10', text: 'text-red-400', border: 'border-red-600/30' },
  'Node.js': { bg: 'bg-green-600/10', text: 'text-green-400', border: 'border-green-600/30' },
  'Express': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' },
  'Flask': { bg: 'bg-gray-600/10', text: 'text-gray-300', border: 'border-gray-600/30' },
  'Django': { bg: 'bg-green-700/10', text: 'text-green-400', border: 'border-green-700/30' },
  'FastAPI': { bg: 'bg-teal-600/10', text: 'text-teal-400', border: 'border-teal-600/30' },
  
  // Databases
  'PostgreSQL': { bg: 'bg-blue-600/10', text: 'text-blue-400', border: 'border-blue-600/30' },
  'MongoDB': { bg: 'bg-green-600/10', text: 'text-green-400', border: 'border-green-600/30' },
  'MySQL': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Redis': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  
  // Tools & Platforms
  'Docker': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Kubernetes': { bg: 'bg-blue-600/10', text: 'text-blue-300', border: 'border-blue-600/30' },
  'AWS': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'GCP': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Azure': { bg: 'bg-blue-600/10', text: 'text-blue-300', border: 'border-blue-600/30' },
  'Git': { bg: 'bg-orange-600/10', text: 'text-orange-400', border: 'border-orange-600/30' },
  'Jupyter': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Colab': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  
  // NLP & Text Processing
  'NLTK': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  'spaCy': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Hugging Face': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  
  // Default fallback
  'default': { bg: 'bg-slate-600/10', text: 'text-slate-400', border: 'border-slate-600/30' }
};

const sizeClasses = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm'
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.1 }
  }
};

export const TechBadge: React.FC<TechBadgeProps> = ({
  tech,
  size = 'sm',
  variant = 'default',
  className = ''
}) => {
  // Get colors for the tech, fallback to default
  const colors = techColors[tech] || techColors.default;
  
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200 cursor-default';
  const sizeClass = sizeClasses[size];
  
  let variantClasses = '';
  switch (variant) {
    case 'outlined':
      variantClasses = `border ${colors.border} ${colors.text} bg-transparent hover:${colors.bg}`;
      break;
    case 'filled':
      variantClasses = `${colors.bg} ${colors.text} border border-transparent`;
      break;
    default:
      variantClasses = `${colors.bg} ${colors.text} border ${colors.border}`;
  }
  
  const combinedClasses = `${baseClasses} ${sizeClass} ${variantClasses} ${className}`;

  return (
    <motion.span
      className={combinedClasses}
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      title={`Technology: ${tech}`}
    >
      {tech}
    </motion.span>
  );
};

// Utility component for rendering multiple tech badges
interface TechBadgeListProps {
  techStack: string[];
  size?: 'xs' | 'sm' | 'md';
  variant?: 'default' | 'outlined' | 'filled';
  maxItems?: number;
  className?: string;
}

export const TechBadgeList: React.FC<TechBadgeListProps> = ({
  techStack,
  size = 'sm',
  variant = 'default',
  maxItems,
  className = ''
}) => {
  const displayedTech = maxItems ? techStack.slice(0, maxItems) : techStack;
  const remainingCount = maxItems && techStack.length > maxItems ? techStack.length - maxItems : 0;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayedTech.map((tech, index) => (
        <motion.div
          key={tech}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
        >
          <TechBadge tech={tech} size={size} variant={variant} />
        </motion.div>
      ))}
      {remainingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: displayedTech.length * 0.05, duration: 0.2 }}
        >
          <span className={`${sizeClasses[size]} inline-flex items-center font-medium rounded-full bg-slate-600/20 text-slate-400 border border-slate-600/30`}>
            +{remainingCount}
          </span>
        </motion.div>
      )}
    </div>
  );
};