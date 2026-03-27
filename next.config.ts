import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextConfig: NextConfig & { eslint?: any } = {
  typescript: {
    // Permite desplegar en producción aunque existan advertencias de tipos
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permite desplegar aunque existan advertencias de ESLint
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
