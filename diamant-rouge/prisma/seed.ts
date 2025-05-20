// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding process...');
  
  try {
    await seedCategories();
    await seedProducts();
    await seedUsers();
    await seedOrders();
    // Skip appointments due to schema mismatch
    // await seedAppointments();
    await seedNewsletterSubscribers();
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
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
    },
    {
      slug: 'watches',
      translations: [
        { language: 'en', name: 'Luxury Timepieces', description: 'Precision engineered watches combining artistry and technical excellence.' },
        { language: 'fr', name: 'Montres de Luxe', description: 'Montres de précision combinant l\'art et l\'excellence technique.' },
        { language: 'ar', name: 'ساعات فاخرة', description: 'ساعات مصممة بدقة تجمع بين الفن والتميز التقني.' },
      ]
    }
  ];
  
  const createdCategories = {};
  
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        slug: category.slug,
        translations: {
          create: category.translations
        }
      }
    });
    
    createdCategories[category.slug] = created;
  }
  
  console.log(`✅ Created ${Object.keys(createdCategories).length} categories`);
  return createdCategories;
}

// ✨ PRODUCTS
async function seedProducts() {
  console.log('🔹 Creating luxury jewelry products...');
  
  // Get all categories
  const categories = await prisma.category.findMany();
  const categoriesMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {});
  
  // Products data array
  const products = [
    {
      sku: 'ROUGE-PASSION-001',
      basePrice: 4999.99,
      featured: true,
      categoryId: categoriesMap['rings'],
      images: ['/images/products/rings/rouge-passion-01.jpg', '/images/products/rings/rouge-passion-02.jpg'],
      translations: [
        { language: 'en', name: 'Rouge Passion Diamond Ring', description: 'A symbol of eternal love, set with a rare crimson diamond.' },
        { language: 'fr', name: 'Bague Diamant Rouge Passion', description: "Un symbole d'amour éternel, serti d'un diamant rouge rare." },
        { language: 'ar', name: 'خاتم الألماس روج باشون', description: 'رمز الحب الأبدي، مرصع بألماس قرمزي نادر.' },
      ],
      variations: [
        { type: 'Size', value: '48', addPrice: 0, inventory: 5 },
        { type: 'Size', value: '50', addPrice: 0, inventory: 7 },
        { type: 'Size', value: '52', addPrice: 0, inventory: 10 },
        { type: 'Size', value: '54', addPrice: 0, inventory: 8 },
        { type: 'Size', value: '56', addPrice: 0, inventory: 6 },
      ]
    },
    {
      sku: 'IMPERIAL-BRACELET-001',
      basePrice: 2999.99,
      featured: true,
      categoryId: categoriesMap['bracelets'],
      images: ['/images/products/bracelets/imperial-gold-01.jpg', '/images/products/bracelets/imperial-gold-02.jpg'],
      translations: [
        { language: 'en', name: 'Imperial Gold Bracelet', description: 'A royal statement of elegance, crafted from 24k pure gold.' },
        { language: 'fr', name: 'Bracelet Impérial en Or', description: 'Une déclaration royale d\'élégance, fabriquée en or pur 24 carats.' },
        { language: 'ar', name: 'سوار الإمبراطورية الذهبي', description: 'تصريح ملكي بالأناقة، مصنوع من الذهب الخالص عيار 24.' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 12 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 15 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 8 },
      ]
    },
    {
      sku: 'DIVINE-PEARL-001',
      basePrice: 3499.99,
      featured: true,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/necklaces/divine-pearl-01.jpg', '/images/products/necklaces/divine-pearl-02.jpg'],
      translations: [
        { language: 'en', name: 'Divine Pearl Necklace', description: 'Exquisite South Sea pearls arranged in a cascading design, showcasing timeless elegance.' },
        { language: 'fr', name: 'Collier Perle Divine', description: 'Perles exquises des mers du Sud disposées en cascade, incarnant l\'élégance intemporelle.' },
        { language: 'ar', name: 'قلادة اللؤلؤ الإلهي', description: 'لآلئ بحر الجنوب الفاخرة مرتبة في تصميم متدرج، تُظهر الأناقة الخالدة.' },
      ],
      variations: [
        { type: 'Length', value: '42cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '45cm', addPrice: 0, inventory: 12 },
        { type: 'Length', value: '50cm', addPrice: 200, inventory: 8 },
      ]
    },
    {
      sku: 'PLATINUM-SOLITAIRE-001',
      basePrice: 7999.99,
      featured: true,
      categoryId: categoriesMap['rings'],
      images: ['/images/products/rings/platinum-solitaire-01.jpg', '/images/products/rings/platinum-solitaire-02.jpg'],
      translations: [
        { language: 'en', name: 'Platinum Solitaire Diamond Ring', description: 'The epitome of purity, featuring a flawless 2-carat diamond in a minimalist setting.' },
        { language: 'fr', name: 'Bague Solitaire en Platine', description: 'L\'apogée de la pureté, avec un diamant sans défaut de 2 carats dans un cadre minimaliste.' },
        { language: 'ar', name: 'خاتم الألماس البلاتيني المنفرد', description: 'رمز النقاء، يضم ألماسة خالية من العيوب بوزن 2 قيراط في إطار بسيط.' },
      ],
      variations: [
        { type: 'Size', value: '48', addPrice: 0, inventory: 3 },
        { type: 'Size', value: '50', addPrice: 0, inventory: 4 },
        { type: 'Size', value: '52', addPrice: 0, inventory: 5 },
        { type: 'Size', value: '54', addPrice: 0, inventory: 4 },
        { type: 'Size', value: '56', addPrice: 0, inventory: 3 },
      ]
    },
    {
      sku: 'SAPPHIRE-CASCADE-001',
      basePrice: 3299.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/earrings/sapphire-cascade-01.jpg', '/images/products/earrings/sapphire-cascade-02.jpg'],
      translations: [
        { language: 'en', name: 'Sapphire Cascade Earrings', description: 'Delicate cascades of Ceylon sapphires set in white gold for an ethereal effect.' },
        { language: 'fr', name: 'Boucles d\'Oreilles Cascade de Saphirs', description: 'Délicates cascades de saphirs de Ceylan serties dans de l\'or blanc pour un effet éthéré.' },
        { language: 'ar', name: 'أقراط الياقوت المتدفقة', description: 'شلالات رقيقة من الياقوت السيلاني مرصعة في الذهب الأبيض لتأثير أثيري.' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 8 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 150, inventory: 6 },
      ]
    },
    {
      sku: 'GRAND-CHRONOGRAPH-001',
      basePrice: 15999.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/watches/grand-chronograph-01.jpg', '/images/products/watches/grand-chronograph-02.jpg'],
      translations: [
        { language: 'en', name: 'Grand Tourbillon Chronograph', description: 'A masterpiece of horology featuring a hand-finished tourbillon movement and perpetual calendar.' },
        { language: 'fr', name: 'Grand Chronographe Tourbillon', description: 'Un chef-d\'œuvre d\'horlogerie avec un mouvement tourbillon fini à la main et un calendrier perpétuel.' },
        { language: 'ar', name: 'كرونوغراف توربيون غراند', description: 'تحفة فنية في صناعة الساعات تتميز بحركة توربيون مصقولة يدويًا وتقويم دائم.' },
      ],
      variations: [
        { type: 'Material', value: 'Rose Gold', addPrice: 0, inventory: 3 },
        { type: 'Material', value: 'White Gold', addPrice: 0, inventory: 3 },
        { type: 'Material', value: 'Platinum', addPrice: 4000, inventory: 2 },
      ]
    }
  ];

  // Create products and their variations
  const createdProducts = {};
  
  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        sku: product.sku,
        basePrice: product.basePrice,
        featured: product.featured,
        images: product.images,
        categoryId: product.categoryId,
        translations: {
          create: product.translations
        }
      }
    });
    
    // Create variations for this product
    for (const variation of product.variations) {
      await prisma.productVariation.create({
        data: {
          productId: createdProduct.id,
          variationType: variation.type,
          variationValue: variation.value,
          additionalPrice: variation.addPrice,
          inventory: variation.inventory
        }
      });
    }
    
    createdProducts[product.sku] = createdProduct;
  }
  
  console.log(`✅ Created ${Object.keys(createdProducts).length} products with variations`);
  return createdProducts;
}

// ✨ USERS
async function seedUsers() {
  console.log('🔹 Creating user accounts...');
  
  const users = [
    {
      email: 'customer@diamant-rouge.com',
      password: 'customer123',
      name: 'Sophie Dupont',
      role: 'customer',
      address: '23 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
      phoneNumber: '+33612345678',
      memberStatus: 'gold',
      preferences: {
        metals: ['Or Jaune', 'Or Rose'],
        gemstones: ['Diamant', 'Rubis', 'Perle'],
        ringSize: '52',
        braceletSize: '16cm',
        necklaceLength: '42cm'
      }
    },
    {
      email: 'vip@diamant-rouge.com',
      password: 'vip123',
      name: 'Isabelle Laurent',
      role: 'customer',
      address: '128 Boulevard Saint-Germain',
      city: 'Paris',
      postalCode: '75006',
      country: 'France',
      phoneNumber: '+33687654321',
      memberStatus: 'vip',
      preferences: {
        metals: ['Platine', 'Or Blanc'],
        gemstones: ['Diamant', 'Saphir', 'Émeraude'],
        ringSize: '54',
        braceletSize: '17cm',
        necklaceLength: '45cm'
      }
    },
    {
      email: 'admin@diamant-rouge.com',
      password: 'admin123',
      name: 'Diamant Rouge Admin',
      role: 'admin',
      memberStatus: 'vip',
      preferences: {
        metals: ['Or Blanc', 'Platine'],
        gemstones: ['Diamant', 'Saphir'],
        ringSize: '54',
        braceletSize: '18cm',
        necklaceLength: '45cm'
      }
    },
    {
      email: 'employee@diamant-rouge.com',
      password: 'employee123',
      name: 'Jean Mercier',
      role: 'employee',
      memberStatus: 'regular',
      preferences: {
        metals: ['Or Jaune'],
        gemstones: ['Diamant'],
        ringSize: '56'
      }
    }
  ];
  
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        name: user.name,
        role: user.role,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        country: user.country,
        phoneNumber: user.phoneNumber,
        memberStatus: user.memberStatus,
        preferredMetals: user.preferences?.metals || [],
        preferredGemstones: user.preferences?.gemstones || [],
        ringSize: user.preferences?.ringSize,
        braceletSize: user.preferences?.braceletSize,
        necklaceLength: user.preferences?.necklaceLength
      }
    });
  }
  
  console.log(`✅ Created ${users.length} users with different roles`);
}

// ✨ ORDERS
async function seedOrders() {
  console.log('🔹 Creating sample orders...');
  
  // Get products and users
  const products = await prisma.product.findMany();
  const users = await prisma.user.findMany({ 
    where: { 
      role: { in: ['customer', 'vip'] }
    }
  });
  
  if (products.length < 3 || users.length < 2) {
    console.warn('⚠️ Not enough products or users to create orders');
    return;
  }
  
  const productMap = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});
  
  const orderSamples = [
    // Past order for first customer
    {
      userId: users[0].id,
      totalAmount: 4999.99,
      status: 'DELIVERED',
      paymentMethod: 'CREDIT_CARD',
      shippingAddress: users[0].address,
      city: users[0].city,
      postalCode: users[0].postalCode,
      country: users[0].country,
      items: [
        { productId: products[0].id, quantity: 1, price: 4999.99 }
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    },
    // Recent order for first customer
    {
      userId: users[0].id,
      totalAmount: 2999.99,
      status: 'SHIPPED',
      paymentMethod: 'CREDIT_CARD',
      shippingAddress: users[0].address,
      city: users[0].city,
      postalCode: users[0].postalCode,
      country: users[0].country,
      items: [
        { productId: products[1].id, quantity: 1, price: 2999.99 }
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    // VIP customer order
    {
      userId: users[1].id,
      totalAmount: 8499.98,
      status: 'PROCESSING',
      paymentMethod: 'BANK_TRANSFER',
      shippingAddress: users[1].address,
      city: users[1].city,
      postalCode: users[1].postalCode,
      country: users[1].country,
      items: [
        { productId: products[0].id, quantity: 1, price: 4999.99 },
        { productId: products[2].id, quantity: 1, price: 3499.99 }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    // Recent order with multiple items
    {
      userId: users[0].id,
      totalAmount: 9498.97,
      status: 'PENDING',
      paymentMethod: 'PAYPAL',
      shippingAddress: users[0].address,
      city: users[0].city,
      postalCode: users[0].postalCode,
      country: users[0].country,
      items: [
        { productId: products[2].id, quantity: 1, price: 3499.99 },
        { productId: products[1].id, quantity: 2, price: 2999.99 }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    }
  ];
  
  // Create orders and their items
  for (const orderData of orderSamples) {
    await prisma.order.create({
      data: {
        userId: orderData.userId,
        totalAmount: orderData.totalAmount,
        status: orderData.status,
        paymentMethod: orderData.paymentMethod,
        shippingAddress: orderData.shippingAddress,
        city: orderData.city,
        postalCode: orderData.postalCode,
        country: orderData.country,
        createdAt: orderData.createdAt,
        orderItems: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });
  }
  
  console.log(`✅ Created ${orderSamples.length} orders with items`);
}

// ✨ NEWSLETTER SUBSCRIBERS
async function seedNewsletterSubscribers() {
  console.log('🔹 Creating newsletter subscribers...');
  
  const subscribers = [
    { email: 'fashion_enthusiast@example.com' },
    { email: 'jewelry_collector@example.com' },
    { email: 'luxury_lifestyle@example.com' }
  ];
  
  for (const subscriber of subscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: subscriber.email },
      update: {},
      create: {
        email: subscriber.email
      }
    });
  }
  
  console.log(`✅ Created ${subscribers.length} newsletter subscribers`);
}

// Run the seeder
main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
