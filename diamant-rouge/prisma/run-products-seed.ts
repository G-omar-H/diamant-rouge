// prisma/run-products-seed.ts
import { PrismaClient } from '@prisma/client';
import seedProducts from './products-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting product database seeding process...');
  
  try {
    await seedProducts();
    console.log('🎉 Product seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
