// Simple seed script for local development
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding local development database with minimal data...');
  
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@diamantrouge.com' },
      update: {},
      create: {
        email: 'admin@diamantrouge.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
      }
    });
    
    console.log('✅ Created admin user:', adminUser.email);
    
    // Create a test category
    const category = await prisma.category.upsert({
      where: { slug: 'rings' },
      update: {},
      create: {
        slug: 'rings',
        translations: {
          create: [
            { 
              language: 'en', 
              name: 'Rings', 
              description: 'Elegant rings collection' 
            },
            { 
              language: 'fr', 
              name: 'Bagues', 
              description: 'Collection de bagues élégantes' 
            }
          ]
        }
      }
    });
    
    console.log('✅ Created category:', category.slug);
    
    // Create a test product
    const product = await prisma.product.upsert({
      where: { sku: 'TEST-RING-001' },
      update: {},
      create: {
        sku: 'TEST-RING-001',
        basePrice: 999.99,
        featured: true,
        images: ['/images/placeholder-ring.jpg'],
        categoryId: category.id,
        translations: {
          create: [
            {
              language: 'en',
              name: 'Diamond Test Ring',
              description: 'A beautiful diamond ring for testing.'
            },
            {
              language: 'fr',
              name: 'Bague de Test Diamant',
              description: 'Une belle bague en diamant pour les tests.'
            }
          ]
        },
        variations: {
          create: [
            {
              variationType: 'size',
              variationValue: '52',
              additionalPrice: 0,
              inventory: 10
            },
            {
              variationType: 'size',
              variationValue: '54',
              additionalPrice: 0,
              inventory: 8
            }
          ]
        }
      }
    });
    
    console.log('✅ Created test product:', product.sku);
    
    console.log('✅ Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 