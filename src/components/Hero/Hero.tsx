import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowDown } from 'lucide-react';
import { Button, Container, Section } from '../UI';
import { ResumeDownload } from '../Resume';
import { trackContactInteraction } from '../../services/analytics';
import { getPortfolioData } from '../../utils/dataLoader';
import type { ComponentProps } from '../../types';

interface HeroProps extends ComponentProps {
  onContactClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  className = '', 
  onContactClick,
  ...props 
}) => {
  const portfolioData = getPortfolioData();
  const { personal, social } = portfolioData;

  const handleContactClick = () => {
    // Track contact interaction
    trackContactInteraction();
    
    if (onContactClick) {
      onContactClick();
    } else {
      // Scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Section 
      id="hero" 
      padding="none" 
      className={`min-h-screen flex items-center justify-center relative ${className}`}
      role="banner"
      aria-label="Hero section with introduction"
      {...props}
    >
      <Container size="lg">
        <div className="text-center">
          {/* Main Title */}
          <motion.h1 
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            aria-label={`${personal.name}, portfolio homepage`}
          >
            <span className="gradient-text">{personal.name}</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-400 mb-6 sm:mb-8 font-medium px-2 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {personal.title}
          </motion.p>
          
          {/* Tagline */}
          <motion.p 
            className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-12 max-w-xs xs:max-w-sm sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {personal.tagline}
          </motion.p>
          
          {/* Call-to-Action Buttons */}
          <motion.div 
            className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <ResumeDownload 
              variant="button"
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-700 text-white w-full xs:w-auto min-w-[160px]"
            />
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleContactClick}
              className="group w-full xs:w-auto min-w-[160px]"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base">Get In Touch</span>
            </Button>
          </motion.div>
          
          {/* Social Links */}
          <motion.nav 
            className="flex gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            role="navigation"
            aria-label="Social media links"
          >
            {social.github && (
              <motion.a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-500 transition-colors p-2 touch-manipulation"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                aria-label="GitHub Profile"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
            )}
            
            {social.linkedin && (
              <motion.a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-500 transition-colors p-2 touch-manipulation"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                aria-label="LinkedIn Profile"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
            )}
            
            {social.scholar && (
              <motion.a
                href={social.scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-500 transition-colors p-2 touch-manipulation"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                aria-label="Google Scholar Profile"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                </svg>
              </motion.a>
            )}
            
            {social.twitter && (
              <motion.a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-500 transition-colors p-2 touch-manipulation"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                aria-label="Twitter Profile"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </motion.a>
            )}
          </motion.nav>
        </div>
      </Container>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        role="img"
        aria-label="Scroll down to explore more content"
      >
        <div className="flex flex-col items-center text-slate-400">
          <span className="text-xs sm:text-sm mb-2 font-medium" aria-hidden="true">Scroll to explore</span>
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </div>
      </motion.div>
    </Section>
  );
};