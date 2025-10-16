import type { ContactFormData } from '../types';

export interface EmailConfig {
    serviceId: string;
    templateId: string;
    publicKey: string;
}

export interface EmailServiceResponse {
    success: boolean;
    message: string;
    error?: string;
}

/**
 * Email service using EmailJS for client-side email sending
 * This is a popular solution for static sites and client-side applications
 */
export class EmailService {
    private static config: EmailConfig | null = null;

    /**
     * Initialize the email service with configuration
     */
    static initialize(config: EmailConfig): void {
        this.config = config;

        // Debug logging
        console.log('EmailJS Configuration:', {
            serviceId: config.serviceId ? '✓ Set' : '✗ Missing',
            templateId: config.templateId ? '✓ Set' : '✗ Missing',
            publicKey: config.publicKey ? '✓ Set' : '✗ Missing',
            emailjsLoaded: typeof window !== 'undefined' && !!(window as any).emailjs
        });

        // Initialize EmailJS if available
        if (typeof window !== 'undefined' && (window as any).emailjs) {
            (window as any).emailjs.init(config.publicKey);
            console.log('EmailJS initialized successfully');
        } else {
            console.warn('EmailJS library not loaded or window not available');
        }
    }

    /**
     * Check if EmailJS is available and configured
     */
    static isConfigured(): boolean {
        return (
            this.config !== null &&
            typeof window !== 'undefined' &&
            (window as any).emailjs &&
            this.config.serviceId &&
            this.config.templateId &&
            this.config.publicKey
        );
    }

    /**
     * Send email using EmailJS
     */
    static async sendEmail(formData: ContactFormData): Promise<EmailServiceResponse> {
        console.log('Attempting to send email...', { isConfigured: this.isConfigured() });
        
        if (!this.isConfigured()) {
            console.warn('Email service not configured, falling back to mailto');
            return {
                success: false,
                message: 'Email service is not properly configured',
                error: 'CONFIGURATION_ERROR'
            };
        }

        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to_name: 'Portfolio Owner', // You can customize this
            };

            const response = await (window as any).emailjs.send(
                this.config!.serviceId,
                this.config!.templateId,
                templateParams
            );

            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Email sent successfully!'
                };
            } else {
                throw new Error(`EmailJS returned status: ${response.status}`);
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            return {
                success: false,
                message: 'Failed to send email. Please try again or contact directly.',
                error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
            };
        }
    }

    /**
     * Alternative: Send email using a backend API
     * Use this if you have a backend service for sending emails
     */
    static async sendEmailViaAPI(formData: ContactFormData, apiEndpoint: string): Promise<EmailServiceResponse> {
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            return {
                success: true,
                message: result.message || 'Email sent successfully!'
            };
        } catch (error) {
            console.error('API email sending failed:', error);
            return {
                success: false,
                message: 'Failed to send email. Please try again or contact directly.',
                error: error instanceof Error ? error.message : 'API_ERROR'
            };
        }
    }

    /**
     * Fallback: Open default email client
     */
    static openEmailClient(formData: ContactFormData, recipientEmail: string): void {
        const subject = encodeURIComponent(formData.subject);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );

        const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        window.open(mailtoUrl, '_blank');
    }
}

/**
 * Configuration helper for different email services
 */
export const EmailServiceConfig = {
    /**
     * EmailJS configuration
     * Sign up at https://www.emailjs.com/
     */
    emailjs: {
        // Replace with your actual EmailJS configuration
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
    },

    /**
     * Custom API endpoint configuration
     */
    api: {
        endpoint: import.meta.env.VITE_EMAIL_API_ENDPOINT || '/api/contact',
    },
};