import type { AnalyticsEvent, AnalyticsData } from '../types';

// Constants for localStorage keys
const ANALYTICS_KEY = 'portfolio_analytics';
const SESSION_KEY = 'portfolio_session';

// Privacy-compliant visitor information
interface VisitorInfo {
  userAgent: string;
  referrer: string;
  timestamp: Date;
  sessionId: string;
}

// Generate a simple hash for IP privacy (client-side approximation)
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Get privacy-compliant visitor information
const getVisitorInfo = (): Partial<VisitorInfo> => {
  return {
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    timestamp: new Date(),
    sessionId: getSessionId()
  };
};

// Load analytics data from localStorage
const loadAnalyticsData = (): AnalyticsData => {
  try {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      data.events = data.events.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }));
      return data;
    }
  } catch (error) {
    console.warn('Failed to load analytics data:', error);
  }
  
  return {
    events: [],
    totalDownloads: 0,
    totalViews: 0,
    totalContacts: 0
  };
};

// Save analytics data to localStorage
const saveAnalyticsData = (data: AnalyticsData): void => {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save analytics data:', error);
  }
};

// Create analytics service
export class AnalyticsService {
  private data: AnalyticsData;

  constructor() {
    this.data = loadAnalyticsData();
    this.trackPageView();
  }

  // Track page view
  private trackPageView(): void {
    const visitorInfo = getVisitorInfo();
    this.trackEvent('view', visitorInfo);
  }

  // Track resume download
  trackResumeDownload(): void {
    const visitorInfo = getVisitorInfo();
    this.trackEvent('download', visitorInfo);
    this.data.totalDownloads++;
    this.saveData();
  }

  // Track contact form interaction
  trackContactInteraction(): void {
    const visitorInfo = getVisitorInfo();
    this.trackEvent('contact', visitorInfo);
    this.data.totalContacts++;
    this.saveData();
  }

  // Generic event tracking
  private trackEvent(type: AnalyticsEvent['type'], visitorInfo: Partial<VisitorInfo>): void {
    const event: AnalyticsEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      timestamp: new Date(),
      userAgent: visitorInfo.userAgent,
      referrer: visitorInfo.referrer,
      ipHash: visitorInfo.sessionId // Using sessionId as privacy-compliant identifier
    };

    this.data.events.push(event);
    
    if (type === 'view') {
      this.data.totalViews++;
    }
    
    this.saveData();
  }

  // Get analytics data
  getAnalyticsData(): AnalyticsData {
    return { ...this.data };
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayEvents = this.data.events.filter(event => 
      event.timestamp >= today
    );
    
    const weekEvents = this.data.events.filter(event => 
      event.timestamp >= thisWeek
    );
    
    const monthEvents = this.data.events.filter(event => 
      event.timestamp >= thisMonth
    );

    return {
      total: {
        downloads: this.data.totalDownloads,
        views: this.data.totalViews,
        contacts: this.data.totalContacts
      },
      today: {
        downloads: todayEvents.filter(e => e.type === 'download').length,
        views: todayEvents.filter(e => e.type === 'view').length,
        contacts: todayEvents.filter(e => e.type === 'contact').length
      },
      thisWeek: {
        downloads: weekEvents.filter(e => e.type === 'download').length,
        views: weekEvents.filter(e => e.type === 'view').length,
        contacts: weekEvents.filter(e => e.type === 'contact').length
      },
      thisMonth: {
        downloads: monthEvents.filter(e => e.type === 'download').length,
        views: monthEvents.filter(e => e.type === 'view').length,
        contacts: monthEvents.filter(e => e.type === 'contact').length
      }
    };
  }

  // Get recent events
  getRecentEvents(limit: number = 10): AnalyticsEvent[] {
    return this.data.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Clear analytics data (for privacy compliance)
  clearAnalyticsData(): void {
    this.data = {
      events: [],
      totalDownloads: 0,
      totalViews: 0,
      totalContacts: 0
    };
    this.saveData();
    localStorage.removeItem(SESSION_KEY);
  }

  // Export analytics data
  exportAnalyticsData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  // Save data to localStorage
  private saveData(): void {
    saveAnalyticsData(this.data);
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Export convenience functions
export const trackResumeDownload = () => analyticsService.trackResumeDownload();
export const trackContactInteraction = () => analyticsService.trackContactInteraction();
export const getAnalyticsSummary = () => analyticsService.getAnalyticsSummary();
export const getRecentEvents = (limit?: number) => analyticsService.getRecentEvents(limit);
export const clearAnalyticsData = () => analyticsService.clearAnalyticsData();
export const exportAnalyticsData = () => analyticsService.exportAnalyticsData();