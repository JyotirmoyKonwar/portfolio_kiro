import { EmailService, EmailServiceConfig } from '../services/emailService';

/**
 * Initialize email service with configuration
 * This should be called when the app starts
 */
export const initializeEmailService = (): void => {
  // Check if we have EmailJS configuration
  const emailjsConfig = EmailServiceConfig.emailjs;
  
  if (emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey) {
    EmailService.initialize(emailjsConfig);
    console.log('EmailJS service initialized successfully');
  } else {
    console.warn('EmailJS configuration is incomplete. Contact form will use fallback methods.');
    console.warn('Please check your environment variables:');
    console.warn('- VITE_EMAILJS_SERVICE_ID');
    console.warn('- VITE_EMAILJS_TEMPLATE_ID');
    console.warn('- VITE_EMAILJS_PUBLIC_KEY');
  }
};

/**
 * Check if email service is properly configured
 */
export const isEmailServiceConfigured = (): boolean => {
  return EmailService.isConfigured();
};

/**
 * Get email service status for debugging
 */
export const getEmailServiceStatus = () => {
  const config = EmailServiceConfig.emailjs;
  
  return {
    configured: isEmailServiceConfigured(),
    hasServiceId: !!config.serviceId,
    hasTemplateId: !!config.templateId,
    hasPublicKey: !!config.publicKey,
    emailjsLoaded: typeof window !== 'undefined' && !!(window as any).emailjs,
  };
};