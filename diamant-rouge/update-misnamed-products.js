/**
 * This script updates products that were misnamed in the database
 * - Converts a mislabeled "necklace" to a ring (spiral diamond rose gold)
 * - Converts a mislabeled "necklace" to a bracelet (chain with square diamond)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Searching for misnamed products...');

  // Old image paths that were incorrect
  const oldPaths = [
    '/images/products/necklaces/necklaces_rose_gold_circular_diamond_pendant_NECKLACES-1064.png',
    '/images/products/necklaces/necklaces_rose_gold_octagon_diamond_pendant_NECKLACES-1041.png'
  ];

  // New corrected image paths
  const newPaths = [
    '/images/products/rings/rings_rose_gold_spiral_diamond_RINGS-1064.png', 
    '/images/products/bracelets/bracelets_rose_gold_chain_square_diamond_BRACELETS-1041.png'
  ];

  // Find the misnamed products
  const products = await prisma.product.findMany({
    where: {
      images: {
        hasSome: oldPaths
      }
    },
    include: {
      category: true,
      translations: true
    }
  });

  console.log(`Found ${products.length} misnamed products`);

  // If no products found with exact paths, try a partial match
  if (products.length === 0) {
    console.log('Trying partial image path match...');
    
    // First product (circular/spiral diamond ring)
    const spiralRingProducts = await prisma.product.findMany({
      where: {
        images: {
          some: {
            contains: 'circular_diamond_pendant'
          }
        }
      },
      include: {
        category: true,
        translations: true,
        variations: true
      }
    });

    // Second product (octagon/square diamond bracelet)
    const squareDiamondBraceletProducts = await prisma.product.findMany({
      where: {
        images: {
          some: {
            contains: 'octagon_diamond_pendant'
          }
        }
      },
      include: {
        category: true,
        translations: true,
        variations: true
      }
    });

    // Combine results
    const foundProducts = [...spiralRingProducts, ...squareDiamondBraceletProducts];
    console.log(`Found ${foundProducts.length} products with partial matches`);

    if (foundProducts.length > 0) {
      await updateProducts(foundProducts);
    }
  } else {
    await updateProducts(products);
  }
}

async function updateProducts(products) {
  // Get category IDs
  const [ringsCategory, braceletsCategory] = await Promise.all([
    prisma.category.findFirst({ where: { slug: 'rings' } }),
    prisma.category.findFirst({ where: { slug: 'bracelets' } })
  ]);

  if (!ringsCategory || !braceletsCategory) {
    console.error('❌ Required categories not found');
    console.log('Available categories:');
    const allCategories = await prisma.category.findMany();
    console.log(allCategories);
    return;
  }

  // Process each product
  for (const product of products) {
    // Determine if this is the spiral ring or the square diamond bracelet
    const isRing = product.images.some(img => 
      img.includes('circular_diamond_pendant') || img.includes('NECKLACES-1064')
    );

    // Prepare update data
    const updateData = {
      categoryId: isRing ? ringsCategory.id : braceletsCategory.id,
      images: isRing 
        ? ['/images/products/rings/rings_rose_gold_spiral_diamond_RINGS-1064.png'] 
        : ['/images/products/bracelets/bracelets_rose_gold_chain_square_diamond_BRACELETS-1041.png'],
      sku: isRing 
        ? (product.sku.includes('NECKLACES') ? product.sku.replace('NECKLACES', 'RINGS') : `RINGS-1064`) 
        : (product.sku.includes('NECKLACES') ? product.sku.replace('NECKLACES', 'BRACELETS') : `BRACELETS-1041`)
    };

    console.log(`Updating product ${product.id}:`, updateData);

    // Update the product
    await prisma.product.update({
      where: { id: product.id },
      data: updateData
    });

    // Update translations for the product
    for (const translation of product.translations) {
      const translationUpdateData = {
        name: isRing 
          ? (translation.language === 'fr' 
              ? 'Bague Spirale en Or Rose avec Diamants' 
              : 'Rose Gold Spiral Diamond Ring')
          : (translation.language === 'fr' 
              ? 'Bracelet Chaîne en Or Rose avec Diamant Carré' 
              : 'Rose Gold Chain Bracelet with Square Diamond'),
        description: isRing 
          ? (translation.language === 'fr' 
              ? 'Élégante bague en or rose au design moderne en spirale, ornée de deux rangées parallèles de diamants étincelants. Une pièce contemporaine qui allie modernité et raffinement.' 
              : 'Elegant rose gold ring with a modern spiral design, adorned with two parallel rows of sparkling diamonds. A contemporary piece that combines modernity and refinement.')
          : (translation.language === 'fr' 
              ? 'Bracelet chaîne délicat en or rose avec un pendentif diamant carré sertis de diamants baguette. Un accessoire sophistiqué qui ajoute une touche de luxe à chaque tenue.' 
              : 'Delicate rose gold chain bracelet with a square diamond pendant set with baguette diamonds. A sophisticated accessory that adds a touch of luxury to any outfit.')
      };

      console.log(`Updating translation ${translation.id}:`, translationUpdateData);

      await prisma.productTranslation.update({
        where: { id: translation.id },
        data: translationUpdateData
      });
    }

    // Update or create variations if needed
    if (isRing) {
      // Ring sizes
      const sizeVariations = ['50', '52', '54', '56', '58']; 
      
      // Check if the product already has variations
      if (product.variations && product.variations.length > 0) {
        // Update existing variations
        for (const variation of product.variations) {
          if (variation.variationType.toLowerCase().includes('size')) {
            console.log(`Updating variation ${variation.id} to ring size`);
            await prisma.productVariation.update({
              where: { id: variation.id },
              data: {
                variationType: 'ring_size',
                variationValue: sizeVariations[0] // Default to first size
              }
            });
          }
        }
      } else {
        // Create new variations for ring sizes
        console.log('Creating ring size variations');
        for (const size of sizeVariations) {
          await prisma.productVariation.create({
            data: {
              productId: product.id,
              variationType: 'ring_size',
              variationValue: size,
              additionalPrice: '0',
              inventory: 5
            }
          });
        }
      }
    } else {
      // Bracelet lengths
      const sizeVariations = ['16', '17', '18', '19', '20'];
      
      // Check if the product already has variations
      if (product.variations && product.variations.length > 0) {
        // Update existing variations
        for (const variation of product.variations) {
          if (variation.variationType.toLowerCase().includes('size') || 
              variation.variationType.toLowerCase().includes('length')) {
            console.log(`Updating variation ${variation.id} to bracelet length`);
            await prisma.productVariation.update({
              where: { id: variation.id },
              data: {
                variationType: 'bracelet_length',
                variationValue: sizeVariations[0] // Default to first size
              }
            });
          }
        }
      } else {
        // Create new variations for bracelet lengths
        console.log('Creating bracelet length variations');
        for (const size of sizeVariations) {
          await prisma.productVariation.create({
            data: {
              productId: product.id,
              variationType: 'bracelet_length',
              variationValue: size,
              additionalPrice: '0',
              inventory: 5
            }
          });
        }
      }
    }
  }

  console.log('✅ Product updates completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error updating products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 