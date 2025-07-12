// lib/imageLoader.js

/**
 * Custom image loader for Next.js Image component
 * Routes all images through our custom optimization API
 * 
 * @param {Object} options - Image loader options
 * @param {string} options.src - Image source URL
 * @param {number} options.width - Requested width
 * @param {number} options.quality - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export default function imageLoader({ src, width, quality }) {
  // Get the base URL for our API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  
  // Encode the source URL to handle special characters
  const encodedSrc = encodeURIComponent(src);
  
  // Build the optimization API URL with parameters
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: (quality || 75).toString(),
    f: 'webp' // Default to WebP for best compression
  });
  
  // Return the complete optimization URL
  return `${baseUrl}/api/images/optimize?${params.toString()}`;
} 