import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { Button } from '../UI';
import { trackResumeDownload } from '../../services/analytics';
import { getPortfolioData } from '../../utils/dataLoader';
import type { ComponentProps } from '../../types';

interface ResumeDownloadProps extends ComponentProps {
  variant?: 'button' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  trackAnalytics?: boolean;
}

export const ResumeDownload: React.FC<ResumeDownloadProps> = ({
  variant = 'button',
  size = 'md',
  showIcon = true,
  trackAnalytics = true,
  className = '',
  ...props
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const portfolioData = getPortfolioData();
  const resumeUrl = portfolioData.personal.resumeUrl;

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // Track analytics if enabled
      if (trackAnalytics) {
        trackResumeDownload();
      }
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = `${portfolioData.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Small delay to show loading state
      setTimeout(() => setIsDownloading(false), 500);
    } catch (error) {
      console.error('Failed to download resume:', error);
      setIsDownloading(false);
      
      // Fallback: open in new tab
      window.open(resumeUrl, '_blank');
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  if (variant === 'card') {
    return (
      <motion.div
        className={`bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-cyan-500/50 transition-colors ${className}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-lg">
            <FileText className="w-8 h-8 text-cyan-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-50 mb-1">Resume / CV</h3>
            <p className="text-slate-400 text-sm mb-3">
              Download my complete resume with detailed experience and skills
            </p>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="group"
              size="sm"
            >
              {isDownloading ? (
                <>
                  <motion.div
                    className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition-colors ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {showIcon && (
          isDownloading ? (
            <motion.div
              className={`border-2 border-cyan-500/30 border-t-cyan-500 rounded-full ${getIconSize()}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Download className={getIconSize()} />
          )
        )}
        <span className="font-medium">
          {isDownloading ? 'Downloading...' : 'Download Resume'}
        </span>
        {!isDownloading && <ExternalLink className="w-3 h-3" />}
      </motion.button>
    );
  }

  // Default button variant
  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`group ${getButtonSize()} ${className}`}
      {...props}
    >
      {isDownloading ? (
        <>
          <motion.div
            className={`border-2 border-white/30 border-t-white rounded-full mr-2 ${getIconSize()}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Downloading...
        </>
      ) : (
        <>
          {showIcon && <Download className={`mr-2 group-hover:animate-bounce ${getIconSize()}`} />}
          Download Resume
        </>
      )}
    </Button>
  );
};