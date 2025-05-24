const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const productsDir = path.join('diamant-rouge', 'public', 'images', 'products');

// Function to get file size in MB
function getFileSizeInMB(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

// Get all image files
try {
  if (!fs.existsSync(productsDir)) {
    console.log(`Directory ${productsDir} not found`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(productsDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });
  
  if (imageFiles.length === 0) {
    console.log('No image files found');
    process.exit(1);
  }
  
  console.log(`Found ${imageFiles.length} image files\n`);
  
  // Analyze first 10 images as a sample
  const sampleSize = Math.min(10, imageFiles.length);
  console.log(`Analyzing first ${sampleSize} images as a sample:\n`);
  
  imageFiles.slice(0, sampleSize).forEach(file => {
    const filePath = path.join(productsDir, file);
    const fileSize = getFileSizeInMB(filePath);
    
    console.log(`File: ${file}`);
    console.log(`  Format: ${path.extname(file).substr(1).toUpperCase()}`);
    console.log(`  Size: ${fileSize.toFixed(2)} MB`);
    
    // Basic quality assessment based on file size
    if (fileSize > 3) {
      console.log('  Quality: High resolution but large file size');
      console.log('  Recommendation: Consider resizing and compressing this image');
    } else if (fileSize > 1) {
      console.log('  Quality: Good resolution');
      console.log('  Recommendation: Light compression could be beneficial');
    } else {
      console.log('  Quality: Lower resolution or good compression');
    }
    
    // Check filename pattern
    if (file.includes('Copy') || file.includes('copy')) {
      console.log('  Warning: Filename suggests this is a duplicate (contains "Copy")');
      console.log('  Recommendation: Review if this duplicate is needed');
    }
    
    console.log('---');
  });
  
  console.log('\nSummary of all images:');
  
  // Count by extension
  const extensionCount = {};
  imageFiles.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    extensionCount[ext] = (extensionCount[ext] || 0) + 1;
  });
  
  console.log('\nFile formats:');
  Object.entries(extensionCount).forEach(([ext, count]) => {
    console.log(`  ${ext}: ${count} files`);
  });
  
  // Calculate total size
  let totalSize = 0;
  imageFiles.forEach(file => {
    totalSize += getFileSizeInMB(path.join(productsDir, file));
  });
  
  console.log(`\nTotal size of all images: ${totalSize.toFixed(2)} MB`);
  console.log(`Average size per image: ${(totalSize / imageFiles.length).toFixed(2)} MB`);
  
  // Count large files
  const largeFiles = imageFiles.filter(file => 
    getFileSizeInMB(path.join(productsDir, file)) > 3
  );
  
  console.log(`\nLarge files (>3MB): ${largeFiles.length} images`);
  
  // Count potential duplicates
  const potentialDuplicates = imageFiles.filter(file => 
    file.includes('Copy') || file.includes('copy')
  );
  
  console.log(`Potential duplicates (filenames with "Copy"): ${potentialDuplicates.length} images`);
  
  // Generate optimization recommendations
  console.log('\n=== OPTIMIZATION RECOMMENDATIONS ===');
  
  if (largeFiles.length > 0) {
    console.log(`\n1. Large Image Optimization: ${largeFiles.length} images are larger than 3MB.`);
    console.log('   - Consider using image compression tools like TinyPNG, ImageOptim, or Sharp');
    console.log('   - Resize images to appropriate dimensions for web display (max 1920px width for full-screen)');
    console.log('   - Consider serving different image sizes for different devices using srcset');
  }
  
  if (potentialDuplicates.length > 0) {
    console.log(`\n2. Duplicate Management: Found ${potentialDuplicates.length} potential duplicate images`);
    console.log('   - Review files with "Copy" in filename and remove unnecessary duplicates');
    console.log('   - Standardize naming convention for product images');
  }
  
  if (extensionCount['.png'] && extensionCount['.png'] > 0) {
    console.log('\n3. Format Optimization: Consider converting PNG to WebP or JPEG');
    console.log('   - PNG files are often larger than necessary for product photos');
    console.log('   - For photos without transparency, JPEG or WebP typically provide better compression');
    console.log('   - Modern browsers support WebP which offers 25-35% smaller file sizes than JPEG');
  }
  
  console.log('\n4. General Web Performance:');
  console.log('   - Implement lazy loading for images below the fold');
  console.log('   - Consider using a CDN for faster image delivery');
  console.log('   - Add width and height attributes to <img> tags to prevent layout shifts');
  
} catch (error) {
  console.error(`Error: ${error.message}`);
} 