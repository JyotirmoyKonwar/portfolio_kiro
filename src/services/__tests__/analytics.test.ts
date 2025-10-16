import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AnalyticsService } from '../analytics'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'test-user-agent'
  }
})

// Mock document
Object.defineProperty(window, 'document', {
  value: {
    referrer: 'https://test-referrer.com'
  }
})

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    analyticsService = new AnalyticsService()
  })

  it('should initialize with empty analytics data', () => {
    const data = analyticsService.getAnalyticsData();
    expect(data.totalDownloads).toBe(0);
    expect(data.totalViews).toBe(1); // Page view is tracked on initialization
    expect(data.totalContacts).toBe(0);
    expect(data.events).toHaveLength(1); // Initial page view event
  });

  it('should track resume downloads', () => {
    analyticsService.trackResumeDownload();
    
    const data = analyticsService.getAnalyticsData();
    expect(data.totalDownloads).toBe(1);
    
    const downloadEvents = data.events.filter(e => e.type === 'download');
    expect(downloadEvents).toHaveLength(1);
    expect(downloadEvents[0].userAgent).toBe('test-user-agent');
  });

  it('should track contact interactions', () => {
    analyticsService.trackContactInteraction();
    
    const data = analyticsService.getAnalyticsData();
    expect(data.totalContacts).toBe(1);
    
    const contactEvents = data.events.filter(e => e.type === 'contact');
    expect(contactEvents).toHaveLength(1);
  });

  it('should generate analytics summary', () => {
    analyticsService.trackResumeDownload();
    analyticsService.trackContactInteraction();
    
    const summary = analyticsService.getAnalyticsSummary();
    
    expect(summary.total.downloads).toBe(1);
    expect(summary.total.contacts).toBe(1);
    expect(summary.total.views).toBe(1);
    
    expect(summary.today.downloads).toBe(1);
    expect(summary.today.contacts).toBe(1);
    expect(summary.today.views).toBe(1);
  });

  it('should get recent events', () => {
    analyticsService.trackResumeDownload();
    analyticsService.trackContactInteraction();
    
    const recentEvents = analyticsService.getRecentEvents(5);
    expect(recentEvents).toHaveLength(3); // 1 view + 1 download + 1 contact
    
    // Events should be sorted by timestamp (newest first)
    expect(recentEvents[0].timestamp.getTime()).toBeGreaterThanOrEqual(
      recentEvents[1].timestamp.getTime()
    );
  });

  it('should clear analytics data', () => {
    analyticsService.trackResumeDownload();
    analyticsService.trackContactInteraction();
    
    analyticsService.clearAnalyticsData();
    
    const data = analyticsService.getAnalyticsData();
    expect(data.totalDownloads).toBe(0);
    expect(data.totalViews).toBe(0);
    expect(data.totalContacts).toBe(0);
    expect(data.events).toHaveLength(0);
  });

  it('should export analytics data as JSON', () => {
    analyticsService.trackResumeDownload();
    
    const exportedData = analyticsService.exportAnalyticsData();
    const parsedData = JSON.parse(exportedData);
    
    expect(parsedData.totalDownloads).toBe(1);
    expect(parsedData.events).toHaveLength(2); // 1 view + 1 download
  });

  it('should save data to localStorage', () => {
    analyticsService.trackResumeDownload();
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'portfolio_analytics',
      expect.any(String)
    );
  });
});