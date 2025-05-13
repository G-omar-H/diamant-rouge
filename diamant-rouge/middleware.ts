import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that should have cache prevention headers
const CACHE_PREVENTION_ROUTES = [
  '/profile', 
  '/admin/orders', 
  '/api/admin/orders',
  '/api/user',
  '/order',
  '/collections',  // Add collections to prevent caching issues
  '/jewelry',      // Add jewelry to prevent caching issues
  '/the-house',    // Add the-house to prevent caching issues
  '/contact'       // Add contact to prevent caching issues
];

// Navigation routes that should not be shallow-rendered
const NAVIGATION_ROUTES = [
  '/collections',
  '/jewelry',
  '/the-house',
  '/contact',
  '/profile',
  '/appointments'
];

export function middleware(request: NextRequest) {
  const { pathname, search, locale } = request.nextUrl;
  
  // Apply no-cache headers to dynamic routes that need real-time updates
  const shouldPreventCaching = CACHE_PREVENTION_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // Handle main navigation links
  const isNavigationRoute = NAVIGATION_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // Enhanced debugging for navigation issues
  console.log(`[Middleware] Processing: ${pathname}${search}, Locale: ${locale}, Navigation route: ${isNavigationRoute}`);
  
  // Special handling for collections page
  const isCollectionsPage = pathname.startsWith('/collections');
  
  // Create response with proper headers
  const response = NextResponse.next();
  
  if (shouldPreventCaching) {
    // Set aggressive cache control headers to prevent caching completely
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }
  
  // Add headers to help debug i18n issues
  if (isNavigationRoute) {
    response.headers.set('X-Navigation-Route', 'true');
    response.headers.set('X-Locale', locale || 'default');
    
    // Special handling for collections
    if (isCollectionsPage) {
      response.headers.set('X-Collections-Page', 'true');
      response.headers.set('X-Query-Params', search || 'none');
    }
  }
  
  return response;
}

// Update matcher to include all routes that need middleware processing
export const config = {
  matcher: [
    '/profile/:path*', 
    '/admin/:path*', 
    '/api/:path*', 
    '/order/:path*',
    '/collections/:path*',
    '/jewelry/:path*',
    '/the-house/:path*',
    '/contact/:path*',
    '/appointments/:path*'
  ],
}; 