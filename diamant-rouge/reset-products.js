const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// French translation dictionary for jewelry terms
const frenchTerms = {
  // Jewelry types
  'Ring': 'Bague',
  'Engagement Ring': 'Bague de Fiançailles',
  'Wedding Band': 'Alliance',
  'Eternity Ring': 'Bague Éternité',
  'Gold Band': 'Anneau en Or',
  'Gemstone Ring': 'Bague avec Pierre Précieuse',
  'Diamond Ring': 'Bague Diamant',
  'Solitaire Ring': 'Solitaire',
  
  'Earrings': 'Boucles d\'Oreilles',
  'Diamond Earrings': 'Boucles d\'Oreilles Diamant',
  'Drop Earrings': 'Pendants d\'Oreilles',
  'Stud Earrings': 'Puces d\'Oreilles',
  'Hoop Earrings': 'Créoles',
  'Chandelier Earrings': 'Lustres d\'Oreilles',
  'Pearl Earrings': 'Boucles d\'Oreilles en Perle',
  
  'Necklace': 'Collier',
  'Diamond Necklace': 'Collier Diamant',
  'Pearl Necklace': 'Collier de Perles',
  'Pendant Necklace': 'Collier avec Pendentif',
  'Gold Chain': 'Chaîne en Or',
  'Choker Necklace': 'Ras de Cou',
  'Statement Necklace': 'Collier Statement',
  
  'Bracelet': 'Bracelet',
  'Tennis Bracelet': 'Bracelet Tennis',
  'Charm Bracelet': 'Bracelet à Breloques',
  'Bangle': 'Bracelet Rigide',
  'Gold Bracelet': 'Bracelet en Or',
  'Diamond Bracelet': 'Bracelet Diamant',
  'Link Bracelet': 'Bracelet à Maillons',
  
  'Watch': 'Montre',
  'Automatic Watch': 'Montre Automatique',
  'Chronograph Watch': 'Chronographe',
  'Luxury Timepiece': 'Montre de Luxe',
  'Dress Watch': 'Montre Habillée',
  'Swiss Watch': 'Montre Suisse',
  'Diamond Watch': 'Montre Diamant',
  
  // Materials
  'Platinum': 'Platine',
  'White Gold': 'Or Blanc',
  'Yellow Gold': 'Or Jaune',
  'Rose Gold': 'Or Rose',
  'Silver': 'Argent',
  'Titanium': 'Titane',
  'Gold': 'Or',
  'Diamond': 'Diamant',
  'Ruby': 'Rubis',
  'Sapphire': 'Saphir',
  'Emerald': 'Émeraude',
  'Pearl': 'Perle',
  'Amethyst': 'Améthyste',
  'Aquamarine': 'Aigue-Marine',
  'Steel': 'Acier',
  
  // Adjectives
  'Elegant': 'Élégant',
  'Exquisite': 'Exquis',
  'Stunning': 'Éblouissant',
  'Luxurious': 'Luxueux',
  'Precision': 'Précision',
  'Sophisticated': 'Sophistiqué',
  'Magnificent': 'Magnifique',
  'Radiant': 'Radieux',
  'Timeless': 'Intemporel',
  
  // Variations
  'Size': 'Taille',
  'Metal': 'Métal',
  'Length': 'Longueur',
  'Material': 'Matériau'
};

// Function to translate English text to French using the dictionary
function translateToFrench(englishText) {
  let frenchText = englishText;
  
  // Replace each English term with its French equivalent
  Object.entries(frenchTerms).forEach(([english, french]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    frenchText = frenchText.replace(regex, french);
  });
  
  return frenchText;
}

// Generate French description
function generateFrenchDescription(category, materials) {
  const descriptions = {
    'rings': [
      `Cette ${materials.toLowerCase()} magnifique est fabriquée à la main pour mettre en valeur sa beauté rayonnante. Parfaite pour les occasions spéciales ou l'élégance quotidienne.`,
      `Une création unique en ${materials.toLowerCase()}, alliant élégance et artisanat exceptionnel. Idéale pour sublimer chaque moment.`,
      `Ce bijou en ${materials.toLowerCase()} reflète la maîtrise de nos artisans joailliers. Une pièce intemporelle pour toutes les occasions.`
    ],
    'earrings': [
      `Ces boucles d'oreilles en ${materials.toLowerCase()} sont méticuleusement conçues pour encadrer votre visage avec éclat. Polyvalentes pour les événements formels et le quotidien.`,
      `Une création raffinée en ${materials.toLowerCase()}, ces boucles d'oreilles ajoutent une touche d'élégance à chaque tenue. Un choix parfait pour toutes les occasions.`,
      `L'alliance parfaite entre design contemporain et savoir-faire traditionnel, ces boucles d'oreilles en ${materials.toLowerCase()} captivent par leur éclat et leur élégance.`
    ],
    'necklaces': [
      `Ce collier en ${materials.toLowerCase()} est créé artistiquement pour ajouter une touche de sophistication à n'importe quelle tenue. Une pièce qui attire tous les regards.`,
      `Un chef-d'œuvre de joaillerie en ${materials.toLowerCase()}, ce collier allie délicatesse et présence. La signature parfaite pour votre style personnel.`,
      `La finesse du ${materials.toLowerCase()} se révèle dans ce collier d'exception, fruit d'un savoir-faire unique. Un bijou qui sublimera chacune de vos tenues.`
    ],
    'bracelets': [
      `Ce bracelet en ${materials.toLowerCase()} est méticuleusement façonné pour orner votre poignet avec élégance. Une pièce polyvalente qui complète n'importe quelle tenue.`,
      `Un bracelet en ${materials.toLowerCase()} qui allie l'excellence artisanale à un design contemporain. L'accessoire parfait pour affirmer votre style au quotidien.`,
      `Ce bracelet en ${materials.toLowerCase()} incarne l'élégance parisienne et le raffinement. Une création qui habillera votre poignet avec distinction.`
    ],
    'watches': [
      `Cette montre en ${materials.toLowerCase()} est conçue avec précision pour allier style élégant et ingénierie de pointe. Une marque de distinction pour son porteur exigeant.`,
      `Un garde-temps d'exception en ${materials.toLowerCase()}, alliant performance technique et esthétique raffinée. Le symbole d'une élégance intemporelle.`,
      `Cette montre en ${materials.toLowerCase()} est le fruit d'une tradition horlogère d'exception. Précision et élégance se marient pour créer une pièce unique.`
    ]
  };
  
  // Return a random description from the appropriate category
  const categoryDescriptions = descriptions[category] || descriptions['rings'];
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
}

// Generate Arabic description based on French description
function generateArabicDescription(frenchDescription) {
  // For simplicity, we'll just indicate it's an Arabic translation
  // In a production environment, proper translations would be used
  return "النسخة العربية: " + frenchDescription;
}

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

// Main function to reset and recreate products
async function resetAndCreateProducts() {
  try {
    console.log('🔄 Starting product database reset process...');
    
    // 1. Delete all existing products and related data
    console.log('🗑️ Deleting all existing products and related data...');
    
    // First delete OrderItems referencing products
    await prisma.orderItem.deleteMany();
    console.log('✅ Deleted all order items');
    
    // Then delete product variations and translations
    await prisma.productVariation.deleteMany();
    await prisma.productTranslation.deleteMany();
    
    // Finally delete the products
    const deletedProducts = await prisma.product.deleteMany();
    console.log(`✅ Deleted ${deletedProducts.count} products`);
    
    // 2. Get all image files from products directory
    const imagesDir = path.join(__dirname, 'public/images/products');
    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => {
        try {
          const stats = fs.statSync(path.join(imagesDir, file));
          return !stats.isDirectory() && /\.(png|jpg|jpeg)$/i.test(file);
        } catch (err) {
          return false;
        }
      });
    
    console.log(`📷 Found ${imageFiles.length} product images`);
    
    // 3. Get all categories
    const categories = await prisma.category.findMany();
    const categoriesMap = {};
    
    // Create a map of category slugs to category ids
    for (const cat of categories) {
      categoriesMap[cat.slug] = cat.id;
    }
    
    // 4. Create one product for each image
    console.log('🔹 Creating products from images...');
    const createdProducts = {};
    let skuCounter = 1001;
    
    for (const [index, imageFile] of imageFiles.entries()) {
      // Analyze image to determine category
      const category = analyzeImageCategory(imageFile);
      const imagePath = `/images/products/${imageFile}`;
      
      // Generate French product name based on category
      let materialIndex = index % 4;
      let typeIndex = index % 4;
      
      const materials = [
        ['Platine', 'Platinum'], 
        ['Or Blanc', 'White Gold'], 
        ['Or Jaune', 'Yellow Gold'], 
        ['Or Rose', 'Rose Gold']
      ][materialIndex];
      
      let types;
      let adjectives;
      switch (category) {
        case 'rings':
          types = [
            ['Bague Diamant', 'Diamond Ring'], 
            ['Bague de Fiançailles', 'Engagement Ring'], 
            ['Alliance', 'Wedding Band'], 
            ['Bague Éternité', 'Eternity Ring']
          ][typeIndex];
          adjectives = [['Élégant', 'Elegant']];
          break;
        case 'earrings':
          types = [
            ['Boucles d\'Oreilles Diamant', 'Diamond Earrings'], 
            ['Puces d\'Oreilles', 'Stud Earrings'], 
            ['Créoles', 'Hoop Earrings'], 
            ['Pendants d\'Oreilles', 'Drop Earrings']
          ][typeIndex];
          adjectives = [['Exquis', 'Exquisite']];
          break;
        case 'necklaces':
          types = [
            ['Collier Diamant', 'Diamond Necklace'], 
            ['Collier de Perles', 'Pearl Necklace'], 
            ['Collier avec Pendentif', 'Pendant Necklace'], 
            ['Collier Statement', 'Statement Necklace']
          ][typeIndex];
          adjectives = [['Éblouissant', 'Stunning']];
          break;
        case 'bracelets':
          types = [
            ['Bracelet Tennis', 'Tennis Bracelet'], 
            ['Bracelet à Breloques', 'Charm Bracelet'], 
            ['Bracelet Rigide', 'Bangle'], 
            ['Bracelet Diamant', 'Diamond Bracelet']
          ][typeIndex];
          adjectives = [['Luxueux', 'Luxurious']];
          break;
        case 'watches':
          types = [
            ['Montre Automatique', 'Automatic Watch'], 
            ['Chronographe', 'Chronograph Watch'], 
            ['Montre de Luxe', 'Luxury Timepiece'], 
            ['Montre Diamant', 'Diamond Watch']
          ][typeIndex];
          adjectives = [['Précision', 'Precision']];
          break;
      }
      
      // Generate names in French and English
      const frenchName = `${adjectives[0][0]} ${materials[0]} ${types[0]}`;
      const englishName = `${adjectives[0][1]} ${materials[1]} ${types[1]}`;
      
      // Generate descriptions
      const frenchDescription = generateFrenchDescription(category, materials[0]);
      const englishDescription = translateToFrench(frenchDescription); // For demo purposes, we're just using the French as base
      const arabicDescription = generateArabicDescription(frenchDescription);
      
      // Generate a unique SKU
      const sku = `${category.toUpperCase()}-${skuCounter++}`;
      
      // Generate pricing and featured status
      const basePrice = Math.floor(Math.random() * 8000) + 1000 + 0.99;
      const featured = Math.random() > 0.7;
      
      // Generate variations based on category
      let variations = [];
      switch (category) {
        case 'rings':
          variations = [
            { type: 'Taille', value: '48', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Taille', value: '50', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Taille', value: '52', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Taille', value: '54', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Taille', value: '56', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 }
          ];
          break;
        case 'earrings':
          variations = [
            { type: 'Métal', value: 'Or Blanc', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Métal', value: 'Or Jaune', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Métal', value: 'Or Rose', addPrice: 100, inventory: Math.floor(Math.random() * 10) + 3 }
          ];
          break;
        case 'necklaces':
        case 'bracelets':
          variations = [
            { type: 'Longueur', value: '16cm', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Longueur', value: '18cm', addPrice: 0, inventory: Math.floor(Math.random() * 10) + 3 },
            { type: 'Longueur', value: '20cm', addPrice: 100, inventory: Math.floor(Math.random() * 10) + 3 }
          ];
          break;
        case 'watches':
          variations = [
            { type: 'Matériau', value: 'Acier', addPrice: 0, inventory: Math.floor(Math.random() * 5) + 3 },
            { type: 'Matériau', value: 'Or', addPrice: 2000, inventory: Math.floor(Math.random() * 5) + 3 },
            { type: 'Matériau', value: 'Titane', addPrice: 1000, inventory: Math.floor(Math.random() * 5) + 3 }
          ];
          break;
      }
      
      // Create the product with French as primary language
      try {
        const createdProduct = await prisma.product.create({
          data: {
            sku,
            basePrice,
            featured,
            images: [imagePath],
            categoryId: categoriesMap[category],
            translations: {
              create: [
                { language: 'fr', name: frenchName, description: frenchDescription },
                { language: 'en', name: englishName, description: englishDescription },
                { language: 'ar', name: frenchName + ' (AR)', description: arabicDescription }
              ]
            }
          }
        });
        
        // Create variations for this product
        for (const variation of variations) {
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
        
        createdProducts[sku] = createdProduct;
        
      } catch (error) {
        console.error(`Error creating product ${sku}:`, error);
      }
    }
    
    console.log(`✅ Created ${Object.keys(createdProducts).length} products with variations`);
    console.log('🎉 Product database reset and creation completed successfully!');
    
  } catch (error) {
    console.error('❌ Process failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
resetAndCreateProducts(); 