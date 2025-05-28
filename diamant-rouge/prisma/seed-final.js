// prisma/seed-final.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { generateFantasyName, generateRichDescription } = require('./product-names');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding process...');
  
  try {
    console.log('🔹 Resetting database...');
    await resetDatabase();
    
    const categories = await seedCategories();
    await seedProducts(categories);
    await seedUsers();
    await seedOrders();
    await seedAppointments();
    await seedNewsletterSubscribers();
    await seedNotifications();
    
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

// ✨ CATEGORIES
async function seedCategories() {
  console.log('🔹 Creating jewelry categories...');
  
  const categories = [
    {
      slug: 'rings',
      translations: [
        { language: 'en', name: 'Luxury Rings', description: 'Exquisite rings crafted with precision, symbolizing love and heritage.' },
        { language: 'fr', name: 'Bagues de Luxe', description: 'Bagues exquises conçues avec précision, symbolisant l\'amour et l\'héritage.' },
        { language: 'ar', name: 'خواتم فاخرة', description: 'خواتم رائعة مصممة بدقة ترمز إلى الحب والتراث.' },
      ]
    },
    {
      slug: 'bracelets',
      translations: [
        { language: 'en', name: 'Elegant Bracelets', description: 'Timeless bracelets adorned with the finest diamonds and gold.' },
        { language: 'fr', name: 'Bracelets Élégants', description: 'Bracelets intemporels ornés des plus beaux diamants et de l\'or.' },
        { language: 'ar', name: 'أساور أنيقة', description: 'أساور خالدة مزينة بأجود الألماس والذهب.' },
      ]
    },
    {
      slug: 'necklaces',
      translations: [
        { language: 'en', name: 'Exquisite Necklaces', description: 'Beautifully crafted necklaces that capture elegance and timeless beauty.' },
        { language: 'fr', name: 'Colliers Exquis', description: 'Colliers magnifiquement conçus qui capturent l\'élégance et la beauté intemporelle.' },
        { language: 'ar', name: 'قلادات راقية', description: 'قلادات مصنوعة بإتقان تجسد الأناقة والجمال الخالد.' },
      ]
    },
    {
      slug: 'earrings',
      translations: [
        { language: 'en', name: 'Stunning Earrings', description: 'Sophisticated earrings that frame the face with radiant elegance.' },
        { language: 'fr', name: 'Boucles d\'Oreilles Éblouissantes', description: 'Boucles d\'oreilles sophistiquées qui encadrent le visage d\'une élégance radieuse.' },
        { language: 'ar', name: 'أقراط مذهلة', description: 'أقراط راقية تُحيط الوجه بأناقة مشعة.' },
      ]
    }
  ];
  
  const categoryMap = {};
  
  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        slug: category.slug,
        translations: {
          create: category.translations
        }
      }
    });
    
    categoryMap[category.slug] = created.id;
  }
  
  console.log(`✅ Created ${categories.length} categories`);
  return categoryMap;
}

// ✨ PRODUCTS
async function seedProducts(categoryMap) {
  console.log('🔹 Creating luxury jewelry products...');
  
  const productImages = getProductImagesFromFolders();
  let productsCreated = 0;
  const usedNames = new Set(); // Track used names to ensure uniqueness
  
  // Calculate featured product limits per category (15% of products per category)
  const featuredLimits = {
    rings: 3,
    necklaces: 2,
    bracelets: 2,
    earrings: 2
  };
  
  const featuredCount = {
    rings: 0,
    necklaces: 0,
    bracelets: 0,
    earrings: 0
  };
  
  // Helper function to determine if a product should be featured
  const shouldFeatureProduct = (category, features) => {
    if (featuredCount[category] >= featuredLimits[category]) {
      return false;
    }
    
    // Feature products with premium materials or designs
    const isPremiumProduct = category === 'bracelets' ? 
      // Special criteria for bracelets
      (features.includes('diamond') || 
       features.includes('sapphire') || 
       features.includes('emerald') || 
       features.includes('ruby') ||
       features.includes('chain') ||
       features.includes('baguette') ||
       features.includes('tennis') ||
       features.includes('medallion')) :
      // Criteria for other categories
      ((features.includes('diamond') && (features.includes('halo') || features.includes('cluster'))) ||
       features.includes('sapphire') ||
       features.includes('emerald') ||
       features.includes('ruby') ||
       features.includes('platinum') ||
       features.includes('three stone') ||
       (features.includes('solitaire') && features.includes('diamond')));
    
    if (isPremiumProduct) {
      featuredCount[category]++;
      return true;
    }
    
    return false;
  };
  
  // Generate unique product name
  const generateUniqueProductName = (category, metal, design, features, attempt = 0, language = 'en') => {
    let name;
    switch (language) {
      case 'fr':
        name = generateProductNameFrench(category, metal, design, features);
        break;
      case 'ar':
        name = generateProductNameArabic(category, metal, design, features);
        break;
      default:
        name = generateProductName(category, metal, design, features);
    }
    
    if (attempt > 0) {
      name = `${name} ${attempt}`;
    }
    
    const nameKey = `${name}_${language}`; // Track uniqueness per language
    if (!usedNames.has(nameKey)) {
      usedNames.add(nameKey);
      return name;
    }
    
    return generateUniqueProductName(category, metal, design, features, attempt + 1, language);
  };
  
  for (const [category, images] of Object.entries(productImages)) {
    const categoryId = categoryMap[category];
    
    if (!categoryId) {
      console.warn(`⚠️ Category not found for: ${category}`);
      continue;
    }
    
    for (const image of images) {
      try {
        // Extract product details from filename
        const { metal, design, features, sku } = parseImageFilename(image.filename, category);
        
        // Generate base price based on category and features
        const basePrice = generatePriceForProduct(category, features);
        
        // Generate unique names for each language
        const englishName = generateUniqueProductName(category, metal, design, features, 0, 'en');
        const frenchName = generateUniqueProductName(category, metal, design, features, 0, 'fr');
        const arabicName = generateUniqueProductName(category, metal, design, features, 0, 'ar');
        
        // Create product with all required fields from schema
        const product = await prisma.product.create({
          data: {
            sku,
            basePrice,
            categoryId,
            featured: shouldFeatureProduct(category, features),
            images: [`/images/products/${category}/${image.filename}`],
            createdAt: new Date(),
            updatedAt: new Date(),
            
            // Create translations with proper schema fields
            translations: {
              create: [
                { 
                  language: 'en', 
                  name: englishName,
                  description: generateProductDescription(category, metal, design, features)
                },
                { 
                  language: 'fr', 
                  name: frenchName,
                  description: generateProductDescriptionFrench(category, metal, design, features)
                },
                { 
                  language: 'ar', 
                  name: arabicName,
                  description: generateProductDescriptionArabic(category, metal, design, features)
                }
              ]
            },
            
            // Create variations with proper schema fields
            variations: {
              create: generateVariationsForCategory(category, metal)
            }
          },
          include: {
            translations: true,
            variations: true,
            category: true
          }
        });
        
        productsCreated++;
        console.log(`✓ Created product: ${product.sku} in category: ${category}${product.featured ? ' (Featured)' : ''}`);
      } catch (error) {
        console.error(`⚠️ Error creating product from ${image.filename}:`, error);
      }
    }
  }
  
  // Log featured products distribution
  console.log('\nFeatured products distribution:');
  Object.entries(featuredCount).forEach(([category, count]) => {
    console.log(`${category}: ${count} featured products`);
  });
  
  console.log(`\n✅ Created ${productsCreated} products total`);
}

// Helper function to get all product images from the organized folders
function getProductImagesFromFolders() {
  const productImages = {
    rings: [],
    bracelets: [],
    necklaces: [],
    earrings: []
  };
  const productsFolderPath = path.join(process.cwd(), 'public', 'images', 'products');
  
  try {
    // Read all category folders
    const categoryFolders = fs.readdirSync(productsFolderPath).filter(folder => 
      fs.statSync(path.join(productsFolderPath, folder)).isDirectory()
    );
    
    for (const folder of categoryFolders) {
      const folderPath = path.join(productsFolderPath, folder);
      const files = fs.readdirSync(folderPath)
          .filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
          .map(filename => ({ 
            filename,
          path: path.join(folderPath, filename)
        }));
        
      // Parse each filename to determine its true category
      files.forEach(file => {
        const actualCategory = getActualCategoryFromFilename(file.filename);
        if (actualCategory && productImages[actualCategory]) {
          productImages[actualCategory].push({
            filename: file.filename,
            path: file.path,
            originalFolder: folder
          });
        }
      });
    }
    
    return productImages;
  } catch (error) {
    console.error('Error reading product folders:', error);
    return productImages;
  }
}

// Helper function to determine actual category from filename
function getActualCategoryFromFilename(filename) {
  const prefix = filename.split('_')[0].toLowerCase();
  if (['rings', 'bracelets', 'necklaces', 'earrings'].includes(prefix)) {
    return prefix;
  }
  return null;
}

// Helper function to parse product details from filename
function parseImageFilename(filename, category) {
  // Format: category_metal_design_features_SKU.png
  const parts = filename.split('_');
  
  // Remove file extension from last part
  const skuWithExt = parts[parts.length - 1];
  const sku = skuWithExt.split('.')[0];
  
  // Extract metal type (second part)
  const metal = parts[1] || '';
  
  // Extract design elements (third part onwards, excluding SKU)
  const designElements = parts.slice(2, -1);
  
  // Combine design elements for features, excluding common words
  const features = designElements
    .filter(word => !['and', 'with', 'in', 'of'].includes(word.toLowerCase()))
    .join(' ');
  
  // Get the main design description
  const design = designElements[0] || 'classic';
  
  return {
    metal: formatMetalType(metal),
    design: formatDesignType(design),
    features: formatFeatures(features),
    sku
  };
}

// Helper functions to format product details
function formatMetalType(metal) {
  const metalMap = {
    'white': 'white gold',
    'rose': 'rose gold',
    'yellow': 'yellow gold'
  };
  
  const baseMetal = metal.toLowerCase().split('_')[0];
  return metalMap[baseMetal] || baseMetal;
}

function formatDesignType(design) {
  return design.toLowerCase()
    .replace(/_/g, ' ')
    .trim();
}

function formatFeatures(features) {
  return features.toLowerCase()
    .replace(/_/g, ' ')
    .trim();
}

// Helper function to generate variations based on category and metal type
function generateVariationsForCategory(category, metalType) {
  const variations = [];
  
  switch (category) {
    case 'rings':
      // Ring sizes with proper schema fields
      ['48', '50', '52', '54', '56'].forEach(size => {
        variations.push({
          variationType: 'Size',
          variationValue: size,
          additionalPrice: 0,
          inventory: Math.floor(Math.random() * 5) + 2
        });
      });
      break;
      
    case 'bracelets':
      // Bracelet lengths with proper schema fields
      ['16cm', '18cm', '20cm'].forEach((length, index) => {
        variations.push({
          variationType: 'Length',
          variationValue: length,
          additionalPrice: index === 2 ? 100 : 0, // Premium for longer length
          inventory: Math.floor(Math.random() * 5) + 3
        });
      });
      break;
      
    case 'necklaces':
      // Necklace lengths with proper schema fields
      ['42cm', '45cm', '50cm'].forEach((length, index) => {
        variations.push({
          variationType: 'Length',
          variationValue: length,
          additionalPrice: index === 2 ? 200 : 0, // Premium for longer length
          inventory: Math.floor(Math.random() * 5) + 3
        });
      });
      break;
      
    case 'earrings':
      // Metal variations with proper schema fields
      const metals = ['White Gold', 'Rose Gold', 'Yellow Gold'];
      metals.forEach((metal, index) => {
        variations.push({
          variationType: 'Metal',
          variationValue: metal,
          additionalPrice: index > 0 ? (index === 1 ? 150 : 120) : 0,
          inventory: Math.floor(Math.random() * 5) + 3
        });
      });
      break;
      
    default:
      // Default variation with proper schema fields
      variations.push({
        variationType: 'Standard',
        variationValue: 'One Size',
        additionalPrice: 0,
        inventory: Math.floor(Math.random() * 10) + 5
      });
  }
  
  return variations;
}

// Generate price based on category and features
function generatePriceForProduct(category, features) {
  const baseRanges = {
    'rings': { min: 2500, max: 12000 },
    'bracelets': { min: 3000, max: 15000 },
    'necklaces': { min: 3500, max: 18000 },
    'earrings': { min: 2000, max: 10000 }
  };
  
  // Add premium for materials and features
  let premium = 0;
  
  // Gemstone premiums
  if (features.includes('diamond')) {
    if (features.includes('cluster')) premium += 3000;
    else if (features.includes('halo')) premium += 2500;
    else premium += 2000;
  }
  if (features.includes('sapphire')) premium += 2200;
  if (features.includes('emerald')) premium += 2500;
  if (features.includes('ruby')) premium += 2300;
  
  // Metal type premiums
  if (features.includes('platinum')) premium += 1500;
  if (features.includes('white gold')) premium += 800;
  if (features.includes('rose gold')) premium += 600;
  
  // Design complexity premiums
  if (features.includes('pave')) premium += 1000;
  if (features.includes('baguette')) premium += 1200;
  if (features.includes('eternity')) premium += 1500;
  if (features.includes('three stone')) premium += 2000;
  if (features.includes('solitaire')) premium += 1000;
  
  const range = baseRanges[category] || { min: 2000, max: 10000 };
  const baseAmount = Math.random() * (range.max - range.min) + range.min;
  
  // Round to nearest hundred
  return Math.round((baseAmount + premium) / 100) * 100;
}

// Generate product names and descriptions
function generateProductName(category, metal, design, features) {
  // Now returns a fantasy name instead of descriptive name
  return generateFantasyName(category);
}

function generateProductDescription(category, metal, design, features) {
  // Use our rich description generator for detailed technical information
  return generateRichDescription('en', category, metal, design, features);
}

function generateProductNameFrench(category, metal, design, features) {
  // Returns same fantasy name in French
  return generateFantasyName(category);
}

function generateProductDescriptionFrench(category, metal, design, features) {
  // Use our rich description generator with French language
  return generateRichDescription('fr', category, metal, design, features);
}

function generateProductNameArabic(category, metal, design, features) {
  // Returns same fantasy name for Arabic
  return generateFantasyName(category);
}

function generateProductDescriptionArabic(category, metal, design, features) {
  // Use our rich description generator with Arabic language
  return generateRichDescription('ar', category, metal, design, features);
}

// ✨ USERS
async function seedUsers() {
  console.log('🔹 Creating users...');
  
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  
  const users = [
    {
      email: 'admin@diamant-rouge.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      address: '123 Luxury Avenue',
      city: 'Paris',
      country: 'France',
      phoneNumber: '+33123456789',
      postalCode: '75008',
      memberStatus: 'premium',
      preferredGemstones: ['diamond', 'ruby', 'sapphire'],
      preferredMetals: ['white gold', 'platinum'],
      ringSize: '52',
      braceletSize: '18cm',
      necklaceLength: '45cm'
    },
    {
      email: 'customer@example.com',
      password: hashedPassword,
      name: 'Example Customer',
      role: 'customer',
      address: '456 Jewel Street',
      city: 'New York',
      country: 'USA',
      phoneNumber: '+12125551234',
      postalCode: '10001',
      memberStatus: 'regular',
      preferredGemstones: ['diamond', 'emerald'],
      preferredMetals: ['yellow gold', 'rose gold'],
      ringSize: '54',
      braceletSize: '16cm',
      necklaceLength: '42cm'
    },
    {
      email: 'vip@example.com',
      password: hashedPassword,
      name: 'VIP Customer',
      role: 'customer',
      address: '789 Elite Boulevard',
      city: 'Dubai',
      country: 'UAE',
      phoneNumber: '+9715551234',
      postalCode: '00000',
      memberStatus: 'vip',
      preferredGemstones: ['diamond', 'ruby', 'sapphire', 'emerald'],
      preferredMetals: ['platinum', 'white gold', 'rose gold', 'yellow gold'],
      ringSize: '56',
      braceletSize: '20cm',
      necklaceLength: '50cm'
    }
  ];
  
  for (const userData of users) {
    await prisma.user.create({ data: userData });
  }
  
  console.log(`✅ Created ${users.length} users`);
}

// ✨ ORDERS
async function seedOrders() {
  console.log('🔹 Creating orders...');
  
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany({
    include: {
      variations: true,
      category: true
    }
  });
  
  if (!users.length || !products.length) {
    console.warn('⚠️ No users or products found, skipping order creation');
    return;
  }
  
  const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const paymentMethods = ['CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL'];
  const orders = [];
  
  // Create 1-3 orders for each user
  for (const user of users) {
    const numOrders = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numOrders; i++) {
      const numOrderItems = Math.floor(Math.random() * 4) + 1;
      const orderItems = [];
      let totalAmount = 0;
      
      // Select random products for this order
      const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
      const selectedProducts = shuffledProducts.slice(0, numOrderItems);
      
      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 2) + 1;
        const variation = product.variations[Math.floor(Math.random() * product.variations.length)];
        const basePrice = parseFloat(product.basePrice);
        const additionalPrice = parseFloat(variation?.additionalPrice || 0);
        const finalPrice = basePrice + additionalPrice;
        
        orderItems.push({
          productId: product.id,
          quantity,
          price: finalPrice
        });
        
        totalAmount += finalPrice * quantity;
      }
      
      // Create order with all required schema fields
      const order = await prisma.order.create({
        data: {
        userId: user.id,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        totalAmount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          shippingAddress: user.address || 'Default Address',
          city: user.city || 'Default City',
          country: user.country || 'Default Country',
          postalCode: user.postalCode || '00000',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        orderItems: {
          create: orderItems
          }
        },
        include: {
          orderItems: true,
          user: true
        }
      });
      
      orders.push(order);
      console.log(`✓ Created order: ${order.id} for user: ${user.email}`);
    }
  }
  
  console.log(`✅ Created ${orders.length} orders`);
}

// ✨ APPOINTMENTS
async function seedAppointments() {
  console.log('🔹 Creating appointments...');
  
  const appointments = [];
  const users = await prisma.user.findMany();
  
  if (!users.length) {
    console.warn('⚠️ No users found, skipping appointment creation');
    return;
  }

  const appointmentTypes = ['CONSULTATION', 'FITTING', 'REPAIR'];
  const locationTypes = ['IN_STORE', 'VIRTUAL'];
  const locations = ['Paris Store', 'Online Meeting'];
  
  // Create 10 future appointments
  for (let i = 0; i < 10; i++) {
    // Random date in the next 30 days
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
    
    // Random time between 10am and 6pm
    const hour = Math.floor(Math.random() * 9) + 10;
    const minute = [0, 30][Math.floor(Math.random() * 2)]; // Only on the hour or half hour
    const timeStr = `${hour}:${minute === 0 ? '00' : '30'}`;
    
    // Select a random user
    const user = users[Math.floor(Math.random() * users.length)];
    
    // Create appointment with all required fields
    const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const locationType = locationTypes[Math.floor(Math.random() * locationTypes.length)];
    const location = locations[locationTypes.indexOf(locationType)];
    
    await prisma.appointment.create({
      data: {
        userId: user.id,
        clientEmail: user.email,
        clientPhone: user.phoneNumber || '+1234567890',
        appointmentDate: date,
        appointmentTime: timeStr,
        duration: '60',
        status: 'PENDING',
        location: location,
        locationType: locationType,
        appointmentType: appointmentType,
        appointmentTypeLabel: `${appointmentType} Session`,
        guestCount: 1,
        preferences: 'No specific preferences',
        specialRequests: 'None'
      }
    });
    
    appointments.push({ date, time: timeStr });
  }
  
  console.log(`✅ Created ${appointments.length} appointments`);
}

// ✨ NEWSLETTER SUBSCRIBERS
async function seedNewsletterSubscribers() {
  console.log('🔹 Creating newsletter subscribers...');
  
  const subscribers = [
    { email: 'subscriber1@example.com' },
    { email: 'subscriber2@example.com' },
    { email: 'subscriber3@example.com' },
    { email: 'subscriber4@example.com' },
    { email: 'subscriber5@example.com' },
    { email: 'newsletter@company.com' },
    { email: 'jewelry@enthusiast.net' },
    { email: 'diamond@lover.org' },
    { email: 'luxury@collector.com' },
    { email: 'gem@expert.edu' }
  ];
  
  for (const subscriber of subscribers) {
    await prisma.newsletterSubscriber.create({
      data: subscriber
    });
  }
  
  console.log(`✅ Created ${subscribers.length} newsletter subscribers`);
}

// ✨ NOTIFICATIONS
async function seedNotifications() {
  console.log('🔹 Creating notifications...');
  
  const users = await prisma.user.findMany();
  
  if (!users.length) {
    console.warn('⚠️ No users found, skipping notification creation');
    return;
  }
  
  const notificationTypes = ['ORDER_STATUS', 'PRODUCT_RESTOCK', 'PRICE_DROP', 'NEW_COLLECTION', 'APPOINTMENT_REMINDER'];
  const notifications = [];
  
  // Create 2-5 notifications for each user
  for (const user of users) {
    const numNotifications = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numNotifications; i++) {
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      let message = '';
      switch (type) {
        case 'ORDER_STATUS':
          message = 'Your order status has been updated.';
          break;
        case 'PRODUCT_RESTOCK':
          message = 'A product from your wishlist is back in stock!';
          break;
        case 'PRICE_DROP':
          message = 'Price drop alert on items you might like!';
          break;
        case 'NEW_COLLECTION':
          message = 'Our new luxury collection has arrived!';
          break;
        case 'APPOINTMENT_REMINDER':
          message = 'Reminder: Your appointment is coming up soon.';
          break;
      }
      
      // Create notification with random read status and date within last 30 days
      await prisma.notification.create({
        data: {
          userId: user.id,
          type,
          message,
          read: Math.random() > 0.7, // 30% chance to be read
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        }
      });
      
      notifications.push({ type, message });
    }
  }
  
  console.log(`✅ Created ${notifications.length} notifications`);
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