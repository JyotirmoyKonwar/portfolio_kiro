# Portfolio Analytics System

This document describes the analytics system implemented for the AI Portfolio Website.

## Overview

The analytics system provides privacy-compliant tracking of user interactions with the portfolio website, including resume downloads, page views, and contact form submissions. All data is stored locally in the browser's localStorage, ensuring no external dependencies or costs.

## Features

### 1. Event Tracking
- **Page Views**: Automatically tracked when users visit the site
- **Resume Downloads**: Tracked when users download the resume/CV
- **Contact Interactions**: Tracked when users submit the contact form

### 2. Analytics Dashboard
- Real-time statistics display
- Time-based breakdowns (today, this week, this month)
- Recent activity feed
- Data export functionality
- Privacy-compliant data clearing

### 3. Privacy Compliance
- No personal information collected
- Data stored locally in browser only
- Session-based visitor identification
- Easy data clearing for users
- Transparent privacy notice

## Components

### AnalyticsService (`src/services/analytics.ts`)
Core service handling all analytics operations:
- Event tracking and storage
- Data aggregation and summaries
- localStorage management
- Privacy-compliant visitor information capture

### AnalyticsDashboard (`src/components/Analytics/AnalyticsDashboard.tsx`)
Modal dashboard displaying analytics data:
- Summary cards with key metrics
- Time-period breakdowns
- Recent events list
- Export and clear data functionality

### AnalyticsButton (`src/components/Analytics/AnalyticsButton.tsx`)
Floating action button for accessing analytics:
- Shows notification badge for new activity
- Tooltip with quick summary
- Only appears when there's data to show

### ResumeDownload (`src/components/Resume/ResumeDownload.tsx`)
Enhanced resume download component:
- Multiple display variants (button, card, inline)
- Integrated analytics tracking
- Loading states and error handling
- Accessibility features

### AnalyticsContext (`src/contexts/AnalyticsContext.tsx`)
React context for managing analytics state:
- Global analytics data access
- Dashboard state management
- Cross-tab synchronization
- Automatic data refresh

## Usage

### Basic Integration

```tsx
import { trackResumeDownload, trackContactInteraction } from '../services/analytics';

// Track resume download
const handleDownload = () => {
  trackResumeDownload();
  // ... download logic
};

// Track contact interaction
const handleContact = () => {
  trackContactInteraction();
  // ... contact logic
};
```

### Using the ResumeDownload Component

```tsx
import { ResumeDownload } from '../components/Resume';

// Button variant
<ResumeDownload variant="button" size="lg" />

// Card variant
<ResumeDownload variant="card" />

// Inline variant
<ResumeDownload variant="inline" />
```

### Accessing Analytics Data

```tsx
import { useAnalytics } from '../contexts/AnalyticsContext';

const MyComponent = () => {
  const { analyticsData, openAnalyticsDashboard } = useAnalytics();
  
  return (
    <button onClick={openAnalyticsDashboard}>
      View Analytics ({analyticsData.totalDownloads} downloads)
    </button>
  );
};
```

## Data Structure

### AnalyticsEvent
```typescript
interface AnalyticsEvent {
  id: string;
  type: 'download' | 'view' | 'contact';
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
  ipHash?: string; // Session-based identifier
}
```

### AnalyticsData
```typescript
interface AnalyticsData {
  events: AnalyticsEvent[];
  totalDownloads: number;
  totalViews: number;
  totalContacts: number;
}
```

## Storage

All analytics data is stored in the browser's localStorage under the key `portfolio_analytics`. The data structure is JSON-serialized and includes:

- Event history with timestamps
- Aggregated counters
- Session information (privacy-compliant)

## Privacy Features

1. **No External Tracking**: All data stays in the user's browser
2. **Session-Based IDs**: No persistent user identification
3. **Minimal Data Collection**: Only interaction events and basic browser info
4. **User Control**: Easy data clearing and export options
5. **Transparency**: Clear privacy notice in the dashboard

## Testing

Run the analytics tests:

```bash
npm test -- analytics.test.ts
```

The test suite covers:
- Event tracking functionality
- Data aggregation
- Storage operations
- Privacy compliance
- Error handling

## Deployment Considerations

### Free Hosting Compatibility
- Works with any static hosting (Vercel, Netlify, GitHub Pages)
- No backend requirements
- No database costs
- Client-side only implementation

### Optional Enhancements
For enhanced analytics (while maintaining free hosting):
- Vercel serverless functions for aggregated reporting
- GitHub Actions for periodic data collection
- Simple email notifications for significant events

## Maintenance

### Adding New Event Types
1. Update the `AnalyticsEvent['type']` union in `types/index.ts`
2. Add tracking function in `analytics.ts`
3. Update dashboard display logic
4. Add appropriate icons and colors

### Customizing Dashboard
The dashboard is fully customizable through:
- Tailwind CSS classes
- Framer Motion animations
- Component props and variants
- Color scheme modifications

## Security

- No sensitive data collection
- XSS protection through proper input sanitization
- CSRF protection not needed (client-side only)
- Content Security Policy compatible
- No external API calls or data transmission

## Performance

- Minimal impact on page load
- Efficient localStorage operations
- Lazy-loaded dashboard component
- Optimized re-renders with React context
- Small bundle size increase (~15KB gzipped)

## Browser Support

- Modern browsers with localStorage support
- Graceful degradation for older browsers
- No functionality breaking if localStorage is disabled
- Cross-tab synchronization where supported