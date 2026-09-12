import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
export const metadata: Metadata = { title: 'Ahmad Rizqy Yourin: Fullstack Developer', description: 'Fullstack developer based in Jakarta. Building thoughtful interfaces, reliable systems, and meaningful digital experiences. Explore my work, experience, and interactive 3D workspace.', openGraph: { title: 'Ahmad Rizqy Yourin: Fullstack Developer', description: 'Thoughtful interfaces. Reliable systems. A little curiosity.', type: 'website', locale: 'en_US' }, robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${geist.variable} ${mono.variable} antialiased`}>{children}</body></html>; }
