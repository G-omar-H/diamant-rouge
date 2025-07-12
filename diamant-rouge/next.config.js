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
        // Custom loader for our image optimization API
        loader: process.env.NODE_ENV === 'production' ? 'custom' : 'default',
        loaderFile: process.env.NODE_ENV === 'production' ? './lib/imageLoader.js' : undefined,
    },
    // Aggressive file tracing exclusions for image API
    outputFileTracingExcludes: {
        '/api/images/optimize': [
            './public/**/*',
            './public/images/**/*',
            './public/uploads/**/*',
            './public/videos/**/*',
            './**/*.jpg',
            './**/*.jpeg',
            './**/*.png',
            './**/*.gif',
            './**/*.svg',
            './**/*.webp',
            './**/*.mp4',
            './**/*.mov',
            './**/*.avi'
        ],
    },
    // Configure webpack to optimize bundle size
    webpack: (config, { isServer, nextRuntime }) => {
        // Optimize for serverless functions
        if (isServer && nextRuntime === 'nodejs') {
            // External dependencies to reduce bundle size
            config.externals = config.externals || [];
            config.externals.push({
                'sharp': 'commonjs sharp'
            });
        }
        return config;
    },
    // other config if needed...
}

module.exports = nextConfig;