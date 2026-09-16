import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Ahmad Rizqy Yourin: Fullstack Developer', description: 'Fullstack developer based in Jakarta. Building thoughtful interfaces, reliable systems, and meaningful digital experiences. Explore my work, experience, and interactive 3D workspace.', openGraph: { title: 'Ahmad Rizqy Yourin: Fullstack Developer', description: 'Thoughtful interfaces. Reliable systems. A little curiosity.', type: 'website', locale: 'en_US' }, robots: { index: true, follow: true } };
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
