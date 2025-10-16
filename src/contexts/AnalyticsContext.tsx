import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { analyticsService } from '../services/analytics';
import type { AnalyticsData } from '../types';

interface AnalyticsContextType {
  analyticsData: AnalyticsData;
  refreshAnalytics: () => void;
  isAnalyticsDashboardOpen: boolean;
  openAnalyticsDashboard: () => void;
  closeAnalyticsDashboard: () => void;
  toggleAnalyticsDashboard: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(
    analyticsService.getAnalyticsData()
  );
  const [isAnalyticsDashboardOpen, setIsAnalyticsDashboardOpen] = useState(false);

  const refreshAnalytics = () => {
    setAnalyticsData(analyticsService.getAnalyticsData());
  };

  const openAnalyticsDashboard = () => {
    setIsAnalyticsDashboardOpen(true);
    refreshAnalytics(); // Refresh data when opening
  };

  const closeAnalyticsDashboard = () => {
    setIsAnalyticsDashboardOpen(false);
  };

  const toggleAnalyticsDashboard = () => {
    if (isAnalyticsDashboardOpen) {
      closeAnalyticsDashboard();
    } else {
      openAnalyticsDashboard();
    }
  };

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio_analytics') {
        refreshAnalytics();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Refresh analytics data periodically
  useEffect(() => {
    const interval = setInterval(refreshAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const value: AnalyticsContextType = {
    analyticsData,
    refreshAnalytics,
    isAnalyticsDashboardOpen,
    openAnalyticsDashboard,
    closeAnalyticsDashboard,
    toggleAnalyticsDashboard
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};