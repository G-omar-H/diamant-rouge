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
  
  // Process each category's images and create corresponding products
  for (const category in productImages) {
    const categoryId = categoryMap[category];
    
    if (!categoryId) {
      console.warn(`⚠️ Category not found for: ${category}`);
      continue;
    }
    
    for (const image of productImages[category]) {
      try {
        // Extract product details from filename
        const { metal, design, features, sku } = parseImageFilename(image.filename, category);
        
        // Create appropriate variations based on category
        const variations = createVariationsForCategory(category);
        
        // Generate price based on category and features (some randomness)
        const basePrice = generatePriceForProduct(category, features);
        
        // Create product
        await prisma.product.create({
          data: {
            sku,
            basePrice,
            categoryId,
            featured: Math.random() > 0.7, // 30% chance to be featured
            images: [`/images/products/${category}/${image.filename}`],
            translations: {
              create: [
                { 
                  language: 'en', 
                  name: generateProductName(category, metal, design, features),
                  description: generateProductDescription(category, metal, design, features)
                },
                { 
                  language: 'fr', 
                  name: generateProductNameFrench(category, metal, design, features),
                  description: generateProductDescriptionFrench(category, metal, design, features)
                },
                { 
                  language: 'ar', 
                  name: generateProductNameArabic(category, metal, design, features),
                  description: generateProductDescriptionArabic(category, metal, design, features)
                }
              ]
            },
            variations: {
              create: variations
            }
          }
        });
        
        productsCreated++;
      } catch (error) {
        console.error(`⚠️ Error creating product from ${image.filename}:`, error);
      }
    }
  }
  
  console.log(`✅ Created ${productsCreated} products`);
}

// Helper function to get all product images from the organized folders
function getProductImagesFromFolders() {
  const productImages = {};
  const productsFolderPath = path.join(process.cwd(), 'public', 'images', 'products');
  
  try {
    // Read category folders
    const categoryFolders = fs.readdirSync(productsFolderPath).filter(folder => 
      fs.statSync(path.join(productsFolderPath, folder)).isDirectory()
    );
    
    for (const category of categoryFolders) {
      const categoryPath = path.join(productsFolderPath, category);
      try {
        const files = fs.readdirSync(categoryPath)
          .filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
          .map(filename => ({ 
            filename,
            path: path.join(categoryPath, filename)
          }));
        
        productImages[category] = files;
      } catch (error) {
        console.error(`Error reading category folder ${category}:`, error);
        productImages[category] = [];
      }
    }
    
    return productImages;
  } catch (error) {
    console.error('Error reading product folders:', error);
    return {};
  }
}

// Helper function to parse product details from filename
function parseImageFilename(filename, category) {
  // Expected format: category_metal_design_features_SKU.png
  const parts = filename.split('_');
  const sku = parts[parts.length - 1].split('.')[0];
  
  return {
    metal: parts[1] || 'gold',
    design: parts[2] || 'classic',
    features: parts.slice(3, -1).join(' ') || 'elegant',
    sku
  };
}

// Helper function to create variations based on category
function createVariationsForCategory(category) {
  switch (category) {
    case 'rings':
      return [
        { variationType: 'Size', variationValue: '48', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 2 },
        { variationType: 'Size', variationValue: '50', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 3 },
        { variationType: 'Size', variationValue: '52', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 5 },
        { variationType: 'Size', variationValue: '54', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 4 },
        { variationType: 'Size', variationValue: '56', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 2 },
      ];
    case 'bracelets':
      return [
        { variationType: 'Length', variationValue: '16cm', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 5 },
        { variationType: 'Length', variationValue: '18cm', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 7 },
        { variationType: 'Length', variationValue: '20cm', additionalPrice: 100, inventory: Math.floor(Math.random() * 5) + 3 },
      ];
    case 'necklaces':
      return [
        { variationType: 'Length', variationValue: '42cm', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 5 },
        { variationType: 'Length', variationValue: '45cm', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 7 },
        { variationType: 'Length', variationValue: '50cm', additionalPrice: 200, inventory: Math.floor(Math.random() * 5) + 3 },
      ];
    case 'earrings':
      return [
        { variationType: 'Metal', variationValue: 'White Gold', additionalPrice: 0, inventory: Math.floor(Math.random() * 5) + 5 },
        { variationType: 'Metal', variationValue: 'Rose Gold', additionalPrice: 150, inventory: Math.floor(Math.random() * 5) + 3 },
        { variationType: 'Metal', variationValue: 'Yellow Gold', additionalPrice: 120, inventory: Math.floor(Math.random() * 5) + 4 },
      ];
    default:
      return [
        { variationType: 'Size', variationValue: 'Standard', additionalPrice: 0, inventory: Math.floor(Math.random() * 10) + 5 },
      ];
  }
}

// Generate price based on category and features
function generatePriceForProduct(category, features) {
  const baseRanges = {
    'rings': { min: 1500, max: 8000 },
    'bracelets': { min: 2000, max: 6000 },
    'necklaces': { min: 2500, max: 9000 },
    'earrings': { min: 1200, max: 5000 }
  };
  
  // Add premium for certain features
  let premium = 0;
  if (features.includes('diamond')) premium += 1500;
  if (features.includes('sapphire')) premium += 1200;
  if (features.includes('emerald')) premium += 1300;
  if (features.includes('ruby')) premium += 1400;
  if (features.includes('platinum')) premium += 1000;
  
  const range = baseRanges[category] || { min: 1000, max: 5000 };
  const baseAmount = Math.random() * (range.max - range.min) + range.min;
  
  // Round to 2 decimal places
  return Number((baseAmount + premium).toFixed(2));
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
    include: { variations: true }
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
      // For each order, add 1-4 products
      const numOrderItems = Math.floor(Math.random() * 4) + 1;
      const orderItems = [];
      let totalAmount = 0;
      
      // Select random products for this order
      const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
      const selectedProducts = shuffledProducts.slice(0, numOrderItems);
      
      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 2) + 1;
        const price = parseFloat(product.basePrice);
        
        orderItems.push({
          productId: product.id,
          quantity,
          price
        });
        
        totalAmount += price * quantity;
      }
      
      // Create the order
      const orderData = {
        userId: user.id,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        totalAmount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        shippingAddress: user.address,
        city: user.city,
        country: user.country,
        postalCode: user.postalCode,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
        orderItems: {
          create: orderItems
        }
      };
      
      const order = await prisma.order.create({
        data: orderData
      });
      
      orders.push(order);
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