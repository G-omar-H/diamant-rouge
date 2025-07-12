// lib/imageUtils.ts

/**
 * Utility functions for image optimization
 */

export interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

/**
 * Generate an optimized image URL using our custom optimization API
 * 
 * @param src - Source image URL or path
 * @param options - Optimization options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  src: string, 
  options: ImageOptimizationOptions = {}
): string {
  const { 
    width = 800, 
    quality = 75, 
    format = 'webp' 
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString(),
    f: format
  });

  return `${baseUrl}/api/images/optimize?${params.toString()}`;
}

/**
 * Common image optimization presets for different use cases
 */
export const ImagePresets = {
  // Hero images and banners
  hero: { width: 1920, quality: 85, format: 'webp' as const },
  
  // Product cards in listings
  productCard: { width: 400, quality: 80, format: 'webp' as const },
  
  // Product detail images
  productDetail: { width: 800, quality: 85, format: 'webp' as const },
  
  // Thumbnails
  thumbnail: { width: 150, quality: 75, format: 'webp' as const },
  
  // Mobile optimized
  mobile: { width: 640, quality: 75, format: 'webp' as const },
  
  // High quality for print/zoom
  highQuality: { width: 1200, quality: 90, format: 'webp' as const }
};

/**
 * Get optimized image URL using a preset
 * 
 * @param src - Source image URL or path
 * @param preset - Preset name
 * @returns Optimized image URL
 */
export function getOptimizedImageUrlWithPreset(
  src: string, 
  preset: keyof typeof ImagePresets
): string {
  return getOptimizedImageUrl(src, ImagePresets[preset]);
}

/**
 * Generate responsive image sources for different screen sizes
 * 
 * @param src - Source image URL or path
 * @returns Object with different sized image URLs
 */
export function getResponsiveImageSources(src: string) {
  return {
    mobile: getOptimizedImageUrl(src, { width: 640, quality: 75 }),
    tablet: getOptimizedImageUrl(src, { width: 1024, quality: 80 }),
    desktop: getOptimizedImageUrl(src, { width: 1920, quality: 85 }),
  };
}

/**
 * Check if an image URL is external (needs fetching) or local
 * 
 * @param src - Image source URL
 * @returns true if external, false if local
 */
export function isExternalImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

/**
 * Generate a fallback/placeholder image URL
 * 
 * @param width - Image width
 * @param height - Image height
 * @param text - Placeholder text
 * @returns Placeholder image URL
 */
export function getPlaceholderImageUrl(
  width: number = 400, 
  height: number = 400, 
  text: string = 'Loading...'
): string {
  return `https://via.placeholder.com/${width}x${height}/FAF3E3/D4AF37?text=${encodeURIComponent(text)}`;
} 