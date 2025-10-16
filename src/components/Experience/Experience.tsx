import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { Container, Card, AnimatedSection } from '../UI';
import { useExperienceData } from '../../hooks/useData';
import type { ComponentProps } from '../../types';

interface ExperienceProps extends ComponentProps {
  id?: string;
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

export const Experience: React.FC<ExperienceProps> = ({
  className = '',
  id = 'experience',
  ...props
}) => {
  const { data: experiences, loading, error } = useExperienceData();

  if (loading) {
    return (
      <section id={id} className={`py-20 bg-slate-900/50 ${className}`} {...props}>
        <Container>
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <div className="h-8 bg-slate-700 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-slate-700 rounded w-96 mx-auto mb-8 animate-pulse"></div>
          </AnimatedSection>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                  <div className="flex-grow space-y-3">
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-16 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (error || !experiences) {
    return (
      <section id={id} className={`py-20 ${className}`} {...props}>
        <Container>
          <div className="text-center text-slate-400">
            <p>Unable to load experience data. Please try again later.</p>
          </div>
        </Container>
      </section>
    );
  }



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
              Professional <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              My journey through various roles and projects, showcasing growth in 
              AI, machine learning, and software development.
            </p>
          </AnimatedSection>



          {/* Experience Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="glass" padding="lg" hover>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Experience Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                          <Briefcase className="text-cyan-500" size={20} />
                        </div>
                      </div>

                      {/* Experience Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-50 mb-1">
                              {exp.title}
                            </h3>
                            <p className="text-cyan-500 font-medium mb-1">
                              {exp.company}
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end text-sm text-slate-400">
                            <div className="flex items-center gap-1 mb-1">
                              <Calendar size={14} />
                              <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                          {exp.description}
                        </p>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Experience Type Badge */}
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            exp.type === 'internship' ? 'bg-green-500/10 text-green-400' :
                            exp.type === 'full-time' ? 'bg-blue-500/10 text-blue-400' :
                            exp.type === 'project' ? 'bg-purple-500/10 text-purple-400' :
                            exp.type === 'freelance' ? 'bg-orange-500/10 text-orange-400' :
                            exp.type === 'part-time' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>
                            {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>


        </motion.div>
      </Container>
    </section>
  );
};