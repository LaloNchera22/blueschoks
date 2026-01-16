import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Soluciona el error "Body exceeded 1 MB limit"
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Permite imágenes de cualquier proyecto Supabase
      },
    ],
  },
};

export default nextConfig;