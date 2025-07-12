import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

// Dynamic import to reduce bundle size
const getSharp = async () => {
  const sharp = await import('sharp');
  return sharp.default;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, w, q, f } = req.query;

    // Validate required parameters
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid URL parameter' });
    }

    // Parse parameters
    const width = w ? parseInt(w as string) : 800;
    const quality = q ? parseInt(q as string) : 75;
    const format = (f as string) || 'webp';

    // Validate width and quality
    if (width < 16 || width > 3840) {
      return res.status(400).json({ error: 'Invalid width parameter' });
    }

    if (quality < 1 || quality > 100) {
      return res.status(400).json({ error: 'Invalid quality parameter' });
    }

    // Handle different URL types
    let imageBuffer: Buffer;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      // External URL - fetch the image
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(404).json({ error: 'Image not found' });
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      // Local file path - read from public directory
      const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
      const imagePath = path.join(process.cwd(), 'public', cleanUrl);
      
      try {
        imageBuffer = await fs.readFile(imagePath);
      } catch (error) {
        return res.status(404).json({ error: 'Image not found' });
      }
    }

    // Dynamic import Sharp to reduce bundle size
    const sharp = await getSharp();
    
    // Process image with Sharp
    let sharpInstance = sharp(imageBuffer);

    // Get original image metadata
    const metadata = await sharpInstance.metadata();
    
    // Calculate dimensions maintaining aspect ratio
    let targetWidth = width;
    let targetHeight: number | undefined;

    if (metadata.width && metadata.height) {
      const aspectRatio = metadata.height / metadata.width;
      targetHeight = Math.round(targetWidth * aspectRatio);
    }

    // Resize image
    sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    // Apply format and quality
    let processedBuffer: Buffer;
    let contentType: string;

    switch (format) {
      case 'webp':
        processedBuffer = await sharpInstance
          .webp({ quality })
          .toBuffer();
        contentType = 'image/webp';
        break;
      case 'jpeg':
      case 'jpg':
        processedBuffer = await sharpInstance
          .jpeg({ quality })
          .toBuffer();
        contentType = 'image/jpeg';
        break;
      case 'png':
        processedBuffer = await sharpInstance
          .png({ quality })
          .toBuffer();
        contentType = 'image/png';
        break;
      case 'avif':
        processedBuffer = await sharpInstance
          .avif({ quality })
          .toBuffer();
        contentType = 'image/avif';
        break;
      default:
        // Default to WebP for best compression
        processedBuffer = await sharpInstance
          .webp({ quality })
          .toBuffer();
        contentType = 'image/webp';
    }

    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', processedBuffer.length);

    // Send optimized image
    res.send(processedBuffer);

  } catch (error) {
    console.error('Image optimization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 