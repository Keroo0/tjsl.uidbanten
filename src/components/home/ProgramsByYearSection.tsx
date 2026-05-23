'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Download, ArrowRight } from 'lucide-react';
import ProgramCard from '@/components/programs/ProgramCard';
import { AVAILABLE_YEARS, EXCEL_DOWNLOADS } from '@/lib/constants';
import { buttonVariants } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/fade-in';
import ScaleIn from '@/components/ui/ScaleIn';
import { cn } from '@/lib/utils';
import type { Program } from '@/types';

interface Props {
  programsByYear: Record<number, Program[]>;
}

export default function ProgramsByYearSection({ programsByYear }: Props) {
  const years = [...AVAILABLE_YEARS].reverse() as number[];
  const [activeYear, setActiveYear] = useState<number>(years[0]);
  const [cardKey, setCardKey] = useState(0);
  const prevYear = useRef(activeYear);

  useEffect(() => {
    if (prevYear.current !== activeYear) {
      setCardKey((k) => k + 1);
      prevYear.current = activeYear;
    }
  }, [activeYear]);

  const programs = (programsByYear[activeYear] || []).slice(0, 6);
  const download = EXCEL_DOWNLOADS.find((d) => d.year === activeYear);
  const total = programsByYear[activeYear]?.length ?? 0;

  return (
    <section id="program" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <FadeIn className="mb-8">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3 tracking-wide uppercase">
            Program &amp; Kegiatan
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Kegiatan TJSL per Tahun
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
            Program Tanggung Jawab Sosial dan Lingkungan PLN UID Banten yang telah dan sedang berjalan.
          </p>
        </FadeIn>

        {/* Tab bar + Download button */}
        <FadeIn delay={100} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit overflow-x-auto max-sm:flex-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={cn(
                  'px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer',
                  activeYear === year
                    ? 'bg-white text-primary shadow-sm ring-1 ring-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {year}
              </button>
            ))}
          </div>

          {download && (
            <a
              href={`/downloads/${download.filename}`}
              download={download.filename}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'gap-2 border-border/60 hover:bg-accent/5 hover:border-accent hover:text-accent cursor-pointer w-fit'
              )}
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Unduh RKA {activeYear}
            </a>
          )}
        </FadeIn>

        {/* Program grid — re-keyed on year change to retrigger stagger */}
        {programs.length > 0 ? (
          <>
            <div key={cardKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((p, i) => (
                <ScaleIn key={p.id} delay={i * 70}>
                  <ProgramCard program={p} />
                </ScaleIn>
              ))}
            </div>

            {total > 6 && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={`/programs?year=${activeYear}`}
                  className={cn(buttonVariants({ variant: 'outline' }), 'gap-2 cursor-pointer')}
                >
                  Lihat Semua {total} Program {activeYear}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {total <= 6 && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={`/programs?year=${activeYear}`}
                  className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2 text-primary cursor-pointer')}
                >
                  Lihat di halaman program
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-border/60 bg-white py-16 text-center">
            <p className="text-muted-foreground text-sm">Belum ada program untuk tahun {activeYear}.</p>
          </div>
        )}
      </div>
    </section>
  );
}
