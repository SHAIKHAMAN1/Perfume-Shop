/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Turbopack to correctly bundle framer-motion ESM packages
  transpilePackages: ["framer-motion", "motion-dom", "motion"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },       // Cloudinary (Phase 4)
      { protocol: "https", hostname: "images.unsplash.com" },      // Dev placeholders
    ],
  },
};

export default nextConfig;
