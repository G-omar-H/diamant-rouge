const fs = require('fs');
const path = require('path');

// Function to generate a descriptive product name from an image filename
function generateProductName(filename) {
  // Clean up the filename by removing extensions and special characters
  let baseName = path.basename(filename, path.extname(filename))
    .replace(/IMG_/g, '')
    .replace(/Copy of /g, '')
    .replace(/ - Copy/g, '')
    .replace(/ \([0-9]+\)/g, '')
    .replace(/,/g, '')
    .replace(/\./g, ' ');

  // Check for common jewelry types in the filename or generate based on file pattern
  const imageNumber = parseInt(baseName.match(/\d+/) || ['0'], 10);
  
  // Distribute by product numbers
  let category = 'rings';
  let prefix = '';
  
  if (imageNumber >= 7000 && imageNumber < 7300) {
    category = 'rings';
    prefix = 'Elegant';
  } else if (imageNumber >= 7300 && imageNumber < 7500) {
    category = 'earrings';
    prefix = 'Exquisite';
  } else if (imageNumber >= 7500 && imageNumber < 7700) {
    category = 'necklaces';
    prefix = 'Stunning';
  } else if (imageNumber >= 7700 && imageNumber < 7900) {
    category = 'bracelets';
    prefix = 'Luxurious';
  } else if (imageNumber >= 7900 || imageNumber < 6000) {
    category = 'watches';
    prefix = 'Precision';
  } else {
    // Distribute remaining images
    const categories = ['rings', 'earrings', 'necklaces', 'bracelets', 'watches'];
    category = categories[imageNumber % 5];
    prefix = ['Elegant', 'Exquisite', 'Stunning', 'Luxurious', 'Precision'][imageNumber % 5];
  }
  
  // Generate a jewel type and material based on the category
  const jewelTypes = {
    rings: ['Diamond Ring', 'Engagement Ring', 'Gold Band', 'Solitaire Ring', 'Gemstone Ring', 'Wedding Band', 'Eternity Ring'],
    earrings: ['Diamond Earrings', 'Drop Earrings', 'Stud Earrings', 'Hoop Earrings', 'Chandelier Earrings', 'Pearl Earrings'],
    necklaces: ['Diamond Necklace', 'Pearl Necklace', 'Pendant Necklace', 'Gold Chain', 'Choker Necklace', 'Statement Necklace'],
    bracelets: ['Tennis Bracelet', 'Charm Bracelet', 'Bangle', 'Gold Bracelet', 'Diamond Bracelet', 'Link Bracelet'],
    watches: ['Automatic Watch', 'Chronograph Watch', 'Luxury Timepiece', 'Dress Watch', 'Swiss Watch', 'Diamond Watch']
  };
  
  const materials = ['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold', 'Silver', 'Titanium'];
  const gemstones = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Amethyst', 'Aquamarine'];
  
  // Select random elements for product name
  const jewelType = jewelTypes[category][imageNumber % jewelTypes[category].length];
  const material = materials[imageNumber % materials.length];
  const gemstone = gemstones[imageNumber % gemstones.length];
  
  // Create descriptive product name
  const productName = `${prefix} ${material} ${jewelType}`;
  
  return {
    name: productName,
    category: category,
    gemstone: gemstone
  };
}

// Function to generate product description based on name and category
function generateProductDescription(productInfo) {
  const adjectives = ['exquisite', 'elegant', 'stunning', 'luxurious', 'timeless', 'sophisticated', 'magnificent', 'radiant'];
  const craftings = ['meticulously crafted', 'expertly designed', 'carefully handcrafted', 'precision engineered', 'artfully created'];
  
  const adj1 = adjectives[Math.floor(Math.random() * adjectives.length)];
  const adj2 = adjectives[Math.floor(Math.random() * adjectives.length)];
  const crafting = craftings[Math.floor(Math.random() * craftings.length)];
  
  const categoryDescriptions = {
    rings: `This ${adj1} ring is ${crafting} to showcase the ${adj2} beauty of its design. Perfect for special occasions or everyday elegance.`,
    earrings: `These ${adj1} earrings are ${crafting} to frame your face with ${adj2} brilliance. Versatile enough for both formal events and daily wear.`,
    necklaces: `This ${adj1} necklace is ${crafting} to add a touch of ${adj2} sophistication to any outfit. A statement piece that draws admiring glances.`,
    bracelets: `This ${adj1} bracelet is ${crafting} to adorn your wrist with ${adj2} elegance. A versatile piece that complements any attire.`,
    watches: `This ${adj1} timepiece is ${crafting} to combine ${adj2} style with precision engineering. A mark of distinction for the discerning wearer.`
  };
  
  return categoryDescriptions[productInfo.category];
}

// Function to generate product variations based on category
function generateVariations(category) {
  let variations = [];
  
  switch (category) {
    case 'rings':
      variations = [
        { type: 'Size', value: '48', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
        { type: 'Size', value: '50', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
        { type: 'Size', value: '52', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
        { type: 'Size', value: '54', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
        { type: 'Size', value: '56', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 }
      ];
      break;
    case 'earrings':
      variations = [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: Math.floor(Math.random() * 10) + 3 }
      ];
      break;
    case 'necklaces':
    case 'bracelets':
      variations = [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: Math.floor(Math.random() * 10) + 3 }
      ];
      break;
    case 'watches':
      variations = [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: Math.floor(Math.random() * 5) + 3 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: Math.floor(Math.random() * 5) + 3 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: Math.floor(Math.random() * 5) + 3 }
      ];
      break;
  }
  
  return variations;
}

// Main function to generate the seed file
async function generateSeedFile() {
  const imagesDir = path.join(__dirname, 'public/images/products');
  const outputFile = path.join(__dirname, 'prisma/products-seed.ts');
  
  try {
    // Get all image files
    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => {
        // Filter out directories and only include image files
        try {
          const stats = fs.statSync(path.join(imagesDir, file));
          return !stats.isDirectory() && /\.(png|jpg|jpeg)$/i.test(file);
        } catch (err) {
          return false;
        }
      })
      .map(file => `/images/products/${file}`);
    
    console.log(`Found ${imageFiles.length} image files.`);
    
    // Generate product data for each image
    const products = [];
    let skuCounter = 1001;
    
    for (const imageFile of imageFiles) {
      // Skip Collection directory
      if (imageFile.includes('/Collections/')) continue;
      
      const productInfo = generateProductName(imageFile);
      const category = productInfo.category;
      const sku = `${category.toUpperCase()}-${skuCounter++}`;
      const basePrice = Math.floor(Math.random() * 8000) + 1000 + 0.99; // Random price between 1000.99 and 9000.99
      const featured = Math.random() > 0.7; // 30% chance of being featured
      
      const productDescription = generateProductDescription(productInfo);
      const variations = generateVariations(category);
      
      products.push({
        sku,
        basePrice,
        featured,
        category,
        image: imageFile,
        name: productInfo.name,
        description: productDescription,
        variations
      });
    }
    
    // Generate TypeScript code for the seed file
    let seedFileContent = `
// prisma/products-seed.ts
// Generated file - do not edit manually
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('🔹 Creating products from individual images...');
  
  // Get all categories
  const categories = await prisma.category.findMany();
  const categoriesMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {});
  
  // Products data array
  const products = [
`;
    
    // Add each product to the seed file
    for (const product of products) {
      seedFileContent += `
    {
      sku: '${product.sku}',
      basePrice: ${product.basePrice},
      featured: ${product.featured},
      categoryId: categoriesMap['${product.category}'],
      images: ['${product.image}'],
      translations: [
        { language: 'en', name: '${product.name}', description: '${product.description}' },
        { language: 'fr', name: '${product.name} (FR)', description: '${product.description} (Traduction française)' },
        { language: 'ar', name: '${product.name} (AR)', description: '${product.description} (الترجمة العربية)' },
      ],
      variations: [`;
      
      for (const variation of product.variations) {
        seedFileContent += `
        { type: '${variation.type}', value: '${variation.value}', addPrice: ${variation.addPrice}, inventory: ${variation.inventory} },`;
      }
      
      seedFileContent += `
      ]
    },`;
    }
    
    // Close the products array and add the main function
    seedFileContent += `
  ];

  // Create products and their variations
  const createdProducts = {};
  
  for (const product of products) {
    try {
      const createdProduct = await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: {
          sku: product.sku,
          basePrice: product.basePrice,
          featured: product.featured,
          images: product.images,
          categoryId: product.categoryId,
          translations: {
            create: product.translations
          }
        }
      });
      
      // Create variations for this product
      for (const variation of product.variations) {
        await prisma.productVariation.create({
          data: {
            productId: createdProduct.id,
            variationType: variation.type,
            variationValue: variation.value,
            additionalPrice: variation.addPrice,
            inventory: variation.inventory
          }
        });
      }
      
      createdProducts[product.sku] = createdProduct;
    } catch (error) {
      console.error(\`Error creating product \${product.sku}:\`, error);
    }
  }
  
  console.log(\`✅ Created \${Object.keys(createdProducts).length} products with variations\`);
  return createdProducts;
}

// Export the function
export default seedProducts;
`;
    
    // Write the seed file
    fs.writeFileSync(outputFile, seedFileContent);
    console.log(`Successfully generated product seed file at ${outputFile}`);
    
    // Also create a runner script
    const runnerScript = `
// prisma/run-products-seed.ts
import { PrismaClient } from '@prisma/client';
import seedProducts from './products-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting product database seeding process...');
  
  try {
    await seedProducts();
    console.log('🎉 Product seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
`;
    
    fs.writeFileSync(path.join(__dirname, 'prisma/run-products-seed.ts'), runnerScript);
    console.log(`Successfully generated runner script.`);
    
  } catch (error) {
    console.error('Error generating seed file:', error);
  }
}

// Run the generator
generateSeedFile(); 