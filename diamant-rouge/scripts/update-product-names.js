const { PrismaClient } = require('@prisma/client');
const { generateFantasyName, generateRichDescription } = require('../prisma/product-names');

const prisma = new PrismaClient();

async function updateProductNames() {
  console.log('🔄 Starting product name update process...');

  try {
    // Get all categories to match products with their category names
    const categories = await prisma.category.findMany();
    
    // Get all products with their translations
    const products = await prisma.product.findMany({
      include: {
        translations: true,
        category: true
      }
    });

    console.log(`Found ${products.length} products to update`);
    
    let updatedCount = 0;

    for (const product of products) {
      // Determine product category
      const categorySlug = product.category?.slug || '';
      let categoryName = 'rings'; // default
      
      // Map category slug to our simple category names
      if (categorySlug.includes('bague') || categorySlug.includes('ring')) {
        categoryName = 'rings';
      } else if (categorySlug.includes('bracelet')) {
        categoryName = 'bracelets';
      } else if (categorySlug.includes('collier') || categorySlug.includes('necklace')) {
        categoryName = 'necklaces';
      } else if (categorySlug.includes('boucle') || categorySlug.includes('earring')) {
        categoryName = 'earrings';
      }
      
      // Generate a new fantasy name for this product
      const fantasyName = generateFantasyName(categoryName);
      
      // Extract material and features for rich description
      let metal = "or", design = "élégant", features = "diamants";
      
      // Try to extract information from existing product name/description
      for (const translation of product.translations) {
        const name = translation.name?.toLowerCase() || '';
        
        // Detect metal type
        if (name.includes('or blanc') || name.includes('white gold')) {
          metal = 'or blanc';
        } else if (name.includes('or rose') || name.includes('rose gold')) {
          metal = 'or rose';
        } else if (name.includes('or jaune') || name.includes('yellow gold')) {
          metal = 'or jaune';
        } else if (name.includes('platine') || name.includes('platinum')) {
          metal = 'platine';
        }
        
        // Detect design elements
        if (name.includes('eternity') || name.includes('éternité')) {
          design = 'éternité';
          features = 'diamants formant un cercle continu';
        } else if (name.includes('solitaire')) {
          design = 'solitaire';
          features = 'diamant central majestueux';
        } else if (name.includes('halo')) {
          design = 'halo';
          features = 'diamant central entouré de diamants plus petits';
        }
      }
      
      // Update each translation with the new fantasy name and rich description
      const updatedTranslations = [];
      
      for (const translation of product.translations) {
        // Get a rich description in the appropriate language
        const richDescription = generateRichDescription(
          translation.language,
          categoryName,
          metal,
          design,
          features
        );
        
        // Update this translation
        const updatedTranslation = await prisma.productTranslation.update({
          where: {
            id: translation.id
          },
          data: {
            name: fantasyName,
            description: richDescription
          }
        });
        
        updatedTranslations.push(updatedTranslation);
      }
      
      updatedCount++;
      console.log(`✓ Updated product ID ${product.id} to "${fantasyName}"`);
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} products with fantasy names!`);
    
  } catch (error) {
    console.error('Error updating product names:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the update function
updateProductNames()
  .catch(e => {
    console.error('Script execution failed:', e);
    process.exit(1);
  }); 