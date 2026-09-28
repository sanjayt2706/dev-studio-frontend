import { useState, useEffect } from 'react';
import { PLACEHOLDERS } from '../../utils/images';

/**
 * Resilient image component for all content cards.
 * Prevents broken images, collapsed cards, and missing visual frames.
 */
const SmartImage = ({
  src,
  alt = '',
  type = 'project',
  className = '',
  imgClassName = '',
  aspectRatio,
  loading = 'lazy',
  children,
}) => {
  const fallback = PLACEHOLDERS[type] || PLACEHOLDERS.project;
  const isValidSrc = src && typeof src === 'string' && src.trim() !== '';
  
  const [imgSrc, setImgSrc] = useState(isValidSrc ? src : fallback);
  const [hasError, setHasError] = useState(!isValidSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (src && typeof src === 'string' && src.trim() !== '') {
      setImgSrc(src);
      setHasError(false);
      setIsLoaded(false);
    } else {
      setImgSrc(fallback);
      setHasError(true);
      setIsLoaded(true);
    }
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-surface ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-70'
        } ${hasError ? 'brightness-90' : ''} ${imgClassName}`}
      />
      {children}
    </div>
  );
};

export default SmartImage;
