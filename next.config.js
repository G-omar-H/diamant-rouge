/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['diamant-rouge.vercel.app'],
    formats: ['image/avif', 'image/webp', 'image/jpeg', 'image/png'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'diamant-rouge.vercel.app',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: process.env.NODE_ENV === 'development',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: 'asset/resource',
    });
    return config;
  },
}

module.exports = nextConfig 