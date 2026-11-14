import React, { useState } from 'react';
import { getAppropriateWebImage, getCategoryFallbackSvg } from '../../utils/imageUtils';
import { Loader2 } from 'lucide-react';

interface HazardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  category?: string;
  description?: string;
  className?: string;
  fallbackIconOnly?: boolean;
}

export const HazardImage: React.FC<HazardImageProps> = ({
  src,
  alt = 'Hazard photograph',
  category,
  description,
  className = '',
  fallbackIconOnly = false,
  ...props
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const [useSvgFallback, setUseSvgFallback] = useState<boolean>(false);

  // If no src is given, or if primary fails, use the curated web image
  const appropriateWebImage = getAppropriateWebImage(category, description || alt);
  const hasProvidedSrc = Boolean(src && src.trim() !== '');

  const activeSrc = useSvgFallback
    ? getCategoryFallbackSvg(category)
    : useFallback || !hasProvidedSrc
    ? appropriateWebImage
    : src!;

  const handleImageError = () => {
    setLoading(false);
    if (!useFallback && hasProvidedSrc) {
      // Primary failed: immediately switch to the curated web photo
      setUseFallback(true);
    } else {
      // Even the web photo failed (e.g. offline): switch to inline SVG
      setUseSvgFallback(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      {/* Loading state shimmer */}
      {loading && (
        <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        </div>
      )}

      <img
        {...props}
        src={activeSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setLoading(false)}
        onError={handleImageError}
      />
    </div>
  );
};
