import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aegis PV - AI-Powered Solar Intelligence',
  description: 'Transforming raw inverter data into actionable maintenance decisions for the GCC.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
