const fs = require('fs');
const path = require('path');

// Get all images from the products directory
const getProductImages = () => {
  const productsDir = path.join(__dirname, '../public/images/products');
  try {
    return fs.readdirSync(productsDir)
      .filter(file => {
        // Filter out directories and only include image files
        const stats = fs.statSync(path.join(productsDir, file));
        return !stats.isDirectory() && /\.(png|jpg|jpeg)$/i.test(file);
      })
      .map(file => `/images/products/${file}`);
  } catch (error) {
    console.error('Error reading product images directory:', error);
    return [];
  }
};

// Read the seed file
const updateSeedFile = () => {
  const seedFilePath = path.join(__dirname, 'seed.ts');
  try {
    // Read the seed file
    let seedFileContent = fs.readFileSync(seedFilePath, 'utf8');
    
    // Extract the products array
    const productsArrayMatch = seedFileContent.match(/const products = \[([\s\S]*?)\];/);
    if (!productsArrayMatch) {
      console.error('Could not find products array in seed.ts');
      return;
    }
    
    const productsContent = productsArrayMatch[1];
    
    // Get all available product images
    const availableImages = getProductImages();
    console.log(`Found ${availableImages.length} product images`);
    
    // Create a mapping of existing product types to available images
    const productTypes = [
      { category: 'rings', images: [] },
      { category: 'bracelets', images: [] },
      { category: 'necklaces', images: [] },
      { category: 'earrings', images: [] },
      { category: 'watches', images: [] }
    ];
    
    // Distribute images across product types
    let imageIndex = 0;
    for (const productType of productTypes) {
      // Assign around 20% of images to each product type
      const imagesForType = Math.ceil(availableImages.length / productTypes.length);
      for (let i = 0; i < imagesForType && imageIndex < availableImages.length; i++) {
        productType.images.push(availableImages[imageIndex]);
        imageIndex++;
      }
    }
    
    // Create new products array to add to the seed file
    let newProductsArray = [];
    
    // Add 5-10 products for each category
    const categories = ['rings', 'bracelets', 'necklaces', 'earrings', 'watches'];
    let skuCounter = 100;
    
    for (const category of categories) {
      const categoryImages = productTypes.find(pt => pt.category === category).images;
      
      // Get number of images to use for this category
      const numProducts = Math.min(8, categoryImages.length / 2); // Use 2 images per product
      
      for (let i = 0; i < numProducts; i++) {
        const sku = `${category.toUpperCase()}-${skuCounter++}`;
        const basePrice = Math.floor(Math.random() * 8000) + 1000 + 0.99; // Random price between 1000.99 and 9000.99
        const featured = Math.random() > 0.7; // 30% chance of being featured
        
        // Get 1-2 images for this product
        const productImages = [
          categoryImages[i * 2],
          categoryImages[i * 2 + 1]
        ].filter(Boolean); // Filter out undefined if there aren't enough images
        
        if (productImages.length === 0) continue;
        
        // Create product object
        const product = {
          sku,
          basePrice,
          featured,
          categoryId: `categoriesMap['${category}']`,
          images: productImages,
          translations: [
            { language: 'en', name: `Luxurious ${category.charAt(0).toUpperCase() + category.slice(1, -1)} ${i + 1}`, description: `Exclusive ${category} piece from our luxury collection.` },
            { language: 'fr', name: `${category.charAt(0).toUpperCase() + category.slice(1, -1)} Luxueux ${i + 1}`, description: `Pièce exclusive de notre collection de luxe.` },
            { language: 'ar', name: `${category} فاخرة ${i + 1}`, description: `قطعة حصرية من مجموعتنا الفاخرة.` },
          ],
          variations: []
        };
        
        // Add appropriate variations based on category
        if (category === 'rings') {
          product.variations = [
            { type: 'Size', value: '48', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Size', value: '52', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Size', value: '56', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
          ];
        } else if (category === 'bracelets' || category === 'necklaces') {
          product.variations = [
            { type: 'Length', value: '16cm', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Length', value: '18cm', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Length', value: '20cm', addPrice: 100, inventory: Math.floor(Math.random() * 10) + 3 },
          ];
        } else if (category === 'earrings') {
          product.variations = [
            { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: Math.floor(Math.random() * 10) + 3 },
          ];
        } else if (category === 'watches') {
          product.variations = [
            { type: 'Material', value: 'Steel', addPrice: 0, inventory: Math.floor(Math.random() * 5) + 3 },
            { type: 'Material', value: 'Gold', addPrice: 2000, inventory: Math.floor(Math.random() * 5) + 3 },
            { type: 'Material', value: 'Platinum', addPrice: 5000, inventory: Math.floor(Math.random() * 3) + 2 },
          ];
        }
        
        newProductsArray.push(product);
      }
    }
    
    // Convert products array to string representation for the seed file
    let newProductsStr = '';
    for (const product of newProductsArray) {
      newProductsStr += `
  {
    sku: '${product.sku}',
    basePrice: ${product.basePrice},
    featured: ${product.featured},
    categoryId: ${product.categoryId},
    images: [${product.images.map(img => `'${img}'`).join(', ')}],
    translations: [
      { language: 'en', name: '${product.translations[0].name}', description: '${product.translations[0].description}' },
      { language: 'fr', name: '${product.translations[1].name}', description: '${product.translations[1].description}' },
      { language: 'ar', name: '${product.translations[2].name}', description: '${product.translations[2].description}' },
    ],
    variations: [`;
      
      for (const variation of product.variations) {
        newProductsStr += `
      { type: '${variation.type}', value: '${variation.value}', addPrice: ${variation.addPrice}, inventory: ${variation.inventory} },`;
      }
      
      // Remove trailing comma if needed
      if (product.variations.length > 0) {
        newProductsStr = newProductsStr.slice(0, -1);
      }
      
      newProductsStr += `
    ]
  },`;
    }
    
    // Create backup of original seed file
    const backupFilePath = path.join(__dirname, 'seed.ts.backup');
    fs.writeFileSync(backupFilePath, seedFileContent);
    console.log(`Backup created at ${backupFilePath}`);
    
    // Add the new products to the file
    // Find the closing bracket of the products array
    seedFileContent = seedFileContent.replace(
      /const products = \[([\s\S]*?)\];/,
      `const products = [${productsContent}\n  // Additional products with all available images${newProductsStr}\n];`
    );
    
    // Write updated file
    fs.writeFileSync(seedFilePath, seedFileContent);
    console.log(`Seed file updated with ${newProductsArray.length} new products`);
    
  } catch (error) {
    console.error('Error updating seed file:', error);
  }
};

updateSeedFile(); 