import localFont from 'next/font/local';

// Satoshi used to be loaded from api.fontshare.com with a render-blocking stylesheet: an extra
// DNS + TLS + RTT on the critical path with no preload. Self-hosting through next/font/local
// inlines the @font-face rules into the build CSS, preloads the files, and generates a
// size-adjusted Arial fallback so the swap does not shift layout.
export const satoshi = localFont({
  src: [
    { path: './fonts/satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/satoshi-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
