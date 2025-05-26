// prisma/products-seed.ts
// Generated file - do not edit manually
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('🔹 Creating products from individual images...');
  
  // Get all categories
  const categories = await prisma.category.findMany();
  const categoriesMap: Record<string, number> = {};
  
  // Create a properly typed categoriesMap
  for (const cat of categories) {
    categoriesMap[cat.slug] = cat.id;
  }
  
  // Products data array
  const products = [

    {
      sku: 'WATCHES-1001',
      basePrice: 8950.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/, - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Precision Platinum Automatic Watch', description: 'This magnificent timepiece is carefully handcrafted to combine timeless style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Platinum Automatic Watch (FR)', description: 'This magnificent timepiece is carefully handcrafted to combine timeless style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Platinum Automatic Watch (AR)', description: 'This magnificent timepiece is carefully handcrafted to combine timeless style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 4 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 3 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 5 },
      ]
    },
    {
      sku: 'NECKLACES-1002',
      basePrice: 6855.99,
      featured: true,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/Copy of IMG_7618 - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning Silver Choker Necklace', description: 'This luxurious necklace is meticulously crafted to add a touch of luxurious sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Silver Choker Necklace (FR)', description: 'This luxurious necklace is meticulously crafted to add a touch of luxurious sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Silver Choker Necklace (AR)', description: 'This luxurious necklace is meticulously crafted to add a touch of luxurious sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 11 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 8 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 3 },
      ]
    },
    {
      sku: 'NECKLACES-1003',
      basePrice: 2809.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/Copy of IMG_7626 - Copy - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning Platinum Diamond Necklace', description: 'This stunning necklace is artfully created to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Platinum Diamond Necklace (FR)', description: 'This stunning necklace is artfully created to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Platinum Diamond Necklace (AR)', description: 'This stunning necklace is artfully created to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 9 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 12 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 6 },
      ]
    },
    {
      sku: 'NECKLACES-1004',
      basePrice: 5050.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/Copy of IMG_7628 - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning Yellow Gold Pendant Necklace', description: 'This timeless necklace is meticulously crafted to add a touch of elegant sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Yellow Gold Pendant Necklace (FR)', description: 'This timeless necklace is meticulously crafted to add a touch of elegant sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Yellow Gold Pendant Necklace (AR)', description: 'This timeless necklace is meticulously crafted to add a touch of elegant sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 9 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 4 },
      ]
    },
    {
      sku: 'NECKLACES-1005',
      basePrice: 6543.99,
      featured: true,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/Copy of IMG_7649 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Stunning Titanium Statement Necklace', description: 'This magnificent necklace is expertly designed to add a touch of elegant sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Titanium Statement Necklace (FR)', description: 'This magnificent necklace is expertly designed to add a touch of elegant sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Titanium Statement Necklace (AR)', description: 'This magnificent necklace is expertly designed to add a touch of elegant sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 5 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 12 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 9 },
      ]
    },
    {
      sku: 'WATCHES-1006',
      basePrice: 1042.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Precision Platinum Automatic Watch', description: 'This elegant timepiece is artfully created to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Platinum Automatic Watch (FR)', description: 'This elegant timepiece is artfully created to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Platinum Automatic Watch (AR)', description: 'This elegant timepiece is artfully created to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 7 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 6 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 6 },
      ]
    },
    {
      sku: 'WATCHES-1007',
      basePrice: 4690.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_0363 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Precision Rose Gold Dress Watch', description: 'This exquisite timepiece is expertly designed to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Rose Gold Dress Watch (FR)', description: 'This exquisite timepiece is expertly designed to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Rose Gold Dress Watch (AR)', description: 'This exquisite timepiece is expertly designed to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 6 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 6 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 3 },
      ]
    },
    {
      sku: 'WATCHES-1008',
      basePrice: 1417.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_5585 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Precision Titanium Diamond Watch', description: 'This sophisticated timepiece is artfully created to combine magnificent style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Titanium Diamond Watch (FR)', description: 'This sophisticated timepiece is artfully created to combine magnificent style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Titanium Diamond Watch (AR)', description: 'This sophisticated timepiece is artfully created to combine magnificent style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 4 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 7 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 6 },
      ]
    },
    {
      sku: 'WATCHES-1009',
      basePrice: 5403.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_5618 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Precision Yellow Gold Luxury Timepiece', description: 'This stunning timepiece is precision engineered to combine timeless style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Yellow Gold Luxury Timepiece (FR)', description: 'This stunning timepiece is precision engineered to combine timeless style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Yellow Gold Luxury Timepiece (AR)', description: 'This stunning timepiece is precision engineered to combine timeless style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 7 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 3 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 6 },
      ]
    },
    {
      sku: 'BRACELETS-1010',
      basePrice: 4680.99,
      featured: false,
      categoryId: categoriesMap['bracelets'],
      images: ['/images/products/IMG_6198 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Luxurious Platinum Tennis Bracelet', description: 'This magnificent bracelet is meticulously crafted to adorn your wrist with timeless elegance. A versatile piece that complements any attire.' },
        { language: 'fr', name: 'Luxurious Platinum Tennis Bracelet (FR)', description: 'This magnificent bracelet is meticulously crafted to adorn your wrist with timeless elegance. A versatile piece that complements any attire. (Traduction française)' },
        { language: 'ar', name: 'Luxurious Platinum Tennis Bracelet (AR)', description: 'This magnificent bracelet is meticulously crafted to adorn your wrist with timeless elegance. A versatile piece that complements any attire. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 12 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 11 },
      ]
    },
    {
      sku: 'EARRINGS-1011',
      basePrice: 6306.99,
      featured: true,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_6226 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Exquisite Silver Chandelier Earrings', description: 'These exquisite earrings are expertly designed to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Silver Chandelier Earrings (FR)', description: 'These exquisite earrings are expertly designed to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Silver Chandelier Earrings (AR)', description: 'These exquisite earrings are expertly designed to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 8 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 6 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 3 },
      ]
    },
    {
      sku: 'RINGS-1012',
      basePrice: 1576.99,
      featured: true,
      categoryId: categoriesMap['rings'],
      images: ['/images/products/IMG_7067 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Elegant Titanium Gemstone Ring', description: 'This timeless ring is artfully created to showcase the sophisticated beauty of its design. Perfect for special occasions or everyday elegance.' },
        { language: 'fr', name: 'Elegant Titanium Gemstone Ring (FR)', description: 'This timeless ring is artfully created to showcase the sophisticated beauty of its design. Perfect for special occasions or everyday elegance. (Traduction française)' },
        { language: 'ar', name: 'Elegant Titanium Gemstone Ring (AR)', description: 'This timeless ring is artfully created to showcase the sophisticated beauty of its design. Perfect for special occasions or everyday elegance. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Size', value: '48', addPrice: 0, inventory: 8 },
        { type: 'Size', value: '50', addPrice: 0, inventory: 12 },
        { type: 'Size', value: '52', addPrice: 0, inventory: 4 },
        { type: 'Size', value: '54', addPrice: 0, inventory: 8 },
        { type: 'Size', value: '56', addPrice: 0, inventory: 6 },
      ]
    },
    {
      sku: 'RINGS-1013',
      basePrice: 8364.99,
      featured: false,
      categoryId: categoriesMap['rings'],
      images: ['/images/products/IMG_7167 - Copy - Copy.png'],
      translations: [
        { language: 'en', name: 'Elegant Rose Gold Eternity Ring', description: 'This sophisticated ring is artfully created to showcase the timeless beauty of its design. Perfect for special occasions or everyday elegance.' },
        { language: 'fr', name: 'Elegant Rose Gold Eternity Ring (FR)', description: 'This sophisticated ring is artfully created to showcase the timeless beauty of its design. Perfect for special occasions or everyday elegance. (Traduction française)' },
        { language: 'ar', name: 'Elegant Rose Gold Eternity Ring (AR)', description: 'This sophisticated ring is artfully created to showcase the timeless beauty of its design. Perfect for special occasions or everyday elegance. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Size', value: '48', addPrice: 0, inventory: 6 },
        { type: 'Size', value: '50', addPrice: 0, inventory: 7 },
        { type: 'Size', value: '52', addPrice: 0, inventory: 8 },
        { type: 'Size', value: '54', addPrice: 0, inventory: 12 },
        { type: 'Size', value: '56', addPrice: 0, inventory: 6 },
      ]
    },
    {
      sku: 'WATCHES-1014',
      basePrice: 1814.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_7182,2 - Copy - Copy.png'],
      translations: [
        { language: 'en', name: 'Precision Yellow Gold Luxury Timepiece', description: 'This timeless timepiece is expertly designed to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Yellow Gold Luxury Timepiece (FR)', description: 'This timeless timepiece is expertly designed to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Yellow Gold Luxury Timepiece (AR)', description: 'This timeless timepiece is expertly designed to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 4 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 6 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 5 },
      ]
    },
    {
      sku: 'WATCHES-1015',
      basePrice: 2896.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_7200,2 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Precision Yellow Gold Luxury Timepiece', description: 'This magnificent timepiece is precision engineered to combine magnificent style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Yellow Gold Luxury Timepiece (FR)', description: 'This magnificent timepiece is precision engineered to combine magnificent style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Yellow Gold Luxury Timepiece (AR)', description: 'This magnificent timepiece is precision engineered to combine magnificent style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 4 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 7 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 5 },
      ]
    },
    {
      sku: 'RINGS-1016',
      basePrice: 5377.99,
      featured: true,
      categoryId: categoriesMap['rings'],
      images: ['/images/products/IMG_7258 - Copy.png'],
      translations: [
        { language: 'en', name: 'Elegant Silver Eternity Ring', description: 'This timeless ring is expertly designed to showcase the radiant beauty of its design. Perfect for special occasions or everyday elegance.' },
        { language: 'fr', name: 'Elegant Silver Eternity Ring (FR)', description: 'This timeless ring is expertly designed to showcase the radiant beauty of its design. Perfect for special occasions or everyday elegance. (Traduction française)' },
        { language: 'ar', name: 'Elegant Silver Eternity Ring (AR)', description: 'This timeless ring is expertly designed to showcase the radiant beauty of its design. Perfect for special occasions or everyday elegance. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Size', value: '48', addPrice: 0, inventory: 8 },
        { type: 'Size', value: '50', addPrice: 0, inventory: 7 },
        { type: 'Size', value: '52', addPrice: 0, inventory: 12 },
        { type: 'Size', value: '54', addPrice: 0, inventory: 6 },
        { type: 'Size', value: '56', addPrice: 0, inventory: 12 },
      ]
    },
    {
      sku: 'RINGS-1017',
      basePrice: 2069.99,
      featured: false,
      categoryId: categoriesMap['rings'],
      images: ['/images/products/IMG_7260 - Copy (2).png'],
      translations: [
        { language: 'en', name: 'Elegant Platinum Engagement Ring', description: 'This luxurious ring is meticulously crafted to showcase the exquisite beauty of its design. Perfect for special occasions or everyday elegance.' },
        { language: 'fr', name: 'Elegant Platinum Engagement Ring (FR)', description: 'This luxurious ring is meticulously crafted to showcase the exquisite beauty of its design. Perfect for special occasions or everyday elegance. (Traduction française)' },
        { language: 'ar', name: 'Elegant Platinum Engagement Ring (AR)', description: 'This luxurious ring is meticulously crafted to showcase the exquisite beauty of its design. Perfect for special occasions or everyday elegance. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Size', value: '48', addPrice: 0, inventory: 12 },
        { type: 'Size', value: '50', addPrice: 0, inventory: 12 },
        { type: 'Size', value: '52', addPrice: 0, inventory: 8 },
        { type: 'Size', value: '54', addPrice: 0, inventory: 7 },
        { type: 'Size', value: '56', addPrice: 0, inventory: 10 },
      ]
    },
    {
      sku: 'RINGS-1018',
      basePrice: 4195.99,
      featured: false,
      categoryId: categoriesMap['rings'],
      images: ['/images/products/IMG_7282 - Copy.png'],
      translations: [
        { language: 'en', name: 'Elegant Silver Gold Band', description: 'This sophisticated ring is expertly designed to showcase the luxurious beauty of its design. Perfect for special occasions or everyday elegance.' },
        { language: 'fr', name: 'Elegant Silver Gold Band (FR)', description: 'This sophisticated ring is expertly designed to showcase the luxurious beauty of its design. Perfect for special occasions or everyday elegance. (Traduction française)' },
        { language: 'ar', name: 'Elegant Silver Gold Band (AR)', description: 'This sophisticated ring is expertly designed to showcase the luxurious beauty of its design. Perfect for special occasions or everyday elegance. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Size', value: '48', addPrice: 0, inventory: 3 },
        { type: 'Size', value: '50', addPrice: 0, inventory: 9 },
        { type: 'Size', value: '52', addPrice: 0, inventory: 8 },
        { type: 'Size', value: '54', addPrice: 0, inventory: 12 },
        { type: 'Size', value: '56', addPrice: 0, inventory: 9 },
      ]
    },
    {
      sku: 'RINGS-1019',
      basePrice: 5076.99,
      featured: false,
      categoryId: categoriesMap['rings'],
      images: ['/images/products/IMG_7292 - Copy.png'],
      translations: [
        { language: 'en', name: 'Elegant Yellow Gold Wedding Band', description: 'This stunning ring is precision engineered to showcase the radiant beauty of its design. Perfect for special occasions or everyday elegance.' },
        { language: 'fr', name: 'Elegant Yellow Gold Wedding Band (FR)', description: 'This stunning ring is precision engineered to showcase the radiant beauty of its design. Perfect for special occasions or everyday elegance. (Traduction française)' },
        { language: 'ar', name: 'Elegant Yellow Gold Wedding Band (AR)', description: 'This stunning ring is precision engineered to showcase the radiant beauty of its design. Perfect for special occasions or everyday elegance. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Size', value: '48', addPrice: 0, inventory: 4 },
        { type: 'Size', value: '50', addPrice: 0, inventory: 9 },
        { type: 'Size', value: '52', addPrice: 0, inventory: 3 },
        { type: 'Size', value: '54', addPrice: 0, inventory: 6 },
        { type: 'Size', value: '56', addPrice: 0, inventory: 10 },
      ]
    },
    {
      sku: 'EARRINGS-1020',
      basePrice: 3618.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7300 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Silver Chandelier Earrings', description: 'These sophisticated earrings are expertly designed to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Silver Chandelier Earrings (FR)', description: 'These sophisticated earrings are expertly designed to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Silver Chandelier Earrings (AR)', description: 'These sophisticated earrings are expertly designed to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 9 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 7 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 8 },
      ]
    },
    {
      sku: 'EARRINGS-1021',
      basePrice: 5659.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7306.2 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Silver Chandelier Earrings', description: 'These timeless earrings are precision engineered to frame your face with timeless brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Silver Chandelier Earrings (FR)', description: 'These timeless earrings are precision engineered to frame your face with timeless brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Silver Chandelier Earrings (AR)', description: 'These timeless earrings are precision engineered to frame your face with timeless brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 6 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 5 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 6 },
      ]
    },
    {
      sku: 'EARRINGS-1022',
      basePrice: 3452.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7319 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Titanium Pearl Earrings', description: 'These stunning earrings are expertly designed to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Titanium Pearl Earrings (FR)', description: 'These stunning earrings are expertly designed to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Titanium Pearl Earrings (AR)', description: 'These stunning earrings are expertly designed to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 8 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 12 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 3 },
      ]
    },
    {
      sku: 'EARRINGS-1023',
      basePrice: 2335.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7331 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Titanium Pearl Earrings', description: 'These elegant earrings are carefully handcrafted to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Titanium Pearl Earrings (FR)', description: 'These elegant earrings are carefully handcrafted to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Titanium Pearl Earrings (AR)', description: 'These elegant earrings are carefully handcrafted to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 7 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 12 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 5 },
      ]
    },
    {
      sku: 'EARRINGS-1024',
      basePrice: 7012.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7366 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Silver Chandelier Earrings', description: 'These stunning earrings are meticulously crafted to frame your face with timeless brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Silver Chandelier Earrings (FR)', description: 'These stunning earrings are meticulously crafted to frame your face with timeless brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Silver Chandelier Earrings (AR)', description: 'These stunning earrings are meticulously crafted to frame your face with timeless brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 11 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 8 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 3 },
      ]
    },
    {
      sku: 'EARRINGS-1025',
      basePrice: 3068.99,
      featured: true,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7381 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite White Gold Drop Earrings', description: 'These stunning earrings are carefully handcrafted to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite White Gold Drop Earrings (FR)', description: 'These stunning earrings are carefully handcrafted to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite White Gold Drop Earrings (AR)', description: 'These stunning earrings are carefully handcrafted to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 11 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 9 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 6 },
      ]
    },
    {
      sku: 'EARRINGS-1026',
      basePrice: 5000.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7392 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Platinum Diamond Earrings', description: 'These elegant earrings are artfully created to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Platinum Diamond Earrings (FR)', description: 'These elegant earrings are artfully created to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Platinum Diamond Earrings (AR)', description: 'These elegant earrings are artfully created to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 8 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 12 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 4 },
      ]
    },
    {
      sku: 'EARRINGS-1027',
      basePrice: 2500.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7396 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Silver Chandelier Earrings', description: 'These stunning earrings are precision engineered to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Silver Chandelier Earrings (FR)', description: 'These stunning earrings are precision engineered to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Silver Chandelier Earrings (AR)', description: 'These stunning earrings are precision engineered to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 4 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 10 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 10 },
      ]
    },
    {
      sku: 'EARRINGS-1028',
      basePrice: 7955.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7398 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Platinum Diamond Earrings', description: 'These elegant earrings are carefully handcrafted to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Platinum Diamond Earrings (FR)', description: 'These elegant earrings are carefully handcrafted to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Platinum Diamond Earrings (AR)', description: 'These elegant earrings are carefully handcrafted to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 3 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 10 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 10 },
      ]
    },
    {
      sku: 'EARRINGS-1029',
      basePrice: 4023.99,
      featured: true,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7406 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Yellow Gold Stud Earrings', description: 'These radiant earrings are precision engineered to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Yellow Gold Stud Earrings (FR)', description: 'These radiant earrings are precision engineered to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Yellow Gold Stud Earrings (AR)', description: 'These radiant earrings are precision engineered to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 8 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 3 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 8 },
      ]
    },
    {
      sku: 'EARRINGS-1030',
      basePrice: 8795.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7410 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Platinum Diamond Earrings', description: 'These elegant earrings are artfully created to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Platinum Diamond Earrings (FR)', description: 'These elegant earrings are artfully created to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Platinum Diamond Earrings (AR)', description: 'These elegant earrings are artfully created to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 7 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 11 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 11 },
      ]
    },
    {
      sku: 'EARRINGS-1031',
      basePrice: 5884.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7412 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Yellow Gold Stud Earrings', description: 'These timeless earrings are artfully created to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Yellow Gold Stud Earrings (FR)', description: 'These timeless earrings are artfully created to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Yellow Gold Stud Earrings (AR)', description: 'These timeless earrings are artfully created to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 11 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 10 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 7 },
      ]
    },
    {
      sku: 'EARRINGS-1032',
      basePrice: 2642.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7415 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Titanium Pearl Earrings', description: 'These sophisticated earrings are carefully handcrafted to frame your face with magnificent brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Titanium Pearl Earrings (FR)', description: 'These sophisticated earrings are carefully handcrafted to frame your face with magnificent brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Titanium Pearl Earrings (AR)', description: 'These sophisticated earrings are carefully handcrafted to frame your face with magnificent brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 9 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 5 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 4 },
      ]
    },
    {
      sku: 'EARRINGS-1033',
      basePrice: 5978.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7439 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Titanium Pearl Earrings', description: 'These elegant earrings are artfully created to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Titanium Pearl Earrings (FR)', description: 'These elegant earrings are artfully created to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Titanium Pearl Earrings (AR)', description: 'These elegant earrings are artfully created to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 5 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 6 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 4 },
      ]
    },
    {
      sku: 'EARRINGS-1034',
      basePrice: 7091.99,
      featured: true,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7444 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Silver Chandelier Earrings', description: 'These radiant earrings are carefully handcrafted to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Silver Chandelier Earrings (FR)', description: 'These radiant earrings are carefully handcrafted to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Silver Chandelier Earrings (AR)', description: 'These radiant earrings are carefully handcrafted to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 4 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 8 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 4 },
      ]
    },
    {
      sku: 'EARRINGS-1035',
      basePrice: 2935.99,
      featured: true,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7446 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Platinum Diamond Earrings', description: 'These timeless earrings are carefully handcrafted to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Platinum Diamond Earrings (FR)', description: 'These timeless earrings are carefully handcrafted to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Platinum Diamond Earrings (AR)', description: 'These timeless earrings are carefully handcrafted to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 6 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 9 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 8 },
      ]
    },
    {
      sku: 'EARRINGS-1036',
      basePrice: 3796.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7452 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Platinum Diamond Earrings', description: 'These exquisite earrings are artfully created to frame your face with magnificent brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Platinum Diamond Earrings (FR)', description: 'These exquisite earrings are artfully created to frame your face with magnificent brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Platinum Diamond Earrings (AR)', description: 'These exquisite earrings are artfully created to frame your face with magnificent brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 7 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 6 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 6 },
      ]
    },
    {
      sku: 'EARRINGS-1037',
      basePrice: 4185.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7456 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Silver Chandelier Earrings', description: 'These magnificent earrings are expertly designed to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Silver Chandelier Earrings (FR)', description: 'These magnificent earrings are expertly designed to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Silver Chandelier Earrings (AR)', description: 'These magnificent earrings are expertly designed to frame your face with sophisticated brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 9 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 10 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 7 },
      ]
    },
    {
      sku: 'EARRINGS-1038',
      basePrice: 5438.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7466 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Yellow Gold Stud Earrings', description: 'These magnificent earrings are meticulously crafted to frame your face with exquisite brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Yellow Gold Stud Earrings (FR)', description: 'These magnificent earrings are meticulously crafted to frame your face with exquisite brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Yellow Gold Stud Earrings (AR)', description: 'These magnificent earrings are meticulously crafted to frame your face with exquisite brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 10 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 9 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 4 },
      ]
    },
    {
      sku: 'EARRINGS-1039',
      basePrice: 6960.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7470 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Platinum Diamond Earrings', description: 'These elegant earrings are precision engineered to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Platinum Diamond Earrings (FR)', description: 'These elegant earrings are precision engineered to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Platinum Diamond Earrings (AR)', description: 'These elegant earrings are precision engineered to frame your face with radiant brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 11 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 7 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 11 },
      ]
    },
    {
      sku: 'EARRINGS-1040',
      basePrice: 3236.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7473 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Rose Gold Hoop Earrings', description: 'These elegant earrings are meticulously crafted to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Rose Gold Hoop Earrings (FR)', description: 'These elegant earrings are meticulously crafted to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Rose Gold Hoop Earrings (AR)', description: 'These elegant earrings are meticulously crafted to frame your face with stunning brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 9 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 6 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 8 },
      ]
    },
    {
      sku: 'EARRINGS-1041',
      basePrice: 7789.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7491 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Rose Gold Hoop Earrings', description: 'These luxurious earrings are meticulously crafted to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Rose Gold Hoop Earrings (FR)', description: 'These luxurious earrings are meticulously crafted to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Rose Gold Hoop Earrings (AR)', description: 'These luxurious earrings are meticulously crafted to frame your face with elegant brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 4 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 12 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 9 },
      ]
    },
    {
      sku: 'EARRINGS-1042',
      basePrice: 3462.99,
      featured: false,
      categoryId: categoriesMap['earrings'],
      images: ['/images/products/IMG_7494 - Copy.png'],
      translations: [
        { language: 'en', name: 'Exquisite Platinum Diamond Earrings', description: 'These exquisite earrings are carefully handcrafted to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear.' },
        { language: 'fr', name: 'Exquisite Platinum Diamond Earrings (FR)', description: 'These exquisite earrings are carefully handcrafted to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear. (Traduction française)' },
        { language: 'ar', name: 'Exquisite Platinum Diamond Earrings (AR)', description: 'These exquisite earrings are carefully handcrafted to frame your face with luxurious brilliance. Versatile enough for both formal events and daily wear. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 10 },
        { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 8 },
        { type: 'Metal', value: 'Rose Gold', addPrice: 100, inventory: 9 },
      ]
    },
    {
      sku: 'NECKLACES-1043',
      basePrice: 7634.99,
      featured: true,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7504 - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning Silver Choker Necklace', description: 'This stunning necklace is artfully created to add a touch of stunning sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Silver Choker Necklace (FR)', description: 'This stunning necklace is artfully created to add a touch of stunning sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Silver Choker Necklace (AR)', description: 'This stunning necklace is artfully created to add a touch of stunning sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 3 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 5 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 5 },
      ]
    },
    {
      sku: 'NECKLACES-1044',
      basePrice: 1429.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7544.2 - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning Yellow Gold Pendant Necklace', description: 'This sophisticated necklace is meticulously crafted to add a touch of luxurious sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Yellow Gold Pendant Necklace (FR)', description: 'This sophisticated necklace is meticulously crafted to add a touch of luxurious sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Yellow Gold Pendant Necklace (AR)', description: 'This sophisticated necklace is meticulously crafted to add a touch of luxurious sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 12 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 7 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 7 },
      ]
    },
    {
      sku: 'NECKLACES-1045',
      basePrice: 2225.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7570 - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning Silver Choker Necklace', description: 'This timeless necklace is carefully handcrafted to add a touch of exquisite sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Silver Choker Necklace (FR)', description: 'This timeless necklace is carefully handcrafted to add a touch of exquisite sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Silver Choker Necklace (AR)', description: 'This timeless necklace is carefully handcrafted to add a touch of exquisite sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 4 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 4 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 5 },
      ]
    },
    {
      sku: 'NECKLACES-1046',
      basePrice: 6601.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7574 - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning Yellow Gold Pendant Necklace', description: 'This exquisite necklace is carefully handcrafted to add a touch of magnificent sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Yellow Gold Pendant Necklace (FR)', description: 'This exquisite necklace is carefully handcrafted to add a touch of magnificent sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Yellow Gold Pendant Necklace (AR)', description: 'This exquisite necklace is carefully handcrafted to add a touch of magnificent sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 5 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 5 },
      ]
    },
    {
      sku: 'NECKLACES-1047',
      basePrice: 5507.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7583 - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning Titanium Statement Necklace', description: 'This sophisticated necklace is expertly designed to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Titanium Statement Necklace (FR)', description: 'This sophisticated necklace is expertly designed to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Titanium Statement Necklace (AR)', description: 'This sophisticated necklace is expertly designed to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 3 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 5 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 5 },
      ]
    },
    {
      sku: 'NECKLACES-1048',
      basePrice: 8225.99,
      featured: true,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7585 - Copy.png'],
      translations: [
        { language: 'en', name: 'Stunning White Gold Pearl Necklace', description: 'This stunning necklace is carefully handcrafted to add a touch of sophisticated sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning White Gold Pearl Necklace (FR)', description: 'This stunning necklace is carefully handcrafted to add a touch of sophisticated sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning White Gold Pearl Necklace (AR)', description: 'This stunning necklace is carefully handcrafted to add a touch of sophisticated sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 9 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 3 },
      ]
    },
    {
      sku: 'NECKLACES-1049',
      basePrice: 6405.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7587.2.png'],
      translations: [
        { language: 'en', name: 'Stunning Rose Gold Gold Chain', description: 'This magnificent necklace is precision engineered to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Rose Gold Gold Chain (FR)', description: 'This magnificent necklace is precision engineered to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Rose Gold Gold Chain (AR)', description: 'This magnificent necklace is precision engineered to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 11 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 5 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 4 },
      ]
    },
    {
      sku: 'NECKLACES-1050',
      basePrice: 5690.99,
      featured: true,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7587m2.png'],
      translations: [
        { language: 'en', name: 'Stunning Rose Gold Gold Chain', description: 'This elegant necklace is expertly designed to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Rose Gold Gold Chain (FR)', description: 'This elegant necklace is expertly designed to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Rose Gold Gold Chain (AR)', description: 'This elegant necklace is expertly designed to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 11 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 9 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 7 },
      ]
    },
    {
      sku: 'NECKLACES-1051',
      basePrice: 3047.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7589.png'],
      translations: [
        { language: 'en', name: 'Stunning Titanium Statement Necklace', description: 'This luxurious necklace is precision engineered to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Titanium Statement Necklace (FR)', description: 'This luxurious necklace is precision engineered to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Titanium Statement Necklace (AR)', description: 'This luxurious necklace is precision engineered to add a touch of radiant sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 9 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 12 },
      ]
    },
    {
      sku: 'NECKLACES-1052',
      basePrice: 5025.99,
      featured: true,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7621.png'],
      translations: [
        { language: 'en', name: 'Stunning White Gold Pearl Necklace', description: 'This luxurious necklace is expertly designed to add a touch of timeless sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning White Gold Pearl Necklace (FR)', description: 'This luxurious necklace is expertly designed to add a touch of timeless sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning White Gold Pearl Necklace (AR)', description: 'This luxurious necklace is expertly designed to add a touch of timeless sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 3 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 5 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 11 },
      ]
    },
    {
      sku: 'NECKLACES-1053',
      basePrice: 1271.99,
      featured: false,
      categoryId: categoriesMap['necklaces'],
      images: ['/images/products/IMG_7637.png'],
      translations: [
        { language: 'en', name: 'Stunning Titanium Statement Necklace', description: 'This radiant necklace is precision engineered to add a touch of magnificent sophistication to any outfit. A statement piece that draws admiring glances.' },
        { language: 'fr', name: 'Stunning Titanium Statement Necklace (FR)', description: 'This radiant necklace is precision engineered to add a touch of magnificent sophistication to any outfit. A statement piece that draws admiring glances. (Traduction française)' },
        { language: 'ar', name: 'Stunning Titanium Statement Necklace (AR)', description: 'This radiant necklace is precision engineered to add a touch of magnificent sophistication to any outfit. A statement piece that draws admiring glances. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 11 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 5 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 9 },
      ]
    },
    {
      sku: 'WATCHES-1054',
      basePrice: 1357.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_7641,2.png'],
      translations: [
        { language: 'en', name: 'Precision Yellow Gold Luxury Timepiece', description: 'This elegant timepiece is artfully created to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Yellow Gold Luxury Timepiece (FR)', description: 'This elegant timepiece is artfully created to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Yellow Gold Luxury Timepiece (AR)', description: 'This elegant timepiece is artfully created to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 6 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 5 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 3 },
      ]
    },
    {
      sku: 'BRACELETS-1055',
      basePrice: 4743.99,
      featured: true,
      categoryId: categoriesMap['bracelets'],
      images: ['/images/products/IMG_7719.png'],
      translations: [
        { language: 'en', name: 'Luxurious Rose Gold Gold Bracelet', description: 'This radiant bracelet is artfully created to adorn your wrist with radiant elegance. A versatile piece that complements any attire.' },
        { language: 'fr', name: 'Luxurious Rose Gold Gold Bracelet (FR)', description: 'This radiant bracelet is artfully created to adorn your wrist with radiant elegance. A versatile piece that complements any attire. (Traduction française)' },
        { language: 'ar', name: 'Luxurious Rose Gold Gold Bracelet (AR)', description: 'This radiant bracelet is artfully created to adorn your wrist with radiant elegance. A versatile piece that complements any attire. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 9 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 4 },
      ]
    },
    {
      sku: 'BRACELETS-1056',
      basePrice: 7503.99,
      featured: false,
      categoryId: categoriesMap['bracelets'],
      images: ['/images/products/IMG_7793.png'],
      translations: [
        { language: 'en', name: 'Luxurious Titanium Link Bracelet', description: 'This magnificent bracelet is carefully handcrafted to adorn your wrist with exquisite elegance. A versatile piece that complements any attire.' },
        { language: 'fr', name: 'Luxurious Titanium Link Bracelet (FR)', description: 'This magnificent bracelet is carefully handcrafted to adorn your wrist with exquisite elegance. A versatile piece that complements any attire. (Traduction française)' },
        { language: 'ar', name: 'Luxurious Titanium Link Bracelet (AR)', description: 'This magnificent bracelet is carefully handcrafted to adorn your wrist with exquisite elegance. A versatile piece that complements any attire. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 4 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 6 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 12 },
      ]
    },
    {
      sku: 'BRACELETS-1057',
      basePrice: 3505.99,
      featured: false,
      categoryId: categoriesMap['bracelets'],
      images: ['/images/products/IMG_7810.png'],
      translations: [
        { language: 'en', name: 'Luxurious Silver Diamond Bracelet', description: 'This radiant bracelet is meticulously crafted to adorn your wrist with radiant elegance. A versatile piece that complements any attire.' },
        { language: 'fr', name: 'Luxurious Silver Diamond Bracelet (FR)', description: 'This radiant bracelet is meticulously crafted to adorn your wrist with radiant elegance. A versatile piece that complements any attire. (Traduction française)' },
        { language: 'ar', name: 'Luxurious Silver Diamond Bracelet (AR)', description: 'This radiant bracelet is meticulously crafted to adorn your wrist with radiant elegance. A versatile piece that complements any attire. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 6 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 6 },
      ]
    },
    {
      sku: 'BRACELETS-1058',
      basePrice: 4039.99,
      featured: false,
      categoryId: categoriesMap['bracelets'],
      images: ['/images/products/IMG_7839.png'],
      translations: [
        { language: 'en', name: 'Luxurious Rose Gold Gold Bracelet', description: 'This radiant bracelet is artfully created to adorn your wrist with luxurious elegance. A versatile piece that complements any attire.' },
        { language: 'fr', name: 'Luxurious Rose Gold Gold Bracelet (FR)', description: 'This radiant bracelet is artfully created to adorn your wrist with luxurious elegance. A versatile piece that complements any attire. (Traduction française)' },
        { language: 'ar', name: 'Luxurious Rose Gold Gold Bracelet (AR)', description: 'This radiant bracelet is artfully created to adorn your wrist with luxurious elegance. A versatile piece that complements any attire. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 11 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 11 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 5 },
      ]
    },
    {
      sku: 'BRACELETS-1059',
      basePrice: 2330.99,
      featured: false,
      categoryId: categoriesMap['bracelets'],
      images: ['/images/products/IMG_7841.png'],
      translations: [
        { language: 'en', name: 'Luxurious Titanium Link Bracelet', description: 'This elegant bracelet is precision engineered to adorn your wrist with magnificent elegance. A versatile piece that complements any attire.' },
        { language: 'fr', name: 'Luxurious Titanium Link Bracelet (FR)', description: 'This elegant bracelet is precision engineered to adorn your wrist with magnificent elegance. A versatile piece that complements any attire. (Traduction française)' },
        { language: 'ar', name: 'Luxurious Titanium Link Bracelet (AR)', description: 'This elegant bracelet is precision engineered to adorn your wrist with magnificent elegance. A versatile piece that complements any attire. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Length', value: '16cm', addPrice: 0, inventory: 10 },
        { type: 'Length', value: '18cm', addPrice: 0, inventory: 6 },
        { type: 'Length', value: '20cm', addPrice: 100, inventory: 11 },
      ]
    },
    {
      sku: 'WATCHES-1060',
      basePrice: 7987.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_7991.jpg'],
      translations: [
        { language: 'en', name: 'Precision Titanium Diamond Watch', description: 'This timeless timepiece is artfully created to combine stunning style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Titanium Diamond Watch (FR)', description: 'This timeless timepiece is artfully created to combine stunning style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Titanium Diamond Watch (AR)', description: 'This timeless timepiece is artfully created to combine stunning style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 4 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 7 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 5 },
      ]
    },
    {
      sku: 'WATCHES-1061',
      basePrice: 2509.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8012.png'],
      translations: [
        { language: 'en', name: 'Precision Yellow Gold Luxury Timepiece', description: 'This stunning timepiece is artfully created to combine radiant style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Yellow Gold Luxury Timepiece (FR)', description: 'This stunning timepiece is artfully created to combine radiant style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Yellow Gold Luxury Timepiece (AR)', description: 'This stunning timepiece is artfully created to combine radiant style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 5 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 7 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 6 },
      ]
    },
    {
      sku: 'WATCHES-1062',
      basePrice: 1779.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8016.png'],
      translations: [
        { language: 'en', name: 'Precision Platinum Automatic Watch', description: 'This exquisite timepiece is meticulously crafted to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Platinum Automatic Watch (FR)', description: 'This exquisite timepiece is meticulously crafted to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Platinum Automatic Watch (AR)', description: 'This exquisite timepiece is meticulously crafted to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 5 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 7 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 3 },
      ]
    },
    {
      sku: 'WATCHES-1063',
      basePrice: 2191.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8021.png'],
      translations: [
        { language: 'en', name: 'Precision Titanium Diamond Watch', description: 'This radiant timepiece is carefully handcrafted to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Titanium Diamond Watch (FR)', description: 'This radiant timepiece is carefully handcrafted to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Titanium Diamond Watch (AR)', description: 'This radiant timepiece is carefully handcrafted to combine sophisticated style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 5 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 4 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 7 },
      ]
    },
    {
      sku: 'WATCHES-1064',
      basePrice: 4801.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8043.png'],
      translations: [
        { language: 'en', name: 'Precision Rose Gold Dress Watch', description: 'This magnificent timepiece is artfully created to combine stunning style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Rose Gold Dress Watch (FR)', description: 'This magnificent timepiece is artfully created to combine stunning style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Rose Gold Dress Watch (AR)', description: 'This magnificent timepiece is artfully created to combine stunning style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 3 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 5 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 3 },
      ]
    },
    {
      sku: 'WATCHES-1065',
      basePrice: 1193.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8060.png'],
      translations: [
        { language: 'en', name: 'Precision Yellow Gold Luxury Timepiece', description: 'This magnificent timepiece is carefully handcrafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Yellow Gold Luxury Timepiece (FR)', description: 'This magnificent timepiece is carefully handcrafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Yellow Gold Luxury Timepiece (AR)', description: 'This magnificent timepiece is carefully handcrafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 4 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 7 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 7 },
      ]
    },
    {
      sku: 'WATCHES-1066',
      basePrice: 5287.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8145.png'],
      translations: [
        { language: 'en', name: 'Precision Rose Gold Dress Watch', description: 'This exquisite timepiece is artfully created to combine radiant style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Rose Gold Dress Watch (FR)', description: 'This exquisite timepiece is artfully created to combine radiant style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Rose Gold Dress Watch (AR)', description: 'This exquisite timepiece is artfully created to combine radiant style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 3 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 6 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 5 },
      ]
    },
    {
      sku: 'WATCHES-1067',
      basePrice: 3432.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8570.png'],
      translations: [
        { language: 'en', name: 'Precision Yellow Gold Luxury Timepiece', description: 'This exquisite timepiece is precision engineered to combine elegant style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Yellow Gold Luxury Timepiece (FR)', description: 'This exquisite timepiece is precision engineered to combine elegant style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Yellow Gold Luxury Timepiece (AR)', description: 'This exquisite timepiece is precision engineered to combine elegant style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 6 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 3 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 3 },
      ]
    },
    {
      sku: 'WATCHES-1068',
      basePrice: 7254.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8578.png'],
      translations: [
        { language: 'en', name: 'Precision Silver Swiss Watch', description: 'This stunning timepiece is carefully handcrafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Silver Swiss Watch (FR)', description: 'This stunning timepiece is carefully handcrafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Silver Swiss Watch (AR)', description: 'This stunning timepiece is carefully handcrafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 3 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 5 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 3 },
      ]
    },
    {
      sku: 'WATCHES-1069',
      basePrice: 5690.99,
      featured: true,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8582.png'],
      translations: [
        { language: 'en', name: 'Precision Yellow Gold Luxury Timepiece', description: 'This exquisite timepiece is carefully handcrafted to combine elegant style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Yellow Gold Luxury Timepiece (FR)', description: 'This exquisite timepiece is carefully handcrafted to combine elegant style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Yellow Gold Luxury Timepiece (AR)', description: 'This exquisite timepiece is carefully handcrafted to combine elegant style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 4 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 4 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 7 },
      ]
    },
    {
      sku: 'WATCHES-1070',
      basePrice: 7443.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8586.png'],
      translations: [
        { language: 'en', name: 'Precision Platinum Automatic Watch', description: 'This stunning timepiece is precision engineered to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Platinum Automatic Watch (FR)', description: 'This stunning timepiece is precision engineered to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Platinum Automatic Watch (AR)', description: 'This stunning timepiece is precision engineered to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 4 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 4 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 6 },
      ]
    },
    {
      sku: 'WATCHES-1071',
      basePrice: 6177.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8611.png'],
      translations: [
        { language: 'en', name: 'Precision White Gold Chronograph Watch', description: 'This magnificent timepiece is artfully created to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision White Gold Chronograph Watch (FR)', description: 'This magnificent timepiece is artfully created to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision White Gold Chronograph Watch (AR)', description: 'This magnificent timepiece is artfully created to combine exquisite style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 7 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 4 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 4 },
      ]
    },
    {
      sku: 'WATCHES-1072',
      basePrice: 4325.99,
      featured: false,
      categoryId: categoriesMap['watches'],
      images: ['/images/products/IMG_8620.png'],
      translations: [
        { language: 'en', name: 'Precision Silver Swiss Watch', description: 'This magnificent timepiece is meticulously crafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer.' },
        { language: 'fr', name: 'Precision Silver Swiss Watch (FR)', description: 'This magnificent timepiece is meticulously crafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer. (Traduction française)' },
        { language: 'ar', name: 'Precision Silver Swiss Watch (AR)', description: 'This magnificent timepiece is meticulously crafted to combine luxurious style with precision engineering. A mark of distinction for the discerning wearer. (الترجمة العربية)' },
      ],
      variations: [
        { type: 'Material', value: 'Steel', addPrice: 0, inventory: 3 },
        { type: 'Material', value: 'Gold', addPrice: 2000, inventory: 5 },
        { type: 'Material', value: 'Titanium', addPrice: 1000, inventory: 4 },
      ]
    },
  ];

  // Create products and their variations
  const createdProducts: Record<string, any> = {};
  
  for (const product of products) {
    try {
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
    } catch (error) {
      console.error(`Error creating product ${product.sku}:`, error);
    }
  }
  
  console.log(`✅ Created ${Object.keys(createdProducts).length} products with variations`);
  return createdProducts;
}

// Export the function
export default seedProducts;
