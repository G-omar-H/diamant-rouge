const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Refined French luxury descriptions for jewelry types
const frenchDescriptions = {
  // Rings
  'rings': [
    "Cette bague exclusive allie l'éclat des diamants à l'élégance de l'or pour sublimer votre main d'une lumière captivante. Un chef-d'œuvre de joaillerie qui transcende le temps.",
    "Façonnée avec passion par nos maîtres artisans, cette bague incarne l'excellence et le raffinement d'un savoir-faire unique. Un bijou qui devient signature de votre élégance.",
    "Alliance parfaite entre modernité et tradition, cette bague accompagnera chaque instant de votre vie avec une présence lumineuse. Une pièce intemporelle pour les femmes d'exception.",
    "Ce joyau délicat révèle toute la splendeur de pierres précieuses magnifiquement serties. Une déclaration d'élégance à porter au quotidien ou lors des moments les plus précieux.",
  ],
  
  // Earrings
  'earrings': [
    "Ces boucles d'oreilles subliment votre visage d'une lumière délicate, captant chaque regard par leur mouvement gracieux et leur éclat incomparable.",
    "Véritables œuvres d'art à porter, ces boucles d'oreilles habillent votre visage d'une aura précieuse, révélant votre personnalité unique avec élégance.",
    "L'équilibre parfait entre brillance et délicatesse, ces créations exclusives encadrent votre visage d'une lueur mystérieuse qui ne vous quittera jamais.",
    "Ces boucles d'oreilles captivantes transforment votre allure en un instant, ajoutant cette touche d'audace et de mystère qui fait toute la différence.",
  ],
  
  // Necklaces
  'necklaces': [
    "Ce collier exceptionnel épouse délicatement la courbe de votre cou, laissant une traînée de lumière à chacun de vos mouvements. Un bijou qui sublime votre décolleté avec grâce.",
    "Véritable déclaration de style, ce pendentif attire tous les regards par sa présence affirmée et son design avant-gardiste. Une pièce signature pour les femmes qui osent.",
    "Ce collier précieux met en valeur la finesse de votre cou avec une élégance intemporelle, diffusant un éclat subtil qui révèle votre beauté naturelle.",
    "Art et raffinement se rencontrent dans cette création unique, où chaque détail est pensé pour sublimer votre silhouette d'une lumière radieuse qui vous accompagne jour et nuit.",
  ],
  
  // Bracelets
  'bracelets': [
    "Ce bracelet précieux enlace votre poignet d'une caresse lumineuse, créant un jeu d'ombres et de lumières qui capte l'attention à chaque mouvement de votre main.",
    "L'alliance parfaite entre technique joaillière d'exception et design contemporain, ce bracelet devient une seconde peau qui révèle votre personnalité avec élégance.",
    "Ce bijou d'exception transforme chaque geste en un moment de grâce, parant votre poignet d'une aura précieuse qui ne vous quittera plus.",
    "Création unique née du savoir-faire de nos artisans, ce bracelet s'adapte parfaitement à votre poignet pour vous accompagner dans tous les moments de votre vie.",
  ],
  
  // Watches
  'watches': [
    "Cette montre d'exception allie performance technique et esthétique raffinée. Un garde-temps qui transcende sa fonction pour devenir un véritable bijou à votre poignet.",
    "Chef-d'œuvre d'horlogerie contemporaine, cette montre conjugue précision suisse et design avant-gardiste. Le symbole d'une élégance assumée qui défie le temps.",
    "Cette pièce unique raconte l'histoire d'un savoir-faire ancestral réinventé pour notre époque. Un hommage au temps qui passe, à porter comme un talisman précieux.",
    "Alliance parfaite de tradition horlogère et d'innovation technique, cette montre deviendra votre compagne de chaque instant, sublimant votre style avec caractère.",
  ]
};

// Materials in French with more elegant descriptions
const frenchMaterials = {
  'platinum': 'platine pur aux reflets éternels',
  'white_gold': 'or blanc éclatant',
  'yellow_gold': 'or jaune chaleureux',
  'rose_gold': 'or rose délicat',
  'gold': 'or précieux'
};

// Predefined categorization mappings for product images
// We'll manually specify the correct category for each image pattern
const categoryMappings = [
  // Watches
  { pattern: /IMG_(0363|5585|6198|6226|7260|7200|8[0-9])/i, category: 'watches', material: 'rose_gold' },
  { pattern: /, - Copy \(2\)\.png$/i, category: 'watches', material: 'rose_gold' },
  { pattern: /79[0-9]/i, category: 'watches', material: 'white_gold' },
  { pattern: /85[0-9]/i, category: 'watches', material: 'yellow_gold' },
  
  // Necklaces - including the item from the image shown (rose gold pendant)
  { pattern: /IMG_(7618|7626|7628|7649)/i, category: 'necklaces', material: 'rose_gold' },
  { pattern: /75[0-9]/i, category: 'necklaces', material: 'white_gold' },
  { pattern: /76[0-9]/i, category: 'necklaces', material: 'yellow_gold' },
  { pattern: /pend/i, category: 'necklaces', material: 'gold' },
  { pattern: /chain/i, category: 'necklaces', material: 'white_gold' },
  
  // Earrings
  { pattern: /IMG_(7067|7167|7182)/i, category: 'earrings', material: 'white_gold' },
  { pattern: /73[0-9]/i, category: 'earrings', material: 'rose_gold' },
  { pattern: /74[0-9]/i, category: 'earrings', material: 'yellow_gold' },
  { pattern: /earr/i, category: 'earrings', material: 'platinum' },
  
  // Bracelets
  { pattern: /IMG_(7258)/i, category: 'bracelets', material: 'gold' },
  { pattern: /77[0-9]/i, category: 'bracelets', material: 'white_gold' },
  { pattern: /78[0-9]/i, category: 'bracelets', material: 'rose_gold' },
  { pattern: /brac/i, category: 'bracelets', material: 'yellow_gold' },
  { pattern: /bangle/i, category: 'bracelets', material: 'platinum' },
  
  // Rings
  { pattern: /72[0-9]/i, category: 'rings', material: 'platinum' },
  { pattern: /71[0-9]/i, category: 'rings', material: 'white_gold' },
  { pattern: /70[0-9]/i, category: 'rings', material: 'rose_gold' },
  { pattern: /ring/i, category: 'rings', material: 'yellow_gold' }
];

// Function to determine category and material from filename using our mappings
function categorizeImage(filename) {
  for (const mapping of categoryMappings) {
    if (mapping.pattern.test(filename)) {
      return {
        category: mapping.category,
        material: mapping.material
      };
    }
  }
  
  // Default fallback (shouldn't reach here with proper mappings)
  return {
    category: 'rings',
    material: 'gold'
  };
}

// Generate elegant French product name
function generateFrenchName(category, material) {
  const categoryNames = {
    'rings': ['Bague Signature', 'Alliance Précieuse', 'Solitaire Éternel', 'Anneau Mystique'],
    'earrings': ['Boucles Lumière', 'Pendants Célestes', 'Créoles Divines', 'Puces Étoilées'],
    'necklaces': ['Collier Envoûtant', 'Pendentif Secret', 'Sautoir Élégance', 'Ras-de-cou Précieux'],
    'bracelets': ['Bracelet Jonc', 'Manchette Royale', 'Chaîne Précieuse', 'Bracelet Éclatant'],
    'watches': ['Montre Divine', 'Chronographe Prestige', 'Garde-temps Excellence', 'Montre Signature']
  };
  
  const materialName = frenchMaterials[material] || 'précieux';
  const categoryName = categoryNames[category][Math.floor(Math.random() * categoryNames[category].length)];
  
  return `${categoryName} en ${materialName}`;
}

// Generate precise French descriptions based on category and material
function generateFrenchDescription(category, material) {
  const descriptions = frenchDescriptions[category] || frenchDescriptions['rings'];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Generate SKU based on category
function generateSKU(category, counter) {
  return `${category.toUpperCase()}-${1000 + counter}`;
}

// Main function to categorize products in bulk
async function bulkCategorizeProducts() {
  try {
    console.log('🔄 Starting bulk product categorization process...');
    
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
    
    console.log(`📷 Found ${imageFiles.length} product images for categorization`);
    
    // 3. Get all categories
    const categories = await prisma.category.findMany();
    const categoriesMap = {};
    
    // Create a map of category slugs to category ids
    for (const cat of categories) {
      categoriesMap[cat.slug] = cat.id;
    }
    
    // 4. Process each image using predefined categorization
    const counters = { rings: 0, earrings: 0, necklaces: 0, bracelets: 0, watches: 0 };
    
    for (const imageFile of imageFiles) {
      const imagePath = `/images/products/${imageFile}`;
      
      // Get category and material based on our predefined mappings
      const { category, material } = categorizeImage(imageFile);
      
      counters[category]++;
      
      // Generate French product name and description
      const frenchName = generateFrenchName(category, material);
      const frenchDescription = generateFrenchDescription(category, material);
      
      // Generate English and Arabic content based on French
      const englishName = frenchName + " (EN)";
      const englishDescription = frenchDescription;
      const arabicName = frenchName + " (AR)";
      const arabicDescription = "النسخة العربية: " + frenchDescription;
      
      // Generate a unique SKU
      const sku = generateSKU(category, counters[category]);
      
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
      
      try {
        // Create the product with French as primary language
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
                { language: 'ar', name: arabicName, description: arabicDescription }
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
        
        console.log(`✅ Created ${category} product: ${frenchName} (SKU: ${sku})`);
        
      } catch (error) {
        console.error(`Error creating product for ${imageFile}:`, error);
      }
    }
    
    console.log('\n📊 Product categorization summary:');
    Object.keys(counters).forEach(category => {
      console.log(`- ${category}: ${counters[category]} products`);
    });
    
    console.log('🎉 Bulk product categorization completed successfully!');
    
  } catch (error) {
    console.error('❌ Process failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
bulkCategorizeProducts(); 