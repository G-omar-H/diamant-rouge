const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugOrderStatus() {
  try {
    console.log('🔍 Debugging Order Status Issue');
    
    // Get all orders from the database
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        userId: true,
        createdAt: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
    
    console.log('\n📊 All Orders:');
    for (const order of orders) {
      console.log(`Order #${order.id} | Status: "${order.status}" (${typeof order.status}) | Upper: "${order.status.toUpperCase()}" | User: ${order.user?.email || 'Guest'} | Created: ${order.createdAt.toISOString()}`);
    }
    
    console.log('\n🧪 Status Comparison Tests:');
    for (const order of orders) {
      // Test different case comparisons
      const upperMatch = order.status.toUpperCase() === 'PENDING';
      const lowerMatch = order.status.toLowerCase() === 'pending';
      const directMatch = order.status === 'PENDING';
      const mixedMatch = order.status === 'Pending';
      
      console.log(`Order #${order.id} | Status: "${order.status}"`);
      console.log(`  - Uppercase comparison ('PENDING'): ${upperMatch}`);
      console.log(`  - Lowercase comparison ('pending'): ${lowerMatch}`);
      console.log(`  - Direct comparison ('PENDING'): ${directMatch}`);
      console.log(`  - Mixed case comparison ('Pending'): ${mixedMatch}`);
      console.log(`  - String matches using toUpperCase():`)
      
      // Check how the status matches with all possible status values
      const possibleStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
      for (const status of possibleStatuses) {
        const matches = order.status.toUpperCase() === status;
        console.log(`    - "${status}": ${matches}`);
      }
      console.log('------------------------');
    }
    
    console.log('\n✅ Debug completed');
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugOrderStatus(); 