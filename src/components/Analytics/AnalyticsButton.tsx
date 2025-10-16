import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Eye, Download, Mail } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { getAnalyticsSummary } from '../../services/analytics';

export const AnalyticsButton: React.FC = () => {
  const { toggleAnalyticsDashboard } = useAnalytics();
  const [showTooltip, setShowTooltip] = useState(false);
  const [summary] = useState(getAnalyticsSummary());

  // Only show if there's some analytics data
  const hasData = summary.total.downloads > 0 || summary.total.views > 0 || summary.total.contacts > 0;

  if (!hasData) return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.3 }}
    >
      <div className="relative">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute bottom-full right-0 mb-2 bg-slate-800 text-slate-50 px-3 py-2 rounded-lg shadow-lg border border-slate-700 whitespace-nowrap"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm font-medium mb-1">Analytics Summary</div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3 text-blue-500" />
                  <span>{summary.total.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-3 h-3 text-green-500" />
                  <span>{summary.total.downloads} downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-purple-500" />
                  <span>{summary.total.contacts} contacts</span>
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={toggleAnalyticsDashboard}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-50 p-3 rounded-full shadow-lg border border-slate-600 hover:border-cyan-500/50 transition-all duration-200 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BarChart3 className="w-6 h-6 text-cyan-500 group-hover:text-cyan-400" />
          
          {/* Notification Badge */}
          {summary.today.downloads > 0 || summary.today.views > 0 || summary.today.contacts > 0 ? (
            <motion.div
              className="absolute -top-1 -right-1 bg-cyan-500 text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 30 }}
            >
              {Math.min(summary.today.downloads + summary.today.views + summary.today.contacts, 9)}
            </motion.div>
          ) : null}
        </motion.button>
      </div>
    </motion.div>
  );
};