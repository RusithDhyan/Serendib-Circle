/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
  domains: ['serendib.serendibhotels.mw','localhost'], // ✅ only hostnames
},
    transpilePackages: ['react-leaflet'],

};
export default nextConfig;
