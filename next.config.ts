/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... otras configuraciones que ya tengas ...
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Esto permite imágenes de CUALQUIER dominio https
      },
    ],
  },
};

export default nextConfig;