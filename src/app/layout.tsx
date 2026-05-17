import type { Metadata } from 'next';
import { Outfit, Jost } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TJSL PLN UID Banten',
    description: 'Program Tanggung Jawab Sosial dan Lingkungan PLN UID Banten',
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
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        {!isAdmin && <Navbar />}
        <main className={`flex-1 ${!isAdmin ? '' : ''}`}>{children}</main>
        {!isAdmin && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
