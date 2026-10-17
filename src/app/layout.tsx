import type { Metadata } from 'next';
import './globals.css';

const TITLE = 'Ahmad Rizqy Yourin: Fullstack Developer';
const DESCRIPTION = 'Fullstack developer based in Jakarta. Building thoughtful interfaces, reliable systems, and meaningful digital experiences. Explore my work, experience, and tech stack.';

export const metadata: Metadata = {
  metadataBase: new URL('https://yourin.my.id'),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { title: TITLE, description: 'Thoughtful interfaces. Reliable systems. A little curiosity.', url: '/', type: 'website', locale: 'en_US' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
