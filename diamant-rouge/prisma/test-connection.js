// prisma/test-connection.js
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing database connection...');
  
  const prisma = new PrismaClient();
  
  try {
    // Try a simple database query
    console.log('Connecting to database...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    console.log('✅ Connection successful!', result);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('Database connection test completed successfully.');
    } else {
      console.log('Database connection test failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error during connection test:', error);
    process.exit(1);
  }); 