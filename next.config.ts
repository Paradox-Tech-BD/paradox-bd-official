import type { NextConfig } from 'next';
import { fetchRedirects } from '@/sanity/lib/fetch-redirects';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
    ],
  },
  async redirects() {
    return await fetchRedirects();
  },
};

export default nextConfig;