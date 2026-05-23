import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

const pillars = [
  'Pendidikan & Pengembangan SDM',
  'Kesehatan Masyarakat',
  'Pemberdayaan Ekonomi',
  'Pelestarian Lingkungan Hidup',
  'Infrastruktur & Energi Bersih',
  'Sosial & Kemasyarakatan',
];

export default function AboutSection() {
  return (
    <section id="tentang" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text — left */}
          <FadeIn direction="left" className="order-2 lg:order-1">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4 tracking-wide uppercase">
              Tentang Kami
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight mb-5">
              Apa itu TJSL?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Tanggung Jawab Sosial dan Lingkungan (TJSL)</strong> adalah
              kewajiban Badan Usaha Milik Negara (BUMN) yang diatur dalam Undang-Undang No. 40 Tahun 2007 dan
              Peraturan Pemerintah No. 47 Tahun 2012, untuk berperan aktif dalam pembangunan ekonomi
              berkelanjutan guna meningkatkan kualitas kehidupan dan lingkungan.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              PT PLN (Persero) Unit Induk Distribusi Banten melaksanakan program TJSL sebagai wujud komitmen
              perusahaan terhadap masyarakat dan lingkungan sekitar wilayah operasional, mencakup enam pilar
              utama:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pillars.map((pillar, i) => (
                <FadeIn key={pillar} delay={i * 60} direction="up">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" strokeWidth={2} />
                    <span className="text-sm text-foreground font-medium">{pillar}</span>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </FadeIn>

          {/* Image — right */}
          <FadeIn direction="right" delay={100} className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl shadow-black/10">
              <Image
                src="/2025/Desa Berdaya Agrowisata Kopi/main.jpg"
                alt="Kegiatan TJSL PLN UID Banten"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

          </FadeIn>
        </div>
      </div>
    </section>
  );
}
