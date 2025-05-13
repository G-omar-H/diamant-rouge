const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Usage: node update-order-status.js <orderId> <status>
// E.g. node update-order-status.js 3 CONFIRMED

async function updateOrderStatus() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length !== 2) {
      console.error('Usage: node update-order-status.js <orderId> <status>');
      process.exit(1);
    }
    
    const orderId = parseInt(args[0], 10);
    const newStatus = args[1].toUpperCase();
    
    // Validate
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
      console.error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      process.exit(1);
    }
    
    // Fetch current order
    const originalOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        userId: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });
    
    if (!originalOrder) {
      console.error(`❌ Order #${orderId} not found`);
      process.exit(1);
    }
    
    console.log(`🔍 Found Order #${orderId} with status: "${originalOrder.status}"`);
    console.log(`👤 User: ${originalOrder.user?.email || 'Guest'}`);
    
    // Update the order
    console.log(`🔄 Updating order status to: "${newStatus}"`);
    
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      select: {
        id: true,
        status: true,
        updatedAt: true
      }
    });
    
    console.log(`✅ Order updated successfully:`);
    console.log(`  - Previous status: "${originalOrder.status}"`);
    console.log(`  - New status: "${updatedOrder.status}"`);
    console.log(`  - Updated at: ${updatedOrder.updatedAt.toISOString()}`);
    
  } catch (error) {
    console.error('❌ Error updating order status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateOrderStatus(); 