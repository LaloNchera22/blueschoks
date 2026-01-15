import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ESTO PERMITE CARGAR IMÁGENES DE CUALQUIER LUGAR
      },
    ],
  },
};

export default nextConfig;