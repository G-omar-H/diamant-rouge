// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ['en', 'fr', 'ar'],
        defaultLocale: 'en',
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
        ],
    },
    // other config if needed...
}

module.exports = nextConfig;