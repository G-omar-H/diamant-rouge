// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ✅ Create Categories
    console.log('🔹 Creating categories...');
    const ringsCategory = await prisma.category.upsert({
        where: { slug: 'rings' },
        update: {},
        create: {
            slug: 'rings',
            translations: {
                create: [
                    {
                        language: 'en',
                        name: 'Luxury Rings',
                        description: 'Exquisite rings crafted with precision, symbolizing love and heritage.',
                    },
                    {
                        language: 'fr',
                        name: 'Bagues de Luxe',
                        description: 'Bagues exquises conçues avec précision, symbolisant l\'amour et l\'héritage.',
                    },
                    {
                        language: 'ar',
                        name: 'خواتم فاخرة',
                        description: 'خواتم رائعة مصممة بدقة ترمز إلى الحب والتراث.',
                    },
                ],
            },
        },
    });

    const braceletsCategory = await prisma.category.upsert({
        where: { slug: 'bracelets' },
        update: {},
        create: {
            slug: 'bracelets',
            translations: {
                create: [
                    {
                        language: 'en',
                        name: 'Elegant Bracelets',
                        description: 'Timeless bracelets adorned with the finest diamonds and gold.',
                    },
                    {
                        language: 'fr',
                        name: 'Bracelets Élégants',
                        description: 'Bracelets intemporels ornés des plus beaux diamants et de l\'or.',
                    },
                    {
                        language: 'ar',
                        name: 'أساور أنيقة',
                        description: 'أساور خالدة مزينة بأجود الألماس والذهب.',
                    },
                ],
            },
        },
    });

    const necklacesCategory = await prisma.category.upsert({
        where: { slug: 'necklaces' },
        update: {},
        create: {
            slug: 'necklaces',
            translations: {
                create: [
                    {
                        language: 'en',
                        name: 'Exquisite Necklaces',
                        description: 'Beautifully crafted necklaces that capture elegance and timeless beauty.',
                    },
                    {
                        language: 'fr',
                        name: 'Colliers Exquis',
                        description: 'Colliers magnifiquement conçus qui capturent l\'élégance et la beauté intemporelle.',
                    },
                    {
                        language: 'ar',
                        name: 'قلادات راقية',
                        description: 'قلادات مصنوعة بإتقان تجسد الأناقة والجمال الخالد.',
                    },
                ],
            },
        },
    });

    // ✅ Create Products
    console.log('🔹 Creating products...');
    const rougePassionRing = await prisma.product.upsert({
        where: { sku: 'ROUGE-PASSION-001' },
        update: {},
        create: {
            sku: 'ROUGE-PASSION-001',
            basePrice: 4999.99,
            categoryId: ringsCategory.id,
            images: ['/images/products/rings/rouge-passion-01.jpg', '/images/products/rings/rouge-passion-02.jpg'],
            translations: {
                create: [
                    {
                        language: 'en',
                        name: 'Rouge Passion Diamond Ring',
                        description: 'A symbol of eternal love, set with a rare crimson diamond.',
                    },
                    {
                        language: 'fr',
                        name: 'Bague Diamant Rouge Passion',
                        description: "Un symbole d'amour éternel, serti d'un diamant rouge rare.",
                    },
                    {
                        language: 'ar',
                        name: 'خاتم الألماس روج باشون',
                        description: 'رمز الحب الأبدي، مرصع بألماس قرمزي نادر.',
                    },
                ],
            },
        },
    });

    const imperialBracelet = await prisma.product.upsert({
        where: { sku: 'IMPERIAL-BRACELET-001' },
        update: {},
        create: {
            sku: 'IMPERIAL-BRACELET-001',
            basePrice: 2999.99,
            categoryId: braceletsCategory.id,
            images: ['/images/products/bracelets/imperial-gold-01.jpg', '/images/products/bracelets/imperial-gold-02.jpg'],
            translations: {
                create: [
                    {
                        language: 'en',
                        name: 'Imperial Gold Bracelet',
                        description: 'A royal statement of elegance, crafted from 24k pure gold.',
                    },
                    {
                        language: 'fr',
                        name: 'Bracelet Impérial en Or',
                        description: 'Une déclaration royale d\'élégance, fabriquée en or pur 24 carats.',
                    },
                    {
                        language: 'ar',
                        name: 'سوار الإمبراطورية الذهبي',
                        description: 'تصريح ملكي بالأناقة، مصنوع من الذهب الخالص عيار 24.',
                    },
                ],
            },
        },
    });

    const divinePearlNecklace = await prisma.product.upsert({
        where: { sku: 'DIVINE-PEARL-001' },
        update: {},
        create: {
            sku: 'DIVINE-PEARL-001',
            basePrice: 3499.99,
            categoryId: necklacesCategory.id,
            images: ['/images/products/necklaces/divine-pearl-01.jpg', '/images/products/necklaces/divine-pearl-02.jpg'],
            translations: {
                create: [
                    {
                        language: 'en',
                        name: 'Divine Pearl Necklace',
                        description: 'Exquisite South Sea pearls arranged in a cascading design, showcasing timeless elegance.',
                    },
                    {
                        language: 'fr',
                        name: 'Collier Perle Divine',
                        description: 'Perles exquises des mers du Sud disposées en cascade, incarnant l\'élégance intemporelle.',
                    },
                    {
                        language: 'ar',
                        name: 'قلادة اللؤلؤ الإلهي',
                        description: 'لآلئ بحر الجنوب الفاخرة مرتبة في تصميم متدرج، تُظهر الأناقة الخالدة.',
                    },
                ],
            },
        },
    });

    // ✅ Create Product Variations
    console.log('🔹 Adding product variations...');
    await prisma.productVariation.createMany({
        data: [
            // Ring sizes
            {
                productId: rougePassionRing.id,
                variationType: 'Size',
                variationValue: '48',
                additionalPrice: 0,
                inventory: 5,
            },
            {
                productId: rougePassionRing.id,
                variationType: 'Size',
                variationValue: '50',
                additionalPrice: 0,
                inventory: 7,
            },
            {
                productId: rougePassionRing.id,
                variationType: 'Size',
                variationValue: '52',
                additionalPrice: 0,
                inventory: 10,
            },
            {
                productId: rougePassionRing.id,
                variationType: 'Size',
                variationValue: '54',
                additionalPrice: 0,
                inventory: 8,
            },
            {
                productId: rougePassionRing.id,
                variationType: 'Size',
                variationValue: '56',
                additionalPrice: 0,
                inventory: 6,
            },
            // Bracelet sizes
            {
                productId: imperialBracelet.id,
                variationType: 'Length',
                variationValue: '16cm',
                additionalPrice: 0,
                inventory: 12,
            },
            {
                productId: imperialBracelet.id,
                variationType: 'Length',
                variationValue: '18cm',
                additionalPrice: 0,
                inventory: 15,
            },
            {
                productId: imperialBracelet.id,
                variationType: 'Length',
                variationValue: '20cm',
                additionalPrice: 100,
                inventory: 8,
            },
            // Necklace lengths
            {
                productId: divinePearlNecklace.id,
                variationType: 'Length',
                variationValue: '42cm',
                additionalPrice: 0,
                inventory: 10,
            },
            {
                productId: divinePearlNecklace.id,
                variationType: 'Length',
                variationValue: '45cm',
                additionalPrice: 0,
                inventory: 12,
            },
            {
                productId: divinePearlNecklace.id,
                variationType: 'Length',
                variationValue: '50cm',
                additionalPrice: 200,
                inventory: 8,
            },
        ],
    });

    // ✅ Create Users
    console.log('🔹 Creating users...');

    await prisma.user.upsert({
        where: { email: 'customer@diamant-rouge.com' },
        update: {},
        create: {
            email: 'customer@diamant-rouge.com',
            password: await bcrypt.hash('customer123', 10),
            name: 'Sophie Dupont',
            role: 'customer',
            address: '23 Avenue des Champs-Élysées',
            city: 'Paris',
            postalCode: '75008',
            country: 'France',
            phoneNumber: '+33612345678',
            memberStatus: 'gold',
            preferredMetals: ['Or Jaune', 'Or Rose'],
            preferredGemstones: ['Diamant', 'Rubis', 'Perle'],
            ringSize: '52',
            braceletSize: '16cm',
            necklaceLength: '42cm'
        },
    });

    await prisma.user.upsert({
        where: { email: 'vip@diamant-rouge.com' },
        update: {},
        create: {
            email: 'vip@diamant-rouge.com',
            password: await bcrypt.hash('vip123', 10),
            name: 'Isabelle Laurent',
            role: 'customer',
            address: '128 Boulevard Saint-Germain',
            city: 'Paris',
            postalCode: '75006',
            country: 'France',
            phoneNumber: '+33687654321',
            memberStatus: 'vip',
            preferredMetals: ['Platine', 'Or Blanc'],
            preferredGemstones: ['Diamant', 'Saphir', 'Émeraude'],
            ringSize: '54',
            braceletSize: '17cm',
            necklaceLength: '45cm'
        },
    });

    await prisma.user.upsert({
        where: { email: 'admin@diamant-rouge.com' },
        update: {},
        create: {
            email: 'admin@diamant-rouge.com',
            password: await bcrypt.hash('admin123', 10),
            name: 'Diamant Rouge Admin',
            role: 'admin',
            memberStatus: 'vip',
            preferredMetals: ['Or Blanc', 'Platine'],
            preferredGemstones: ['Diamant', 'Saphir'],
            ringSize: '54',
            braceletSize: '18cm',
            necklaceLength: '45cm'
        },
    });

    console.log('✅ Users created.');

    // ✅ Create Sample Orders
    console.log('🔹 Creating sample orders...');
    
    // Order for regular customer
    await prisma.order.create({
        data: {
            userId: 1, // Sophie Dupont
            totalAmount: 4999.99,
            status: 'DELIVERED',
            paymentMethod: 'CREDIT_CARD',
            shippingAddress: '23 Avenue des Champs-Élysées',
            city: 'Paris',
            postalCode: '75008',
            country: 'France',
            orderItems: {
                create: [
                    {
                        productId: rougePassionRing.id,
                        quantity: 1,
                        price: 4999.99,
                    },
                ],
            },
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
    });

    // Recent order for regular customer
    await prisma.order.create({
        data: {
            userId: 1, // Sophie Dupont
            totalAmount: 2999.99,
            status: 'SHIPPED',
            paymentMethod: 'CREDIT_CARD',
            shippingAddress: '23 Avenue des Champs-Élysées',
            city: 'Paris',
            postalCode: '75008',
            country: 'France',
            orderItems: {
                create: [
                    {
                        productId: imperialBracelet.id,
                        quantity: 1,
                        price: 2999.99,
                    },
                ],
            },
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
    });

    // Order for VIP customer
    await prisma.order.create({
        data: {
            userId: 2, // Isabelle Laurent
            totalAmount: 8499.98,
            status: 'PROCESSING',
            paymentMethod: 'BANK_TRANSFER',
            shippingAddress: '128 Boulevard Saint-Germain',
            city: 'Paris',
            postalCode: '75006',
            country: 'France',
            orderItems: {
                create: [
                    {
                        productId: rougePassionRing.id,
                        quantity: 1,
                        price: 4999.99,
                    },
                    {
                        productId: divinePearlNecklace.id,
                        quantity: 1,
                        price: 3499.99,
                    },
                ],
            },
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
    });

    console.log('✅ Sample orders created.');
    console.log('🎉 Database seeding completed!');
}

main()
    .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
