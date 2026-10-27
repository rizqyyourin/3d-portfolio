import type { MetadataRoute } from 'next';
import { freeCodeCamp } from '@/lib/freecodecamp';
import { githubContributions } from '@/lib/github';

// Required for `output: 'export'`, which rejects route handlers without a static config.
export const dynamic = 'force-static';

// `new Date()` moved lastmod on every deploy, even when nothing on the page changed, which
// teaches crawlers to ignore it. The newest build-time snapshot only moves when the rendered
// content actually does; bump it by hand if you edit page copy without refreshing a snapshot.
const lastModified = new Date(Math.max(
  Date.parse(freeCodeCamp.syncedAt),
  Date.parse(githubContributions.syncedAt),
));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourin.my.id',
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
