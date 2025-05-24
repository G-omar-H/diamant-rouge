// Fixed version of the appointment seeding function
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAppointments() {
  console.log('🔹 Creating appointments...');
  
  const appointments = [];
  
  // Create 5 future appointments
  for (let i = 0; i < 5; i++) {
    // Random date in the next 30 days
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    // Random time between 10am and 6pm
    const hour = Math.floor(Math.random() * 9) + 10;
    const minute = [0, 30][Math.floor(Math.random() * 2)]; // Only on the hour or half hour
    const appointmentTime = `${hour}:${minute === 0 ? '00' : '30'}`;
    
    // Add all required fields based on the schema
    await prisma.appointment.create({
      data: {
        clientEmail: `client${i+1}@example.com`,
        clientPhone: `+33${Math.floor(Math.random() * 10000000) + 600000000}`,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        duration: ["30", "60", "90"][Math.floor(Math.random() * 3)],
        status: ["PENDING", "CONFIRMED", "COMPLETED"][Math.floor(Math.random() * 3)],
        location: ["Paris Store", "Lyon Boutique", "Cannes Shop"][Math.floor(Math.random() * 3)],
        locationType: ["IN_STORE", "VIRTUAL"][Math.floor(Math.random() * 2)],
        appointmentType: ["CONSULTATION", "SHOPPING", "REPAIR"][Math.floor(Math.random() * 3)],
        appointmentTypeLabel: ["Consultation", "Shopping Session", "Repair Service"][Math.floor(Math.random() * 3)],
        guestCount: Math.floor(Math.random() * 3) + 1,
        preferences: "No specific preferences",
        specialRequests: "No special requests"
      }
    });
    
    appointments.push({ appointmentDate, appointmentTime });
  }
  
  console.log(`✅ Created ${appointments.length} appointments`);
}

// Run just the appointments seeding
async function main() {
  try {
    await seedAppointments();
    console.log('✅ Appointment seeding completed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 