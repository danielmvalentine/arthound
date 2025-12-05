import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nrs.harvard.edu',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ids.lib.harvard.edu',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;