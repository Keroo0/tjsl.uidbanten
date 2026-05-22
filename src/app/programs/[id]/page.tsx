import { notFound } from 'next/navigation';
import { getProgramById } from '@/lib/programs';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS, CATEGORY_COLORS } from '@/lib/constants';
import { formatDate, formatNumber } from '@/lib/utils';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { ProgramGallery } from '@/components/programs/ProgramGallery';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const program = await getProgramById(id);
  if (!program) return { title: 'Program Tidak Ditemukan' };
  return {
    title: `${program.title} — TJSL PLN UID Banten`,
    description: program.description.slice(0, 160),
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { id } = await params;
  const program = await getProgramById(id);
  if (!program) notFound();

  return (
    <div className="min-h-dvh bg-background">
      {/* Hero image */}
      <div className="relative h-72 sm:h-96 overflow-hidden bg-muted">
        <Image
          src={program.imageUrl}
          alt={program.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
        <div className="absolute bottom-6 left-4 sm:left-8">
          <div className="flex gap-2 mb-3">
            <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm bg-white/90', STATUS_COLORS[program.status])}>
              {STATUS_LABELS[program.status]}
            </span>
            <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm bg-white/90', CATEGORY_COLORS[program.category])}>
              {CATEGORY_LABELS[program.category]}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/programs" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-6 -ml-2 text-muted-foreground hover:text-foreground cursor-pointer')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Kembali ke Program
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-xs font-semibold text-primary mb-2 tracking-wide uppercase">Program {program.year}</p>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
                {program.title}
              </h1>
            </div>

            <Separator />

            <div>
              <h2 className="font-heading font-semibold text-foreground mb-3">Deskripsi Program</h2>
              <p className="text-muted-foreground leading-relaxed">{program.description}</p>
            </div>

            {program.impactDescription && (
              <div>
                <h2 className="font-heading font-semibold text-foreground mb-3">Dampak &amp; Hasil</h2>
                <div className="rounded-xl bg-accent/5 border border-accent/20 p-4">
                  <p className="text-sm text-foreground leading-relaxed">{program.impactDescription}</p>
                </div>
              </div>
            )}

            <ProgramGallery
              imageUrl={program.imageUrl}
              images={program.images}
              title={program.title}
            />

            {program.tags.length > 0 && (
              <div>
                <h2 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                  Tag
                </h2>
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground bg-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border/60 bg-white p-5 space-y-4 sticky top-24">
              <h3 className="font-heading font-semibold text-foreground text-sm">Detail Program</h3>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lokasi</p>
                    <p className="text-sm font-medium text-foreground">{program.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tanggal</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(program.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Users className="h-4 w-4 text-accent" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Penerima Manfaat</p>
                    <p className="text-sm font-medium text-foreground">{formatNumber(program.beneficiariesCount)} jiwa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
