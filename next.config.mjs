/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
  domains: ['serendib.serendibhotels.mw','localhost','lh3.googleusercontent.com'], // ✅ only hostnames
},
    transpilePackages: ['react-leaflet'],

};
export default nextConfig;
