import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section } from '../UI';
import { SkillBadge } from './SkillBadge.tsx';
import type { SkillCategory as SkillCategoryType } from '../../types';
import { useData } from '../../hooks/useData';

interface SkillsProps {
  className?: string;
}

const filterOptions = [
  { id: 'all', label: 'All Skills', icon: '🎯' },
  { id: 'programming', label: 'Programming', icon: '💻' },
  { id: 'ai-ml', label: 'AI/ML', icon: '🤖' },
  { id: 'data', label: 'Data Science', icon: '📊' },
  { id: 'web', label: 'Web Tech', icon: '🌐' },
  { id: 'tools', label: 'Tools', icon: '🛠️' }
];

const categoryMapping: Record<string, string> = {
  'Programming Languages': 'programming',
  'AI/ML Frameworks': 'ai-ml',
  'Data Science Tools': 'data',
  'Web Technologies': 'web',
  'Tools & Platforms': 'tools'
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

export const Skills: React.FC<SkillsProps> = ({ className = '' }) => {
  const { skillsData, loading, error } = useData();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredSkills = useMemo(() => {
    if (!skillsData || activeFilter === 'all') return skillsData || [];
    
    return skillsData.filter((category: SkillCategoryType) => {
      const categoryType = categoryMapping[category.category];
      return categoryType === activeFilter;
    });
  }, [skillsData, activeFilter]);

  const totalSkills = useMemo(() => {
    return skillsData?.reduce((total: number, category: SkillCategoryType) => total + category.skills.length, 0) || 0;
  }, [skillsData]);

  if (loading) {
    return (
      <Section id="skills" className={className}>
        <Container>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (error || !skillsData) {
    return (
      <Section id="skills" className={className}>
        <Container>
          <div className="text-center text-red-400">
            Failed to load skills data
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="skills" className={className}>
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 px-4 sm:px-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-2 leading-relaxed">
            A comprehensive overview of my technical expertise across various domains of computer science and AI
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            {totalSkills} skills across {skillsData.length} categories
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12 px-4 sm:px-0"
        >
          {filterOptions.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation ${
                activeFilter === filter.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50 hover:text-slate-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6 sm:space-y-8"
        >
          <AnimatePresence mode="wait">
            {filteredSkills.map((category: SkillCategoryType) => (
              <motion.div
                key={category.category}
                variants={categoryVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700/50"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3 sm:mb-4 flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 sm:mr-3"></span>
                  <span className="flex-1">{category.category}</span>
                  <span className="text-xs sm:text-sm text-slate-500 font-normal">
                    {category.skills.length} skills
                  </span>
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                  {category.skills.map((skill, index: number) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <SkillBadge skill={skill} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {skillsData.map((category: SkillCategoryType) => (
              <div key={category.category} className="bg-slate-800/20 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                  {category.skills.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {category.category.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};