import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import type { Product, ProductTranslation, Category, CategoryTranslation, Prisma } from '@prisma/client';

type ProductWithRelations = Product & {
  translations: ProductTranslation[];
  category?: Category & {
    translations: CategoryTranslation[];
  } | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q: query, limit = 10, category, locale = 'fr' } = req.query;
  const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : 10;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Query parameter required' });
  }

  try {
    // Build the search query with optimizations
    const searchConditions: Prisma.ProductWhereInput = {
      OR: [
        // Search product names through translations
        {
          translations: {
            some: {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            }
          }
        },
        // Also search product descriptions
        {
          translations: {
            some: {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            }
          }
        }
      ]
    };

    // Add category filter if provided
    if (category && typeof category === 'string') {
      searchConditions.AND = [
        {
          category: {
            slug: category
          }
        }
      ];
    }

    // Optimize query performance with selective fields and ordering
    const products = await prisma.product.findMany({
      where: searchConditions,
      include: {
        translations: true,
        category: {
          include: {
            translations: true
          }
        }
      },
      take: limitNum,
      orderBy: {
        featured: 'desc' // Show featured products first
      }
    });

    // Format the search results optimized for the current locale
    const currentLocale = typeof locale === 'string' ? locale : 'fr';
    
    const formattedResults = products.map((product: ProductWithRelations) => {
      // Get translation for the current locale or fall back to default
      const translation = product.translations.find(
        (t: ProductTranslation) => t.language === currentLocale
      ) || product.translations.find(
        (t: ProductTranslation) => t.language === 'fr'
      ) || product.translations[0];
      
      // Get category translation for the current locale
      const categoryTranslation = product.category?.translations.find(
        (t: CategoryTranslation) => t.language === currentLocale
      ) || product.category?.translations.find(
        (t: CategoryTranslation) => t.language === 'fr'
      ) || product.category?.translations[0];
      
      return {
        id: product.id,
        sku: product.sku,
        name: translation?.name || '',
        description: translation?.description || '',
        price: product.basePrice,
        category: product.category?.slug || '',
        categoryName: categoryTranslation?.name || '',
        image: product.images[0] || '',
        images: product.images,
        featured: product.featured
      };
    });

    // Cache search results for 5 minutes (300 seconds)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    return res.status(200).json({
      results: formattedResults,
      total: formattedResults.length,
      query: query,
      category: category || 'all'
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'An error occurred during search' });
  }
} 