import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { AlertCircle } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  webpSrc?: string;
  avifSrc?: string;
  placeholder?: string;
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: string;
  sizes?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  webpSrc,
  avifSrc,
  placeholder,
  blurDataURL,
  loading = 'lazy',
  onLoad,
  onError,
  aspectRatio,
  sizes
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    // Try modern formats first, then fallback
    const sources = [
      avifSrc,
      webpSrc,
      src
    ].filter(Boolean) as string[];

    let currentIndex = 0;

    const tryLoadImage = () => {
      if (currentIndex >= sources.length) {
        // All sources failed, try fallback
        if (fallbackSrc) {
          img.src = fallbackSrc;
          setCurrentSrc(fallbackSrc);
        } else {
          setImageState('error');
          onError?.();
        }
        return;
      }

      const source = sources[currentIndex];
      img.src = source;
      setCurrentSrc(source);
    };

    img.onload = () => {
      setImageState('loaded');
      onLoad?.();
    };

    img.onerror = () => {
      currentIndex++;
      tryLoadImage();
    };

    tryLoadImage();

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, src, webpSrc, avifSrc, fallbackSrc, onLoad, onError]);

  const containerStyle = aspectRatio ? { aspectRatio } : {};

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      <AnimatePresence mode="wait">
        {imageState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-800"
          >
            {blurDataURL ? (
              <img
                src={blurDataURL}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
                aria-hidden="true"
              />
            ) : placeholder ? (
              <img
                src={placeholder}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                aria-hidden="true"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800" />
            )}
            <LoadingSpinner size="md" variant="spinner" />
          </motion.div>
        )}

        {imageState === 'loaded' && currentSrc && (
          <motion.img
            key="loaded"
            src={currentSrc}
            alt={alt}
            sizes={sizes}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full object-cover"
            loading={loading}
          />
        )}

        {imageState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-400"
          >
            <AlertCircle className="w-8 h-8 mb-2" />
            <span className="text-sm text-center px-4">
              Failed to load image
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Utility function to generate WebP and AVIF sources
export const generateImageSources = (
  originalSrc: string,
  options?: {
    webpPath?: string;
    avifPath?: string;
    sizes?: number[];
  }
) => {
  const { webpPath, avifPath, sizes = [400, 800, 1200] } = options || {};
  
  const getFileExtension = (src: string) => src.split('.').pop()?.toLowerCase();
  const getBasePath = (src: string) => src.substring(0, src.lastIndexOf('.'));
  
  const basePath = getBasePath(originalSrc);
  const extension = getFileExtension(originalSrc);
  
  return {
    original: originalSrc,
    webp: webpPath || `${basePath}.webp`,
    avif: avifPath || `${basePath}.avif`,
    srcSet: sizes.map(size => `${basePath}-${size}w.${extension} ${size}w`).join(', '),
    webpSrcSet: sizes.map(size => `${basePath}-${size}w.webp ${size}w`).join(', '),
    avifSrcSet: sizes.map(size => `${basePath}-${size}w.avif ${size}w`).join(', '),
    sizes: '(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px'
  };
};

// Picture element with multiple sources for better browser support
export const ResponsivePicture: React.FC<{
  src: string;
  alt: string;
  className?: string;
  webpSrc?: string;
  avifSrc?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, className, webpSrc, avifSrc, sizes, loading = 'lazy' }) => {
  return (
    <picture className={className}>
      {avifSrc && (
        <source srcSet={avifSrc} type="image/avif" sizes={sizes} />
      )}
      {webpSrc && (
        <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
      )}
      <LazyImage
        src={src}
        alt={alt}
        className="w-full h-full"
        loading={loading}
        sizes={sizes}
      />
    </picture>
  );
};