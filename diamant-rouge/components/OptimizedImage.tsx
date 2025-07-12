import Image from 'next/image';
import { getOptimizedImageUrlWithPreset, ImagePresets } from '../lib/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  preset?: keyof typeof ImagePresets;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Demo component showing how to use our image optimization system
 * This component can be used as a reference or wrapper for optimized images
 */
export default function OptimizedImage({
  src,
  alt,
  preset = 'productCard',
  className = '',
  width = 400,
  height = 400,
  priority = false
}: OptimizedImageProps) {
  
  // Example of using the optimization utilities
  const optimizedSrc = preset 
    ? getOptimizedImageUrlWithPreset(src, preset)
    : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

/**
 * Example usage:
 * 
 * // Basic usage with preset
 * <OptimizedImage 
 *   src="/images/products/ring.jpg" 
 *   alt="Diamond Ring" 
 *   preset="productCard" 
 * />
 * 
 * // Hero image with high quality
 * <OptimizedImage 
 *   src="/images/hero/banner.jpg" 
 *   alt="Hero Banner" 
 *   preset="hero"
 *   width={1920}
 *   height={800}
 *   priority
 * />
 * 
 * // Manual optimization using utilities
 * import { getOptimizedImageUrl } from '../lib/imageUtils';
 * const customOptimizedUrl = getOptimizedImageUrl('/images/custom.jpg', {
 *   width: 600,
 *   quality: 90,
 *   format: 'webp'
 * });
 */ 