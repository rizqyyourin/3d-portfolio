import type { MetadataRoute } from 'next';

// Required for `output: 'export'`, which rejects route handlers without a static config.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourin.my.id/sitemap.xml',
  };
}
