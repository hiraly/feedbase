import withPWA from 'next-pwa';
/** @type {import('next').NextConfig} */
import { env } from './env.mjs';

let hostPath = ['http', 'localhost', '3000'];
if (env.NEXT_PUBLIC_SUPABASE_URL) {
  hostPath = env.NEXT_PUBLIC_SUPABASE_URL.split(':');
}

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@feedbase/ui'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/changelog-images/**',
      },
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/workspaces/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:slug/board/:id',
        destination: '/:slug',
      },
    ];
  },
};

export default pwaConfig(nextConfig);
