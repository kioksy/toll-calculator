import { Inter as FontSans } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';

import { cn } from '@/lib/utils';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="container flex-1 space-y-4 p-8 pt-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
