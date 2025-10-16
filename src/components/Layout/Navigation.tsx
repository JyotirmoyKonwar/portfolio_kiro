import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { siteConfig } from '../../config/site';
import { Button } from '../UI/Button';

export const Navigation: React.FC = () => {
  const { activeSection, scrollToSection } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navigation background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      x: '100%',
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50 shadow-lg' 
          : 'bg-transparent'
      }`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Brand */}
          <motion.button
            className="flex-shrink-0 text-lg sm:text-xl font-bold gradient-text focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md px-2 py-1"
            onClick={() => handleNavClick('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go to top of page"
          >
            Portfolio
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="ml-10 flex items-baseline space-x-4" role="menubar">
              {siteConfig.navigation.map((item) => (
                <li key={item.id} role="none">
                  <motion.button
                    onClick={() => handleNavClick(item.id)}
                    className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      activeSection === item.id
                        ? 'text-cyan-500 bg-slate-800/50'
                        : 'text-slate-300 hover:text-cyan-500 hover:bg-slate-800/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    role="menuitem"
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    aria-label={`Navigate to ${item.label} section`}
                  >
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resume Button (Desktop) */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              href="/documents/resume.pdf"
              target="_blank"
            >
              Resume
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 p-2 touch-manipulation rounded-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden fixed inset-0 top-14 sm:top-16 bg-slate-900/95 backdrop-blur-sm z-40"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="px-4 pt-4 pb-6 space-y-2 h-full overflow-y-auto">
              {siteConfig.navigation.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-md text-lg font-medium transition-colors duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    activeSection === item.id
                      ? 'text-cyan-500 bg-slate-800/50'
                      : 'text-slate-300 hover:text-cyan-500 hover:bg-slate-800/30'
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  whileHover={{ x: 10 }}
                  role="menuitem"
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label} section`}
                >
                  {item.label}
                </motion.button>
              ))}
              
              {/* Mobile Resume Button */}
              <motion.div
                className="pt-6 border-t border-slate-700/50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: siteConfig.navigation.length * 0.1 }
                }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  href="/documents/resume.pdf"
                  target="_blank"
                  className="w-full touch-manipulation"
                  aria-label="Download resume PDF"
                >
                  Download Resume
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};