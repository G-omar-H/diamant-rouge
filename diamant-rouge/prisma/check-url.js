// prisma/check-url.js
require('dotenv').config();

function checkDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    console.error('❌ DATABASE_URL is not defined in the environment');
    return;
  }
  
  console.log('Database URL is defined.');
  
  // Parse URL components without revealing the full password
  try {
    // Very simple parsing to avoid revealing credentials
    const masked = url.replace(/:\/\/(.*?)@/, '://*****@');
    console.log('Masked URL:', masked);
    
    // Check for common URL components
    const hasProtocol = url.startsWith('postgresql://');
    const hasHost = url.includes('@');
    const hasPort = url.includes(':5432');
    
    console.log('URL Format Check:');
    console.log('- Has correct protocol:', hasProtocol);
    console.log('- Has host component:', hasHost);
    console.log('- Has port component:', hasPort);
    
  } catch (error) {
    console.error('❌ Error parsing URL:', error.message);
  }
}

checkDatabaseUrl(); 