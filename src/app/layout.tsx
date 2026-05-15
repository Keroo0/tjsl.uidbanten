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
  title: 'TJSL PLN UID Banten',
  description:
    'Tanggung Jawab Sosial dan Lingkungan PLN Unit Induk Distribusi Banten — program CSR yang berdampak nyata bagi masyarakat Banten.',
  keywords: ['TJSL', 'PLN', 'UID Banten', 'CSR', 'tanggung jawab sosial', 'lingkungan'],
  openGraph: {
    title: 'TJSL PLN UID Banten',
    description: 'Program Tanggung Jawab Sosial dan Lingkungan PLN UID Banten',
    locale: 'id_ID',
    type: 'website',
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
