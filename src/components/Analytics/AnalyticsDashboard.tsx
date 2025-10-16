import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  Eye, 
  Mail, 
  Calendar,
  Clock,
  Trash2,
  FileDown,
  X,
  TrendingUp
} from 'lucide-react';
import { Button, Card } from '../UI';
import { analyticsService, clearAnalyticsData, exportAnalyticsData } from '../../services/analytics';
import type { AnalyticsEvent } from '../../types';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [summary, setSummary] = useState(analyticsService.getAnalyticsSummary());
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Refresh data when dashboard opens
      setSummary(analyticsService.getAnalyticsSummary());
      setRecentEvents(analyticsService.getRecentEvents(20));
    }
  }, [isOpen]);

  const handleClearData = () => {
    clearAnalyticsData();
    setSummary(analyticsService.getAnalyticsSummary());
    setRecentEvents([]);
    setShowConfirmClear(false);
  };

  const handleExportData = () => {
    const data = exportAnalyticsData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getEventIcon = (type: AnalyticsEvent['type']) => {
    switch (type) {
      case 'download':
        return <Download className="w-4 h-4 text-green-500" />;
      case 'view':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'contact':
        return <Mail className="w-4 h-4 text-purple-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventColor = (type: AnalyticsEvent['type']) => {
    switch (type) {
      case 'download':
        return 'border-l-green-500 bg-green-500/5';
      case 'view':
        return 'border-l-blue-500 bg-blue-500/5';
      case 'contact':
        return 'border-l-purple-500 bg-purple-500/5';
      default:
        return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-50">Analytics Dashboard</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-slate-700/50 border-slate-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Total Downloads</p>
                      <p className="text-2xl font-bold text-green-500">{summary.total.downloads}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {summary.thisWeek.downloads} this week
                      </p>
                    </div>
                    <Download className="w-8 h-8 text-green-500/30" />
                  </div>
                </Card>

                <Card className="p-4 bg-slate-700/50 border-slate-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Total Views</p>
                      <p className="text-2xl font-bold text-blue-500">{summary.total.views}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {summary.thisWeek.views} this week
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-500/30" />
                  </div>
                </Card>

                <Card className="p-4 bg-slate-700/50 border-slate-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Contact Interactions</p>
                      <p className="text-2xl font-bold text-purple-500">{summary.total.contacts}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {summary.thisWeek.contacts} this week
                      </p>
                    </div>
                    <Mail className="w-8 h-8 text-purple-500/30" />
                  </div>
                </Card>
              </div>

              {/* Time Period Breakdown */}
              <Card className="p-6 bg-slate-700/50 border-slate-600">
                <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-500" />
                  Activity Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Today
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Downloads:</span>
                        <span className="text-green-500 font-medium">{summary.today.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Views:</span>
                        <span className="text-blue-500 font-medium">{summary.today.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Contacts:</span>
                        <span className="text-purple-500 font-medium">{summary.today.contacts}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      This Week
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Downloads:</span>
                        <span className="text-green-500 font-medium">{summary.thisWeek.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Views:</span>
                        <span className="text-blue-500 font-medium">{summary.thisWeek.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Contacts:</span>
                        <span className="text-purple-500 font-medium">{summary.thisWeek.contacts}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      This Month
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Downloads:</span>
                        <span className="text-green-500 font-medium">{summary.thisMonth.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Views:</span>
                        <span className="text-blue-500 font-medium">{summary.thisMonth.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Contacts:</span>
                        <span className="text-purple-500 font-medium">{summary.thisMonth.contacts}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Events */}
              <Card className="p-6 bg-slate-700/50 border-slate-600">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Recent Activity</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentEvents.length > 0 ? (
                    recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border-l-4 ${getEventColor(event.type)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getEventIcon(event.type)}
                            <div>
                              <p className="text-sm font-medium text-slate-200 capitalize">
                                {event.type} Event
                              </p>
                              <p className="text-xs text-slate-400">
                                {formatDate(event.timestamp)}
                              </p>
                            </div>
                          </div>
                          {event.referrer && (
                            <p className="text-xs text-slate-500 max-w-32 truncate">
                              from {new URL(event.referrer).hostname}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No recent activity</p>
                  )}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    Export Data
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmClear(true)}
                  className="flex items-center gap-2 text-red-400 border-red-400/30 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </Button>
              </div>

              {/* Privacy Notice */}
              <Card className="p-4 bg-slate-700/30 border-slate-600">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Privacy Notice:</strong> This analytics system stores data locally in your browser. 
                  No personal information is collected or transmitted to external servers. 
                  Data includes basic interaction events, timestamps, and referrer information for portfolio optimization purposes.
                </p>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Confirm Clear Dialog */}
        <AnimatePresence>
          {showConfirmClear && (
            <motion.div
              className="absolute inset-0 bg-black/70 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold text-slate-50 mb-3">Clear Analytics Data</h3>
                <p className="text-slate-300 mb-6">
                  Are you sure you want to clear all analytics data? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmClear(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleClearData}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Clear Data
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};