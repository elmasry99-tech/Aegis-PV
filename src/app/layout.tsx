import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';
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

// Applies the saved theme before paint so there's no light/dark flash on load.
const themeInitScript = `
  try {
    var t = localStorage.getItem('aegis_theme');
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
