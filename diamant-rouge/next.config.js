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
            }
        ],
        unoptimized: process.env.NODE_ENV === 'development',
    },
    // other config if needed...
}

module.exports = nextConfig;