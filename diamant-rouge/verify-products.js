const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyProducts() {
  try {
    // Count all products
    const productCount = await prisma.product.count();
    console.log(`Total products in database: ${productCount}`);
    
    // Count products with images
    const productsWithImages = await prisma.product.count({
      where: {
        images: {
          isEmpty: false
        }
      }
    });
    console.log(`Products with at least one image: ${productsWithImages}`);
    
    // Count products without images
    const productsWithoutImages = await prisma.product.count({
      where: {
        images: {
          isEmpty: true
        }
      }
    });
    console.log(`Products without images: ${productsWithoutImages}`);
    
    // Check language distribution in translations
    const frenchTranslations = await prisma.productTranslation.count({
      where: {
        language: 'fr'
      }
    });
    console.log(`French translations: ${frenchTranslations}`);
    
    const englishTranslations = await prisma.productTranslation.count({
      where: {
        language: 'en'
      }
    });
    console.log(`English translations: ${englishTranslations}`);
    
    const arabicTranslations = await prisma.productTranslation.count({
      where: {
        language: 'ar'
      }
    });
    console.log(`Arabic translations: ${arabicTranslations}`);
    
    // Sample a few products to verify French content
    const sampleProducts = await prisma.product.findMany({
      take: 3,
      include: {
        translations: true,
        variations: true,
        category: true
      }
    });
    
    console.log('\n--- Sample Product Information ---');
    
    for (const product of sampleProducts) {
      console.log(`\nSKU: ${product.sku}`);
      console.log(`Category: ${product.category.name}`);
      console.log(`Images: ${product.images.join(', ')}`);
      
      // Log translations
      console.log('Translations:');
      for (const translation of product.translations) {
        console.log(`  ${translation.language}: ${translation.name}`);
        console.log(`  ${translation.language} description: ${translation.description.substring(0, 50)}...`);
      }
      
      // Log variations
      console.log('Variations:');
      for (const variation of product.variations) {
        console.log(`  ${variation.variationType}: ${variation.variationValue} (Stock: ${variation.inventory})`);
      }
    }
    
  } catch (error) {
    console.error('Error verifying products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyProducts(); 