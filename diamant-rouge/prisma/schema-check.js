// prisma/schema-check.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkSchema() {
  console.log('🔍 Checking database schema and data...');
  
  try {
    // Check categories
    console.log('\n📋 Checking categories...');
    const categories = await prisma.category.findMany({
      include: {
        translations: true
      }
    });
    console.log(`Found ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log('Sample category:');
      console.log(JSON.stringify(categories[0], null, 2));
    }
    
    // Check products
    console.log('\n📋 Checking products...');
    const products = await prisma.product.findMany({
      take: 1,
      include: {
        translations: true,
        variations: true,
        category: {
          include: {
            translations: true
          }
        }
      }
    });
    
    console.log(`Found ${await prisma.product.count()} products total`);
    
    if (products.length > 0) {
      console.log('Sample product structure:');
      console.log(JSON.stringify(products[0], null, 2));
    }
    
    // Check for null values in critical fields
    console.log('\n📋 Checking for problematic fields...');
    const productsWithNullCategory = await prisma.product.count({
      where: {
        categoryId: null
      }
    });
    console.log(`Products with null categoryId: ${productsWithNullCategory}`);
    
    console.log('\n✅ Schema check completed successfully');
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema(); 