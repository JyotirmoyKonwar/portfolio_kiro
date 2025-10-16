import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../UI/Container';
import { Button } from '../UI/Button';
import { ResearchCard } from './ResearchCard';
import { useResearchData } from '../../hooks/useData';
import type { SectionProps } from '../../types';

interface ResearchProps extends SectionProps {
  showAll?: boolean;
  maxEntries?: number;
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

export const Research: React.FC<ResearchProps> = ({
  className = '',
  id = 'research',
  showAll = false,
  maxEntries = 6,
  ...props
}) => {
  const { data: research, loading, error } = useResearchData();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAllEntries, setShowAllEntries] = useState(showAll);

  if (loading) {
    return (
      <section id={id} className={`py-20 bg-slate-900/50 ${className}`} {...props}>
        <Container>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-96 mx-auto mb-8"></div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-slate-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (error || !research) {
    return (
      <section id={id} className={`py-20 bg-slate-900/50 ${className}`} {...props}>
        <Container>
          <div className="text-center text-slate-400">
            <p>Unable to load research data. Please try again later.</p>
          </div>
        </Container>
      </section>
    );
  }

  // Get unique statuses
  const statuses = ['all', ...Array.from(new Set(research.map(r => r.status)))];

  // Filter research by status
  const filteredResearch = selectedStatus === 'all' 
    ? research 
    : research.filter(r => r.status === selectedStatus);

  // Sort by year (most recent first)
  const sortedResearch = [...filteredResearch].sort((a, b) => b.year - a.year);

  // Limit entries if not showing all
  const displayedResearch = showAllEntries 
    ? sortedResearch 
    : sortedResearch.slice(0, maxEntries);

  // Get published research for highlighting
  const publishedResearch = research.filter(r => r.status === 'published');

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
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-4">
              Research & <span className="text-gradient">Publications</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Explore my research contributions in AI and Data Science, from published 
              papers to ongoing investigations. Each entry represents a step forward 
              in advancing the field.
            </p>
          </motion.div>

          {/* Status Filter */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="capitalize"
              >
                {status === 'all' ? 'All Research' : getStatusLabel(status)}
              </Button>
            ))}
          </motion.div>

          {/* Research Timeline/Grid */}
          {displayedResearch.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              className="space-y-8 mb-12"
            >
              {displayedResearch.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <ResearchCard 
                    research={entry} 
                    featured={entry.status === 'published'}
                    className={entry.status === 'published' ? 'ring-1 ring-cyan-500/20' : ''}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="text-center py-12">
              <div className="text-slate-400">
                <p className="text-lg mb-2">No research found for the selected filter.</p>
                <p className="text-sm">Try selecting a different status or view all research.</p>
              </div>
            </motion.div>
          )}

          {/* Show More/Less Button */}
          {filteredResearch.length > maxEntries && (
            <motion.div variants={itemVariants} className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllEntries(!showAllEntries)}
                className="group"
              >
                {showAllEntries ? 'Show Less' : `Show All ${filteredResearch.length} Entries`}
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ rotate: showAllEntries ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ↓
                </motion.span>
              </Button>
            </motion.div>
          )}

          {/* Research Statistics */}
          {research.length > 0 && selectedStatus === 'all' && (
            <motion.div variants={itemVariants} className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-slate-50 mb-2">
                  Research Overview
                </h3>
                <p className="text-slate-400">
                  Current research portfolio and publication status
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
                    {research.length}
                  </div>
                  <div className="text-slate-300 font-medium">Total Research</div>
                  <div className="text-sm text-slate-400">Projects & Papers</div>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {publishedResearch.length}
                  </div>
                  <div className="text-slate-300 font-medium">Published</div>
                  <div className="text-sm text-slate-400">Peer-reviewed</div>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {research.filter(r => r.status === 'in-progress').length}
                  </div>
                  <div className="text-slate-300 font-medium">In Progress</div>
                  <div className="text-sm text-slate-400">Active Research</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
};

// Helper function to get status labels
const getStatusLabel = (status: string): string => {
  const labels = {
    'published': 'Published',
    'submitted': 'Under Review',
    'in-progress': 'In Progress'
  };
  return labels[status as keyof typeof labels] || status;
};