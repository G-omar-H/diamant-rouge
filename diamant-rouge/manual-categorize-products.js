const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to get correct category from user
function askCategory(imageFilename) {
  return new Promise((resolve) => {
    console.log(`\n🖼️  Image: ${imageFilename}`);
    console.log(`
Select the correct category for this image:
1. Bague (Ring)
2. Boucles d'Oreilles (Earrings)
3. Collier (Necklace)
4. Bracelet
5. Montre (Watch)
`);
    
    rl.question('Enter the number (1-5): ', (answer) => {
      const categories = ['rings', 'earrings', 'necklaces', 'bracelets', 'watches'];
      const categoryIndex = parseInt(answer) - 1;
      
      if (categoryIndex >= 0 && categoryIndex < categories.length) {
        resolve(categories[categoryIndex]);
      } else {
        console.log('❌ Invalid selection. Please try again.');
        resolve(askCategory(imageFilename)); // Ask again
      }
    });
  });
}

// Materials in French with more elegant descriptions
const frenchMaterials = {
  'platinum': 'platine pur aux reflets éternels',
  'white_gold': 'or blanc éclatant',
  'yellow_gold': 'or jaune chaleureux',
  'rose_gold': 'or rose délicat',
  'gold': 'or précieux'
};

// Function to get correct material from user
function askMaterial(imageFilename) {
  return new Promise((resolve) => {
    console.log(`\n🖼️  Image: ${imageFilename}`);
    console.log(`
Select the material for this jewelry:
1. Platine (Platinum)
2. Or Blanc (White Gold)
3. Or Jaune (Yellow Gold)
4. Or Rose (Rose Gold)
5. Or (Gold)
`);
    
    rl.question('Enter the number (1-5): ', (answer) => {
      const materials = ['platinum', 'white_gold', 'yellow_gold', 'rose_gold', 'gold'];
      const materialIndex = parseInt(answer) - 1;
      
      if (materialIndex >= 0 && materialIndex < materials.length) {
        resolve(materials[materialIndex]);
      } else {
        console.log('❌ Invalid selection. Please try again.');
        resolve(askMaterial(imageFilename)); // Ask again
      }
    });
  });
}

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

// Main function to manually categorize and update products
async function manualCategorizeProducts() {
  try {
    console.log('🔄 Starting manual product categorization process...');
    
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
    
    console.log(`📷 Found ${imageFiles.length} product images for manual categorization`);
    
    // 3. Get all categories
    const categories = await prisma.category.findMany();
    const categoriesMap = {};
    
    // Create a map of category slugs to category ids
    for (const cat of categories) {
      categoriesMap[cat.slug] = cat.id;
    }
    
    // 4. Process each image and get user input for categorization
    const counters = { rings: 0, earrings: 0, necklaces: 0, bracelets: 0, watches: 0 };
    
    for (const imageFile of imageFiles) {
      const imagePath = `/images/products/${imageFile}`;
      console.log(`\n=======================================`);
      console.log(`Processing image: ${imageFile}`);
      
      // Show image file and ask for user input
      const category = await askCategory(imageFile);
      const material = await askMaterial(imageFile);
      
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
    
    console.log('\n=======================================');
    console.log('🎉 Manual product categorization completed successfully!');
    console.log('Summary of created products:');
    Object.keys(counters).forEach(category => {
      console.log(`- ${category}: ${counters[category]} products`);
    });
    
  } catch (error) {
    console.error('❌ Process failed:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Run the function
manualCategorizeProducts(); 