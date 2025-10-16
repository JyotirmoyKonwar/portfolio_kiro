import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getPortfolioData } from '../../utils/dataLoader';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime
}) => {
  const portfolioData = getPortfolioData();
  const { personal, social } = portfolioData;

  // Default values
  const defaultTitle = `${personal.name} - ${personal.title}`;
  const defaultDescription = personal.bio || personal.tagline;
  const defaultKeywords = [
    'Computer Science',
    'AI',
    'Data Science',
    'Machine Learning',
    'Portfolio',
    'Master\'s Student',
    'Research',
    'Software Development',
    'Artificial Intelligence',
    'Deep Learning'
  ];
  const defaultImage = '/images/og-image.jpg'; // You'll need to add this image
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);

  const finalTitle = title ? `${title} | ${personal.name}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...defaultKeywords, ...keywords];
  const finalImage = image || defaultImage;
  const finalImageUrl = finalImage.startsWith('http') ? finalImage : `${siteUrl}${finalImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(', ')} />
      <meta name="author" content={author || personal.name} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImageUrl} />
      <meta property="og:image:alt" content={`${personal.name} - Portfolio`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={`${personal.name} Portfolio`} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImageUrl} />
      <meta name="twitter:image:alt" content={`${personal.name} - Portfolio`} />
      {social.twitter && (
        <meta name="twitter:creator" content={social.twitter.replace('https://twitter.com/', '@')} />
      )}
      
      {/* Additional Meta Tags for Academic/Professional Sites */}
      <meta name="DC.title" content={finalTitle} />
      <meta name="DC.creator" content={personal.name} />
      <meta name="DC.subject" content="Computer Science, AI, Data Science" />
      <meta name="DC.description" content={finalDescription} />
      <meta name="DC.language" content="en" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": personal.name,
          "jobTitle": personal.title,
          "description": finalDescription,
          "url": currentUrl,
          "email": personal.email,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": personal.location
          },
          "sameAs": [
            social.linkedin,
            social.github,
            social.scholar,
            social.twitter
          ].filter(Boolean),
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "University" // This could be made dynamic
          },
          "knowsAbout": [
            "Artificial Intelligence",
            "Machine Learning",
            "Data Science",
            "Computer Science",
            "Software Development"
          ]
        })}
      </script>
      
      {/* Article-specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      
      {/* Viewport and Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  );
};