const fs = require('fs');
const path = require('path');

// Path to the seed file
const seedFilePath = path.join(__dirname, 'prisma/seed.ts');
// Path to the backup file
const backupFilePath = path.join(__dirname, 'prisma/seed.ts.backup');

try {
  // Read the backup file if it exists, otherwise use the original seed file
  if (fs.existsSync(backupFilePath)) {
    console.log('Restoring from backup file...');
    const backupContent = fs.readFileSync(backupFilePath, 'utf8');
    fs.writeFileSync(seedFilePath, backupContent);
    console.log('Successfully restored seed.ts from backup.');
  } else {
    console.log('No backup file found. Creating a modified seed file...');
    // Read the original seed file
    const seedContent = fs.readFileSync(seedFilePath, 'utf8');
    
    // Extract the products array section
    const productsMatch = seedContent.match(/const products = \[([\s\S]*?)\];/);
    if (!productsMatch) {
      console.error('Could not find products array in seed.ts');
      process.exit(1);
    }
    
    // List all image files in the products directory
    const productsDir = path.join(__dirname, 'public/images/products');
    let productImages = [];
    
    try {
      productImages = fs.readdirSync(productsDir)
        .filter(file => {
          // Filter out directories and only include image files
          try {
            const stats = fs.statSync(path.join(productsDir, file));
            return !stats.isDirectory() && /\.(png|jpg|jpeg)$/i.test(file);
          } catch (err) {
            return false;
          }
        })
        .map(file => `/images/products/${file}`);
    } catch (error) {
      console.error('Error reading product images directory:', error);
    }
    
    // Get a unique list of existing products
    const existingProducts = productsMatch[1].match(/sku: '([^']+)'/g) || [];
    const existingSkus = existingProducts.map(sku => sku.replace(/sku: '([^']+)'/, '$1'));
    
    // Update product images in existing products
    let modifiedProductsContent = productsMatch[1];
    
    // Create a map for better distribution of images
    const categoryImageMapping = {
      'rings': [],
      'bracelets': [],
      'necklaces': [],
      'earrings': [],
      'watches': []
    };
    
    // Distribute images across categories (simple round-robin)
    let categoryIndex = 0;
    const categories = Object.keys(categoryImageMapping);
    
    for (const image of productImages) {
      const category = categories[categoryIndex % categories.length];
      categoryImageMapping[category].push(image);
      categoryIndex++;
    }
    
    // Generate updated product file content
    console.log(`Found ${productImages.length} images. Updating product entries...`);
    
    // For each existing product, update its images
    for (const category of categories) {
      const categoryImages = categoryImageMapping[category];
      let imagesAdded = 0;
      
      // Update regex pattern to find products for this category
      const categoryPattern = new RegExp(`categoryId: categoriesMap\\['${category}'\\][\\s\\S]*?images: \\[[^\\]]*\\]`, 'g');
      const matches = modifiedProductsContent.match(categoryPattern) || [];
      
      // Update each product's images
      for (const match of matches) {
        if (imagesAdded >= categoryImages.length) break;
        
        // Get 1-2 images for this product
        const productImageCount = Math.min(2, categoryImages.length - imagesAdded);
        const productImages = categoryImages.slice(imagesAdded, imagesAdded + productImageCount);
        imagesAdded += productImageCount;
        
        // Replace the images array
        const newImagesArray = `images: [${productImages.map(img => `'${img}'`).join(', ')}]`;
        modifiedProductsContent = modifiedProductsContent.replace(
          match,
          match.replace(/images: \[[^\]]*\]/, newImagesArray)
        );
      }
    }
    
    // Update the products array in the seed content
    const updatedSeedContent = seedContent.replace(
      /const products = \[([\s\S]*?)\];/,
      `const products = [${modifiedProductsContent}];`
    );
    
    // Write the updated content back to the seed file
    fs.writeFileSync(seedFilePath, updatedSeedContent);
    console.log('Successfully updated seed.ts with all product images.');
  }
} catch (error) {
  console.error('Error fixing seed file:', error);
} 