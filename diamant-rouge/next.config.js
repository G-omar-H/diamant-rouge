// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ['fr', 'en', 'ar'],
        defaultLocale: 'fr',
        localeDetection: false,  // Changed from true to false to resolve the warning
    },
    eslint: {
        // Allow production builds to successfully complete
        // even if your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true, // This will bypass Next.js image optimization
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'amantys.fr',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '*.vercel.app',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '*.githubusercontent.com',
                pathname: '**',
            }
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        domains: ['github.com', 'raw.githubusercontent.com'], // Add explicit domains
    },
    // other config if needed...
}

module.exports = nextConfig;