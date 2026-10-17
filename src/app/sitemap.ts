import type { MetadataRoute } from 'next';

// Required for `output: 'export'`, which rejects route handlers without a static config.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourin.my.id',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
