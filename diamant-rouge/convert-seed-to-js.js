const fs = require('fs');
const path = require('path');

// Path to the TypeScript seed file and output JavaScript file
const tsFilePath = path.join(__dirname, 'prisma/products-seed.ts');
const jsFilePath = path.join(__dirname, 'prisma/products-seed.js');

// Convert TypeScript to JavaScript
function convertTsToJs() {
  try {
    // Read the TypeScript file
    let tsContent = fs.readFileSync(tsFilePath, 'utf8');
    
    // Convert TypeScript syntax to JavaScript
    let jsContent = tsContent
      // Replace import statement with require
      .replace('import { PrismaClient } from \'@prisma/client\';', 'const { PrismaClient } = require(\'@prisma/client\');')
      // Remove type annotations
      .replace(/: Record<string, number>/g, '')
      .replace(/: Record<string, any>/g, '')
      // Replace export default with module.exports
      .replace('export default seedProducts;', `// For direct execution
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('🎉 Product seeding completed successfully!');
      prisma.$disconnect();
    })
    .catch((error) => {
      console.error('❌ Seeding error:', error);
      prisma.$disconnect();
      process.exit(1);
    });
} else {
  // Export the function when imported
  module.exports = seedProducts;
}`);
    
    // Write the JavaScript file
    fs.writeFileSync(jsFilePath, jsContent);
    
    console.log(`Successfully converted ${tsFilePath} to ${jsFilePath}`);
  } catch (error) {
    console.error('Error converting file:', error);
  }
}

// Run the converter
convertTsToJs(); 