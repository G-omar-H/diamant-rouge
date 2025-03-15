// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ['en', 'fr', 'ar'],
        defaultLocale: 'en',
    },
    eslint: {
        // Allow production builds to successfully complete
        // even if your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['amantys.fr', 'localhost'], // Add your image domain here
    },
    // other config if needed...
}

module.exports = nextConfig;