import type { Metadata } from 'next';
import './globals.css';
import { satoshi } from './fonts';

const SITE_URL = 'https://yourin.my.id';
const TITLE = 'Ahmad Rizqy Yourin: Fullstack Developer';
// 151 characters, so Google shows the whole description instead of truncating it.
const DESCRIPTION = 'Fullstack developer in Jakarta building thoughtful interfaces and reliable systems with Next.js, Laravel, and Go. See my projects, stack, and services.';
// Cloudflare Web Analytics site token. It belongs to the existing Web Analytics site for
// yourin.my.id, so the beacon is written into the HTML instead of relying on the zone's
// automatic injection.
const ANALYTICS_TOKEN = '9d7b9b3c3fed4a20b79c90746e7829bc';

const PROFILES = [
  'https://github.com/rizqyyourin',
  'https://www.linkedin.com/in/rizqyyourin',
  'https://www.instagram.com/rizqyyourin',
  'https://www.threads.net/@rizqyyourin',
  'https://www.freecodecamp.org/yourin',
];

const KNOWS_ABOUT = [
  'JavaScript', 'TypeScript', 'PHP', 'Go', 'React.js', 'Vue.js', 'Next.js', 'Nuxt.js',
  'Laravel', 'CodeIgniter 3', 'Node.js', 'PostgreSQL', 'MySQL', 'Redis', 'Docker',
  'Kubernetes', 'CI/CD', 'REST API', 'WebSocket',
];

// Structured data so search engines can resolve the name to a person, the site to a
// publisher, and the freelance chatbot work to an actual offer.
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Ahmad Rizqy Yourin',
      alternateName: 'Rizqy Yourin',
      url: SITE_URL,
      image: `${SITE_URL}/images/profile.webp`,
      jobTitle: 'Fullstack Developer',
      description: 'Computer Engineering graduate from Diponegoro University with experience building websites across monolith and microservices systems.',
      address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Diponegoro University' },
      knowsAbout: KNOWS_ABOUT,
      sameAs: PROFILES,
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: 'Ahmad Rizqy Yourin',
      description: DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': PERSON_ID },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: TITLE,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': PERSON_ID },
      mainEntity: { '@id': PERSON_ID },
      inLanguage: 'en',
    },
    {
      '@type': 'Service',
      name: 'AI Chatbot for Your Business Website',
      description: 'An AI chatbot that answers customer questions on a business website, captures leads, and hands the conversation over to WhatsApp when it is not sure.',
      serviceType: 'AI chatbot development',
      provider: { '@id': PERSON_ID },
      areaServed: { '@type': 'Country', name: 'Indonesia' },
      offers: {
        '@type': 'Offer',
        price: '850000',
        priceCurrency: 'IDR',
        availability: 'https://schema.org/InStock',
        url: 'https://fastwork.id/user/yourin/chatbot-30934056',
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'Ahmad Rizqy Yourin',
  authors: [{ name: 'Ahmad Rizqy Yourin', url: SITE_URL }],
  creator: 'Ahmad Rizqy Yourin',
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    siteName: 'Ahmad Rizqy Yourin',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={satoshi.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: ANALYTICS_TOKEN })}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
