import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';
import { Container, Section, Button, Card } from '../UI';
import { useData } from '../../hooks/useData';

import { EmailService } from '../../services/emailService';
import type { ComponentProps, ContactFormData } from '../../types';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const Contact: React.FC<ComponentProps> = ({ className = '' }) => {
  const { portfolioData } = useData();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      // Try to send email using EmailJS
      const emailResult = await EmailService.sendEmail(formData);
      
      if (emailResult.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // If EmailJS fails, offer fallback option
        console.warn('EmailJS failed:', emailResult.error);
        
        // Fallback: Open email client
        if (portfolioData?.personal.email) {
          EmailService.openEmailClient(formData, portfolioData.personal.email);
          setStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          throw new Error(emailResult.message);
        }
      }
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  // Social media links configuration
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: portfolioData?.social.linkedin || '#',
      icon: FaLinkedin,
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      url: portfolioData?.social.github || '#',
      icon: FaGithub,
      color: 'hover:text-slate-300'
    },
    {
      name: 'Google Scholar',
      url: portfolioData?.social.scholar || '#',
      icon: SiGooglescholar,
      color: 'hover:text-blue-300'
    },
    {
      name: 'Twitter',
      url: portfolioData?.social.twitter || '#',
      icon: FaTwitter,
      color: 'hover:text-cyan-400'
    }
  ];

  return (
    <Section id="contact" background="secondary" className={className}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 px-4 sm:px-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            I'm always open to discussing new opportunities, research collaborations, 
            or just having a conversation about AI and technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-50">
              Let's Connect
            </h3>
            
            {/* Contact Details */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 flex-shrink-0" />
                <a 
                  href={`mailto:${portfolioData?.personal.email}`}
                  className="hover:text-cyan-400 transition-colors text-sm sm:text-base break-all"
                >
                  {portfolioData?.personal.email}
                </a>
              </div>
              
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 flex-shrink-0" />
                <span className="text-sm sm:text-base">{portfolioData?.personal.location}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-slate-50">
                Find me on
              </h4>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-slate-400 ${social.color} transition-colors p-2.5 sm:p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 touch-manipulation`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Visit my ${social.name} profile`}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-50">
                Send a Message
              </h3>

              {/* Success/Error Messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">Message sent successfully! I'll get back to you soon.</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">Failed to send message. Please try again or contact me directly.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors text-slate-50 placeholder-slate-400 text-sm sm:text-base ${
                        errors.name ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors text-slate-50 placeholder-slate-400 text-sm sm:text-base ${
                        errors.email ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors text-slate-50 placeholder-slate-400 text-sm sm:text-base ${
                      errors.subject ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="What would you like to discuss?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors text-slate-50 placeholder-slate-400 resize-vertical text-sm sm:text-base ${
                      errors.message ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Tell me about your project, opportunity, or just say hello!"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={status === 'submitting'}
                  disabled={status === 'submitting'}
                  className="w-full touch-manipulation"
                >
                  {status === 'submitting' ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="text-sm sm:text-base">Send Message</span>
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};