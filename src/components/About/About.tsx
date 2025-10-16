import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, User, GraduationCap, Target, BookOpen } from 'lucide-react';
import { Container, Section, Card, AnimatedSection, AnimatedCard } from '../UI';
import { useData } from '../../hooks/useData';


export const About: React.FC = () => {
  const { aboutData } = useData();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (!aboutData) {
    return (
      <Section id="about" background="secondary">
        <Container>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="about" background="secondary" role="region" aria-labelledby="about-heading">
      <Container>
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp" className="text-center mb-16">
          <h2 id="about-heading" className="text-4xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {aboutData.introduction}
          </p>
        </AnimatedSection>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Left Column - Photo and Quick Info */}
          <AnimatedSection animation="fadeInLeft" delay={200}>
            <AnimatedCard hoverEffect={true}>
              <Card variant="glass" padding="lg">
              {/* Profile Photo Placeholder */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <User size={48} className="text-cyan-500 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
              </div>
              
              {/* Quick Info */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-50 mb-2">
                  {aboutData.name}
                </h3>
                <p className="text-sm sm:text-base text-cyan-500 font-medium mb-3 sm:mb-4">
                  {aboutData.title}
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed px-2 sm:px-0">
                  {aboutData.summary}
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-700/50">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-500 mb-1">
                    {aboutData.stats.yearsOfStudy}+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">Years of Study</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-500 mb-1">
                    {aboutData.stats.projectsCompleted}+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">Projects</div>
                </div>
              </div>
              </Card>
            </AnimatedCard>
          </AnimatedSection>

          {/* Right Column - Detailed Information */}
          <AnimatedSection animation="fadeInRight" delay={400} className="space-y-4 sm:space-y-6">
            {/* Education Section */}
            <AnimatedCard hoverEffect={true}>
              <Card variant="glass" padding="lg">
              <button
                onClick={() => toggleSection('education')}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="text-cyan-500" size={24} />
                  <h3 className="text-xl font-semibold text-slate-50 group-hover:text-cyan-500 transition-colors">
                    Education
                  </h3>
                </div>
                {expandedSections.has('education') ? (
                  <ChevronUp className="text-slate-400" size={20} />
                ) : (
                  <ChevronDown className="text-slate-400" size={20} />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.has('education') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-slate-700/50"
                  >
                    <div className="space-y-4">
                      {aboutData.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-cyan-500/30 pl-4">
                          <h4 className="font-semibold text-slate-50">{edu.degree}</h4>
                          <p className="text-cyan-500 text-sm">{edu.institution}</p>
                          <p className="text-slate-400 text-sm">{edu.year}</p>
                          {edu.details && (
                            <p className="text-slate-300 text-sm mt-2">{edu.details}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </Card>
            </AnimatedCard>

            {/* Goals Section */}
            <AnimatedCard hoverEffect={true}>
              <Card variant="glass" padding="lg">
              <button
                onClick={() => toggleSection('goals')}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-3">
                  <Target className="text-blue-500" size={24} />
                  <h3 className="text-xl font-semibold text-slate-50 group-hover:text-blue-500 transition-colors">
                    Focus & Goals
                  </h3>
                </div>
                {expandedSections.has('goals') ? (
                  <ChevronUp className="text-slate-400" size={20} />
                ) : (
                  <ChevronDown className="text-slate-400" size={20} />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.has('goals') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-slate-700/50"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-50 mb-2">Current Focus</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {aboutData.currentFocus}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-50 mb-2">Career Goals</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {aboutData.careerGoals}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </Card>
            </AnimatedCard>

            {/* Background Section */}
            <AnimatedCard hoverEffect={true}>
              <Card variant="glass" padding="lg">
              <button
                onClick={() => toggleSection('background')}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-indigo-400" size={24} />
                  <h3 className="text-xl font-semibold text-slate-50 group-hover:text-indigo-400 transition-colors">
                    Background
                  </h3>
                </div>
                {expandedSections.has('background') ? (
                  <ChevronUp className="text-slate-400" size={20} />
                ) : (
                  <ChevronDown className="text-slate-400" size={20} />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.has('background') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-slate-700/50"
                  >
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {aboutData.detailedBackground}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              </Card>
            </AnimatedCard>
          </AnimatedSection>
        </div>


      </Container>
    </Section>
  );
};