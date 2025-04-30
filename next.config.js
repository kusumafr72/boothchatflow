// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    // If you're on Next.js 15.2.3 or later:
    allowedDevOrigins: [
      'http://localhost:3000',       // your usual dev URL
      'http://192.168.1.9:3000',     // the LAN IP you’re using
    ],
  
    // If you’re still on 15.2.2 (or earlier in the 15.x line),
  // uncomment the block below instead of the root prop above:
  //  experimental: {
  //    allowedDevOrigins: [
  //      'http://localhost:3000',
  //      'http://192.168.1.9:3000',
  //    ],
  //  },
  };
  
  export default nextConfig;