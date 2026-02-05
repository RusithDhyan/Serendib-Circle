/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'serendib.serendibhotels.mw',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/uploads/**',
      },
    ],
    localPatterns: [
      {
        pathname: "/api/uploads/**",
      },
      {
        pathname: "/all-images/**"
      }
    ],
  },
  transpilePackages: ['react-leaflet'],
};

export default nextConfig;
