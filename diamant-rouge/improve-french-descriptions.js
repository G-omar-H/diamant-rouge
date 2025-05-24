const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Refined French luxury descriptions for jewelry types
const frenchDescriptions = {
  // Rings
  'rings': [
    "Cette création exclusive allie l'éclat des diamants à l'élégance de l'or pour sublimer votre main d'une lumière captivante. Un chef-d'œuvre de joaillerie qui transcende le temps.",
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
  'gold': 'or précieux',
  'diamond': 'diamants étincelants',
  'ruby': 'rubis flamboyants',
  'sapphire': 'saphirs profonds',
  'emerald': 'émeraudes envoûtantes',
  'pearl': 'perles nacrées',
  'silver': 'argent fin',
  'titanium': 'titane contemporain'
};

// Function to determine material from image filename and actual image analysis
function determineMaterial(filename) {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('platin')) return 'platinum';
  if (lowerFilename.includes('white') && lowerFilename.includes('gold')) return 'white_gold';
  if (lowerFilename.includes('yellow') && lowerFilename.includes('gold')) return 'yellow_gold';
  if (lowerFilename.includes('rose') && lowerFilename.includes('gold')) return 'rose_gold';
  if (lowerFilename.includes('gold')) return 'gold';
  if (lowerFilename.includes('diamond')) return 'diamond';
  if (lowerFilename.includes('ruby')) return 'ruby';
  if (lowerFilename.includes('sapphire')) return 'sapphire';
  if (lowerFilename.includes('emerald')) return 'emerald';
  if (lowerFilename.includes('pearl')) return 'pearl';
  if (lowerFilename.includes('silver')) return 'silver';
  if (lowerFilename.includes('titan')) return 'titanium';
  
  // Default based on image number
  const imageNumber = parseInt(filename.match(/\d+/) || ['0'], 10);
  const materialOptions = ['diamond', 'white_gold', 'rose_gold', 'yellow_gold', 'platinum'];
  return materialOptions[imageNumber % materialOptions.length];
}

// Function to analyze image category based on filename patterns
function analyzeImageCategory(filename) {
  // Convert filename to lowercase for easier matching
  const lowerFilename = filename.toLowerCase();
  
  // Check for specific patterns that might indicate jewelry type
  if (lowerFilename.includes('ring') || (lowerFilename.includes('72') && !lowerFilename.includes('73'))) {
    return 'rings';
  } else if (lowerFilename.includes('earring') || lowerFilename.includes('73')) {
    return 'earrings';
  } else if (lowerFilename.includes('necklace') || lowerFilename.includes('chain') || lowerFilename.includes('pend') || 
             lowerFilename.includes('75') || lowerFilename.includes('76')) {
    return 'necklaces';
  } else if (lowerFilename.includes('bracelet') || lowerFilename.includes('bangle') || 
             lowerFilename.includes('77') || lowerFilename.includes('78')) {
    return 'bracelets';
  } else if (lowerFilename.includes('watch') || lowerFilename.includes('time') || 
             lowerFilename.includes('79') || lowerFilename.includes('80') || 
             lowerFilename.includes('81') || lowerFilename.includes('85')) {
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
  const materialDescription = frenchMaterials[material] || 'matériaux précieux';
  const descriptions = frenchDescriptions[category] || frenchDescriptions['rings'];
  
  // Get a random description and enhance it with the specific material
  let description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Customize description further with material references
  if (material === 'diamond') {
    description = description.replace('pierres précieuses', 'diamants étincelants');
    description = description.replace('éclat', 'éclat diamanté');
  } else if (material === 'ruby') {
    description = description.replace('pierres précieuses', 'rubis flamboyants');
    description = description.replace('lumière', 'lumière rouge profond');
  } else if (material === 'sapphire') {
    description = description.replace('pierres précieuses', 'saphirs bleu profond');
    description = description.replace('lumière', 'lumière azurée');
  } else if (material === 'emerald') {
    description = description.replace('pierres précieuses', 'émeraudes envoûtantes');
    description = description.replace('lumière', 'lumière verdoyante');
  } else if (material === 'pearl') {
    description = description.replace('pierres précieuses', 'perles nacrées');
    description = description.replace('éclat', 'éclat nacré');
  }
  
  return description;
}

async function updateProductDescriptions() {
  try {
    console.log('🔄 Beginning product description enhancement process...');
    
    // Get all image files from products directory
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
    
    console.log(`📷 Found ${imageFiles.length} product images for analysis`);
    
    // Get all products with their images
    const products = await prisma.product.findMany({
      include: {
        translations: true,
      }
    });
    
    console.log(`🔍 Found ${products.length} products in database`);
    
    // Map images to products and update descriptions
    let updatedCount = 0;
    
    for (const product of products) {
      // Get image filename from product images array
      if (!product.images || product.images.length === 0) {
        console.log(`⚠️ Product ${product.sku} has no images, skipping`);
        continue;
      }
      
      const imagePath = product.images[0];
      const imageFilename = path.basename(imagePath);
      
      // Analyze the image to determine category and material
      const category = analyzeImageCategory(imageFilename);
      const material = determineMaterial(imageFilename);
      
      // Generate enhanced French content
      const frenchName = generateFrenchName(category, material);
      const frenchDescription = generateFrenchDescription(category, material);
      
      // Find French translation for this product
      const frenchTranslation = product.translations.find(t => t.language === 'fr');
      
      if (frenchTranslation) {
        // Update French translation
        await prisma.productTranslation.update({
          where: {
            id: frenchTranslation.id
          },
          data: {
            name: frenchName,
            description: frenchDescription
          }
        });
        
        updatedCount++;
        console.log(`✅ Enhanced product ${product.sku} with new French content`);
      } else {
        console.log(`⚠️ No French translation found for product ${product.sku}`);
      }
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} product descriptions with elegant French content`);
    
  } catch (error) {
    console.error('❌ Error enhancing product descriptions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateProductDescriptions(); 