import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 🚨 Ignore ESLint errors at build time (Netlify won't fail)
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['utfs.io', 'lh3.googleusercontent.com'], 
  },
};

export default nextConfig;
