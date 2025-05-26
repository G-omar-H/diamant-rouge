// prisma/seed-debug.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding process with debug...');
  
  try {
    console.log('🔹 Resetting database...');
    await resetDatabase();
    
    console.log('🔹 Seeding basic data...');
    await seedBasicData();
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

async function resetDatabase() {
  try {
    // Delete all records from each table in reverse order of dependencies
    console.log('Deleting notifications...');
    await prisma.notification.deleteMany();
    
    console.log('Deleting newsletter subscribers...');
    await prisma.newsletterSubscriber.deleteMany();
    
    console.log('Deleting appointments...');
    await prisma.appointment.deleteMany();
    
    console.log('Deleting order items...');
    await prisma.orderItem.deleteMany();
    
    console.log('Deleting orders...');
    await prisma.order.deleteMany();
    
    console.log('Deleting cart items...');
    await prisma.cartItem.deleteMany();
    
    console.log('Deleting wishlists...');
    await prisma.wishlist.deleteMany();
    
    console.log('Deleting product variations...');
    await prisma.productVariation.deleteMany();
    
    console.log('Deleting product translations...');
    await prisma.productTranslation.deleteMany();
    
    console.log('Deleting products...');
    await prisma.product.deleteMany();
    
    console.log('Deleting category translations...');
    await prisma.categoryTranslation.deleteMany();
    
    console.log('Deleting categories...');
    await prisma.category.deleteMany();
    
    console.log('Deleting users...');
    await prisma.user.deleteMany();
    
    console.log('✅ Database reset complete');
  } catch (error) {
    console.error('❌ Error during reset:', error);
    throw error;
  }
}

async function seedBasicData() {
  try {
    // Create test category
    console.log('Creating test category...');
    const category = await prisma.category.create({
      data: {
        slug: 'rings',
        translations: {
          create: [
            { language: 'en', name: 'Luxury Rings', description: 'Exquisite rings crafted with precision.' }
          ]
        }
      }
    });
    
    // Create test product
    console.log('Creating test product...');
    const product = await prisma.product.create({
      data: {
        sku: 'TEST-RING-001',
        basePrice: 4999.99,
        featured: true,
        categoryId: category.id,
        images: ['/images/products/rings/rings_white_gold_classic_solitaire_RINGS-1054.png'],
        translations: {
          create: [
            { language: 'en', name: 'Test Diamond Ring', description: 'A beautiful test ring.' }
          ]
        },
        variations: {
          create: [
            { variationType: 'Size', variationValue: '50', additionalPrice: 0, inventory: 5 }
          ]
        }
      }
    });
    
    // Create test user
    console.log('Creating test user...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'customer'
      }
    });
    
    console.log('✅ Basic data seeded successfully');
  } catch (error) {
    console.error('❌ Error during basic data seeding:', error);
    throw error;
  }
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client
    await prisma.$disconnect();
  }); 