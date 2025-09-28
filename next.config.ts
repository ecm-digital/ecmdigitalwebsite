import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: false,
  },
  // Disable TypeScript checks during development
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    }
    return config
  }
}

export default nextConfig