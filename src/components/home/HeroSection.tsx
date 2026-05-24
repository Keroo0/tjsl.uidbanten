import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section className="relative min-h-[70dvh] sm:min-h-[80dvh] lg:min-h-[90dvh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/mainImage/hero.jpg"
          alt="PLN UID Banten"
          fill
          className="object-cover object-[55%_center] sm:object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/70 to-[#0F172A]/40 sm:bg-gradient-to-r sm:from-[#0F172A]/92 sm:via-[#0F172A]/75 sm:to-[#0F172A]/30" />
      </div>

      {/* Content — left aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-xl">
          {/* Badge */}
          <div
            data-hero-item
            style={{ '--hero-delay': '0ms' } as React.CSSProperties}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm mb-6"
          >
            <Leaf className="h-3.5 w-3.5 text-green-400" strokeWidth={2} />
            <span className="text-xs font-medium text-white/90 tracking-wide">
              PT PLN (Persero) UID Banten
            </span>
          </div>

          <h1
            data-hero-item
            style={{ '--hero-delay': '100ms' } as React.CSSProperties}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none mb-6"
          >
            Tanggung Jawab
            <span className="block text-primary" style={{ color: '#60a5fa' }}>
              Sosial &amp; Lingkungan
            </span>
          </h1>

          <p
            data-hero-item
            style={{ '--hero-delay': '200ms' } as React.CSSProperties}
            className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-[50ch]"
          >
            Program TJSL PLN UID Banten menghadirkan dampak nyata — dari pendidikan, kesehatan,
            pemberdayaan ekonomi, hingga pelestarian lingkungan untuk masyarakat Banten.
          </p>

          <div
            data-hero-item
            style={{ '--hero-delay': '300ms' } as React.CSSProperties}
            className="flex flex-col sm:flex-row gap-3 items-start"
          >
            <Link href="/programs" className={cn(buttonVariants({ size: 'lg' }), 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 font-semibold group cursor-pointer')}>
              Lihat Program
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#tentang" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm cursor-pointer')}>
              Tentang TJSL
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
