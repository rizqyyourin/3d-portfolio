import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  // The portfolio is fully client-rendered, so it ships as a static export and is served by
  // Cloudflare Workers static assets. See AGENTS.md and README.md before adding server features.
  output: 'export',
  // The default next/image loader needs a server. Images are pre-optimized to WebP in
  // public/images by scripts/optimize-images.mjs instead.
  images: { unoptimized: true },
};

export default nextConfig;
