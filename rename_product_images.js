const fs = require('fs');
const path = require('path');

// Define paths
const seedFilePath = path.join('diamant-rouge', 'prisma', 'products-seed.js');
const imagesDir = path.join('diamant-rouge', 'public', 'images', 'products');

// Function to extract product data from seed file
function extractProductData() {
  try {
    // Read seed file
    const seedFile = fs.readFileSync(seedFilePath, 'utf8');
    
    // Use regex to extract product data
    const productRegex = /{\s*sku:\s*'([^']+)',[\s\S]*?images:\s*\[\s*'([^']+)'[\s\S]*?translations:\s*\[\s*{\s*language:\s*'en',\s*name:\s*'([^']+)',/g;
    
    const products = [];
    let match;
    
    while ((match = productRegex.exec(seedFile)) !== null) {
      const [_, sku, imagePath, productName] = match;
      const imageFilename = imagePath.split('/').pop();
      
      products.push({
        sku,
        imagePath,
        imageFilename,
        productName: productName.trim()
      });
    }
    
    console.log(`Found ${products.length} products in seed file`);
    return products;
  } catch (error) {
    console.error('Error extracting product data:', error);
    return [];
  }
}

// Function to create a valid filename from product name
function createValidFilename(productName, sku, category) {
  // Remove any special characters and replace spaces with underscores
  let filename = productName.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_');
  
  // Add category and SKU to make filename unique
  return `${category}_${filename}_${sku}.png`;
}

// Function to rename image files
function renameProductImages() {
  try {
    // Get product data
    const products = extractProductData();
    
    if (products.length === 0) {
      console.log('No products found to process');
      return;
    }
    
    // Get all image files in directory
    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg'].includes(ext);
      });
    
    console.log(`Found ${imageFiles.length} image files in directory`);
    
    // Create mapping of current image names to new image names
    const imageMappings = [];
    const renamedImages = new Set();
    
    products.forEach(product => {
      if (!product.imageFilename) {
        console.log(`No image filename for product ${product.sku}`);
        return;
      }
      
      // Extract category from SKU
      const category = product.sku.split('-')[0].toLowerCase();
      
      // Create new filename
      const newFilename = createValidFilename(product.productName, product.sku, category);
      
      // Check if the image exists in the directory
      if (imageFiles.includes(product.imageFilename)) {
        imageMappings.push({
          oldFilename: product.imageFilename,
          newFilename,
          productName: product.productName,
          sku: product.sku
        });
        renamedImages.add(product.imageFilename);
      } else {
        console.log(`Image file not found: ${product.imageFilename}`);
      }
    });
    
    // Create a backup directory
    const backupDir = path.join(imagesDir, 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
      console.log('Created backup directory');
    }
    
    // Backup and rename files
    imageMappings.forEach(mapping => {
      const oldPath = path.join(imagesDir, mapping.oldFilename);
      const newPath = path.join(imagesDir, mapping.newFilename);
      const backupPath = path.join(backupDir, mapping.oldFilename);
      
      try {
        // Copy to backup first
        fs.copyFileSync(oldPath, backupPath);
        
        // Rename the file
        fs.renameSync(oldPath, newPath);
        
        console.log(`Renamed: ${mapping.oldFilename} -> ${mapping.newFilename}`);
      } catch (err) {
        console.error(`Error renaming ${mapping.oldFilename}:`, err);
      }
    });
    
    // Handle images without product entries
    const unmappedImages = imageFiles.filter(file => !renamedImages.has(file));
    
    console.log(`Found ${unmappedImages.length} unmapped images`);
    
    if (unmappedImages.length > 0) {
      console.log('These images do not have corresponding product entries:');
      unmappedImages.forEach(file => {
        console.log(`- ${file}`);
        
        // Copy these to backup as well
        const oldPath = path.join(imagesDir, file);
        const backupPath = path.join(backupDir, file);
        
        try {
          fs.copyFileSync(oldPath, backupPath);
        } catch (err) {
          console.error(`Error backing up ${file}:`, err);
        }
      });
    }
    
    // Update seed file with new image paths
    if (imageMappings.length > 0) {
      console.log('\nUpdating seed file with new image paths...');
      let seedFileContent = fs.readFileSync(seedFilePath, 'utf8');
      
      imageMappings.forEach(mapping => {
        const oldImagePath = `/images/products/${mapping.oldFilename}`;
        const newImagePath = `/images/products/${mapping.newFilename}`;
        
        // Replace all occurrences
        seedFileContent = seedFileContent.replace(
          new RegExp(oldImagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          newImagePath
        );
      });
      
      // Create backup of seed file
      fs.writeFileSync(`${seedFilePath}.backup`, fs.readFileSync(seedFilePath));
      console.log('Created backup of seed file');
      
      // Write updated content back to seed file
      fs.writeFileSync(seedFilePath, seedFileContent);
      console.log('Updated seed file with new image paths');
    }
    
    console.log('\nImage renaming process completed!');
    console.log(`Successfully renamed ${imageMappings.length} images`);
    
  } catch (error) {
    console.error('Error renaming product images:', error);
  }
}

// Run the main function
renameProductImages(); 