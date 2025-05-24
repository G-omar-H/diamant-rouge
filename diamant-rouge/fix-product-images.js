const fs = require('fs');
const path = require('path');

// Function to analyze image filenames and determine their likely category
function analyzeImageCategory(filename) {
  // Convert filename to lowercase for easier matching
  const lowerFilename = filename.toLowerCase();
  
  // Check for specific patterns that might indicate jewelry type
  if (lowerFilename.includes('ring') || (lowerFilename.includes('72') && !lowerFilename.includes('73'))) {
    return 'rings';
  } else if (lowerFilename.includes('earring') || lowerFilename.includes('73')) {
    return 'earrings';
  } else if (lowerFilename.includes('necklace') || lowerFilename.includes('chain') || lowerFilename.includes('75') || lowerFilename.includes('76')) {
    return 'necklaces';
  } else if (lowerFilename.includes('bracelet') || lowerFilename.includes('bangle') || lowerFilename.includes('77') || lowerFilename.includes('78')) {
    return 'bracelets';
  } else if (lowerFilename.includes('watch') || lowerFilename.includes('time') || lowerFilename.includes('79') || lowerFilename.includes('80') || lowerFilename.includes('81') || lowerFilename.includes('85')) {
    return 'watches';
  }
  
  // Default case: analyze image number for categorization
  const imageNumber = parseInt(filename.match(/\d+/) || ['0'], 10);
  
  // Distribute by product numbers
  if (imageNumber >= 7000 && imageNumber < 7300) {
    return 'rings';
  } else if (imageNumber >= 7300 && imageNumber < 7500) {
    return 'earrings';
  } else if (imageNumber >= 7500 && imageNumber < 7700) {
    return 'necklaces';
  } else if (imageNumber >= 7700 && imageNumber < 7900) {
    return 'bracelets';
  } else if (imageNumber >= 7900 || imageNumber < 6000) {
    return 'watches';
  }
  
  // Fallback distribution
  const lastDigit = imageNumber % 5;
  const categories = ['rings', 'earrings', 'necklaces', 'bracelets', 'watches'];
  return categories[lastDigit];
}

// Function to fix the products seed file
async function fixProductsSeedFile() {
  const imagesDir = path.join(__dirname, 'public/images/products');
  const seedFilePath = path.join(__dirname, 'prisma/products-seed.ts');
  
  try {
    // Read all image files in the products directory
    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => {
        try {
          const stats = fs.statSync(path.join(imagesDir, file));
          return !stats.isDirectory() && /\.(png|jpg|jpeg)$/i.test(file);
        } catch (err) {
          return false;
        }
      });
    
    console.log(`Found ${imageFiles.length} image files.`);
    
    // Read the current seed file
    let seedFileContent = fs.readFileSync(seedFilePath, 'utf8');
    
    // Fix malformed image paths and categorization
    imageFiles.forEach((imageFile, index) => {
      const escapedFilename = imageFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const correctPath = `/images/products/${imageFile}`;
      const escapedCorrectPath = correctPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Find incorrect paths with similar filename and replace them
      const incorrectPathRegex = new RegExp(`'/images/products/[^']*${escapedFilename.replace(/\\'/g, "'")}[^']*'`);
      const replaceWith = `'${correctPath}'`;
      
      if (seedFileContent.match(incorrectPathRegex)) {
        seedFileContent = seedFileContent.replace(incorrectPathRegex, replaceWith);
        console.log(`Fixed path for: ${imageFile}`);
      }
      
      // Check for any missing images in the seed file
      if (!seedFileContent.includes(correctPath) && !seedFileContent.includes(correctPath.replace(/'/g, "\\'"))) {
        // This image is not used in any product, add it
        console.log(`Image ${imageFile} not found in seed file. Adding new product entry.`);
        
        // Analyze the image to determine category
        const category = analyzeImageCategory(imageFile);
        
        // Generate a new SKU
        const sku = `${category.toUpperCase()}-${2000 + index}`;
        
        // Generate product name and description based on category
        let productName = '';
        let description = '';
        
        switch (category) {
          case 'rings':
            productName = `Elegant ${['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold'][index % 4]} ${['Diamond Ring', 'Engagement Ring', 'Wedding Band', 'Eternity Ring'][index % 4]}`;
            description = `This exquisite ring is meticulously crafted to showcase the radiant beauty of its design. Perfect for special occasions or everyday elegance.`;
            break;
          case 'earrings':
            productName = `Exquisite ${['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold'][index % 4]} ${['Diamond Earrings', 'Stud Earrings', 'Hoop Earrings', 'Drop Earrings'][index % 4]}`;
            description = `These stunning earrings are carefully handcrafted to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear.`;
            break;
          case 'necklaces':
            productName = `Stunning ${['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold'][index % 4]} ${['Diamond Necklace', 'Pearl Necklace', 'Pendant Necklace', 'Statement Necklace'][index % 4]}`;
            description = `This luxurious necklace is artfully created to add a touch of sophisticated elegance to any outfit. A statement piece that draws admiring glances.`;
            break;
          case 'bracelets':
            productName = `Luxurious ${['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold'][index % 4]} ${['Tennis Bracelet', 'Charm Bracelet', 'Bangle', 'Diamond Bracelet'][index % 4]}`;
            description = `This elegant bracelet is meticulously crafted to adorn your wrist with timeless sophistication. A versatile piece that complements any attire.`;
            break;
          case 'watches':
            productName = `Precision ${['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold'][index % 4]} ${['Automatic Watch', 'Chronograph Watch', 'Luxury Timepiece', 'Diamond Watch'][index % 4]}`;
            description = `This magnificent timepiece is expertly designed to combine elegant style with precision engineering. A mark of distinction for the discerning wearer.`;
            break;
        }
        
        // Generate pricing and variations
        const basePrice = Math.floor(Math.random() * 8000) + 1000 + 0.99;
        const featured = Math.random() > 0.7;
        
        // Generate variations based on category
        let variations = '';
        
        switch (category) {
          case 'rings':
            variations = `
        { type: 'Size', value: '48', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },
        { type: 'Size', value: '50', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },
        { type: 'Size', value: '52', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },
        { type: 'Size', value: '54', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },
        { type: 'Size', value: '56', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },`;
            break;
          case 'earrings':
            variations = `
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: ${Math.floor(Math.random() * 10) + 3} },`;
            break;
          case 'necklaces':
          case 'bracelets':
            variations = `
        { type: 'Length', value: '16cm', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: ${Math.floor(Math.random() * 10) + 3} },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: ${Math.floor(Math.random() * 10) + 3} },`;
            break;
          case 'watches':
            variations = `
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: ${Math.floor(Math.random() * 5) + 3} },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: ${Math.floor(Math.random() * 5) + 3} },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: ${Math.floor(Math.random() * 5) + 3} },`;
            break;
        }
        
        // Create new product entry
        const newProductEntry = `
    {
      sku: '${sku}',
      basePrice: ${basePrice},
      featured: ${featured},
      categoryId: categoriesMap['${category}'],
      images: ['${correctPath}'],
      translations: [
        { language: 'en', name: '${productName}', description: '${description}' },
        { language: 'fr', name: '${productName} (FR)', description: '${description} (Traduction française)' },
        { language: 'ar', name: '${productName} (AR)', description: '${description} (الترجمة العربية)' },
      ],
      variations: [${variations}
      ]
    },`;
        
        // Find where to insert the new product
        const insertPosition = seedFileContent.indexOf('const products = [') + 'const products = ['.length;
        seedFileContent = seedFileContent.slice(0, insertPosition) + newProductEntry + seedFileContent.slice(insertPosition);
      }
    });
    
    // Also fix any remaining malformed paths (like the ', - Copy (2).png' case)
    const malformedPathRegex = /images: \[['"]\/images\/products\/[^'"]*['"],?\]/g;
    let match;
    
    while ((match = malformedPathRegex.exec(seedFileContent)) !== null) {
      const imagePath = match[0];
      // Extract the filename from the path
      const filenameMatch = imagePath.match(/\/images\/products\/([^'"]*)/);
      
      if (filenameMatch && filenameMatch[1]) {
        const filename = filenameMatch[1];
        
        // Check if this filename exists in our image files list
        const validFile = imageFiles.find(file => file === filename);
        
        if (!validFile) {
          // This is a malformed path, replace with the first image from the correct category
          console.log(`Found malformed path: ${filename}`);
          
          // Extract the product data to determine its category
          const productStartIndex = seedFileContent.lastIndexOf('{', match.index);
          const productSubstring = seedFileContent.substring(productStartIndex, match.index + imagePath.length);
          
          const categoryMatch = productSubstring.match(/categoryId: categoriesMap\['([^']+)'\]/);
          const category = categoryMatch ? categoryMatch[1] : 'rings';
          
          // Find a valid image in the same category
          const replacementImage = imageFiles.find(file => {
            const fileCategory = analyzeImageCategory(file);
            return fileCategory === category;
          }) || imageFiles[0];
          
          const correctPath = `/images/products/${replacementImage}`;
          const newImagePath = `images: ['${correctPath}']`;
          
          // Replace the malformed path with the correct one
          seedFileContent = seedFileContent.replace(imagePath, newImagePath);
          console.log(`Replaced with: ${replacementImage}`);
        }
      }
    }
    
    // Save the fixed seed file
    fs.writeFileSync(seedFilePath, seedFileContent);
    console.log('Successfully fixed product seed file.');
    
    // Also create a backup of the original seed file
    fs.writeFileSync(`${seedFilePath}.backup`, fs.readFileSync(seedFilePath));
    console.log('Created backup of the original seed file.');
    
  } catch (error) {
    console.error('Error fixing seed file:', error);
  }
}

// Run the fix function
fixProductsSeedFile(); 