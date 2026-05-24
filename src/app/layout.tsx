import type { Metadata } from 'next';
import { Outfit, Jost } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import { headers } from 'next/headers';

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const jost = Jost({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TJSL PLN UID Banten — Program CSR Berkelanjutan',
    template: '%s | TJSL PLN UID Banten',
  },
  description:
    'Program Tanggung Jawab Sosial dan Lingkungan (TJSL) PLN Unit Induk Distribusi Banten. Informasi lengkap kegiatan CSR, pemberdayaan masyarakat, dan program berkelanjutan PLN Peduli di wilayah Banten.',
  keywords: [
    'TJSL PLN',
    'PLN UID Banten',
    'CSR PLN',
    'tanggung jawab sosial perusahaan',
    'PLN Peduli',
    'program CSR Banten',
    'pemberdayaan masyarakat',
    'CSR perusahaan listrik',
    'lingkungan hidup',
    'program sosial PLN',
    'kemitraan PLN',
    'bina lingkungan PLN',
    'TJSL Banten',
    'kegiatan CSR terbaru 2025',
    'CSR Indonesia',
  ],
  icons: {
    icon: '/logo/logo-pln-peduli.png',
    apple: '/logo/logo-pln-peduli.png',
  },
  metadataBase: new URL('https://tjsl-pln-uidbanten.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TJSL PLN UID Banten — Program CSR Berkelanjutan',
    description:
      'Program Tanggung Jawab Sosial dan Lingkungan PLN UID Banten — pemberdayaan masyarakat, pelestarian lingkungan, dan kemitraan UMKM.',
    url: 'https://tjsl-pln-uidbanten.com',
    siteName: 'TJSL PLN UID Banten',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/logo/logo-pln-peduli.png',
        width: 512,
        height: 512,
        alt: 'Logo PLN Peduli',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TJSL PLN UID Banten',
    description: 'Program Tanggung Jawab Sosial dan Lingkungan PLN UID Banten',
    images: ['/logo/logo-pln-peduli.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html
      lang="id"
      className={`${outfit.variable} ${jost.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {!isAdmin && <Navbar />}
          <main className={`flex-1 ${!isAdmin ? '' : ''}`}>{children}</main>
          {!isAdmin && <Footer />}
          {!isAdmin && <BackToTop />}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
