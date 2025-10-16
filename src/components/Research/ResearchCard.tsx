import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FileText, Eye, EyeOff, Calendar, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '../UI/Card';
import { Button } from '../UI/Button';
import type { ResearchEntry } from '../../types';

interface ResearchCardProps {
  research: ResearchEntry;
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
    y: -4,
    transition: { duration: 0.2 }
  }
};

const abstractVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.3 }
  }
};

export const ResearchCard: React.FC<ResearchCardProps> = ({
  research,
  featured = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePdfClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (research.pdfUrl) {
      window.open(research.pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleArxivClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (research.arxivUrl) {
      window.open(research.arxivUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusColor = (status: ResearchEntry['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'submitted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusLabel = (status: ResearchEntry['status']) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'submitted':
        return 'Under Review';
      case 'in-progress':
        return 'In Progress';
      default:
        return status;
    }
  };

  const formatCitation = () => {
    const authorsStr = research.authors.join(', ');
    const year = research.year;
    const title = research.title;
    const venue = research.venue;
    
    return `${authorsStr} (${year}). "${title}". ${venue}.`;
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
        className={`overflow-hidden ${featured ? 'ring-1 ring-cyan-500/20' : ''}`}
      >
        <div className="p-6">
          <CardHeader className="mb-4">
            {/* Status and Year */}
            <div className="flex items-center justify-between mb-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(research.status)}`}>
                {getStatusLabel(research.status)}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="w-4 h-4" />
                {research.year}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-slate-50 mb-3 group-hover:text-cyan-400 transition-colors leading-tight">
              {research.title}
            </h3>

            {/* Authors and Venue */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-slate-400 text-sm">
                <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{research.authors.join(', ')}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400 text-sm">
                <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="italic">{research.venue}</span>
              </div>
            </div>

            {/* Featured Badge */}
            {featured && (
              <div className="inline-block">
                <div className="px-2 py-1 bg-cyan-500 text-slate-900 text-xs font-semibold rounded-full">
                  Featured Publication
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Abstract Preview */}
            <div className="mb-4">
              <div className="text-slate-300 text-sm leading-relaxed">
                {isExpanded ? (
                  <AnimatePresence>
                    <motion.div
                      variants={abstractVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <p className="mb-4">{research.abstract}</p>
                      
                      {/* Citation Format */}
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Citation
                        </h4>
                        <p className="text-xs text-slate-300 font-mono leading-relaxed">
                          {formatCitation()}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <p>
                    {research.abstract.length > 200 
                      ? `${research.abstract.substring(0, 200)}...` 
                      : research.abstract
                    }
                  </p>
                )}
              </div>
              
              {/* Expand/Collapse Button */}
              <button
                onClick={toggleExpanded}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors mt-3"
              >
                {isExpanded ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Read Full Abstract
                  </>
                )}
              </button>
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <div className="flex justify-between items-center w-full">
              {/* Action Buttons */}
              <div className="flex gap-2">
                {research.pdfUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePdfClick}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-200"
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </Button>
                )}
                {research.arxivUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleArxivClick}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    arXiv
                  </Button>
                )}
                {!research.pdfUrl && !research.arxivUrl && research.status === 'in-progress' && (
                  <div className="text-xs text-slate-500 italic">
                    Links will be available upon publication
                  </div>
                )}
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {featured && (
                  <div className="text-xs text-cyan-400 font-medium">
                    ⭐ Featured
                  </div>
                )}
                {research.status === 'published' && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
                {research.status === 'submitted' && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
                {research.status === 'in-progress' && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};