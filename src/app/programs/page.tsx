import { queryPrograms } from '@/lib/programs';
import ProgramCard from '@/components/programs/ProgramCard';
import ProgramFilter from '@/components/programs/ProgramFilter';
import { FadeIn } from '@/components/ui/fade-in';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import type { ProgramCategory, ProgramStatus } from '@/types';
import { CATEGORY_LABELS } from '@/lib/constants';
import { Search, Leaf } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ year?: string; category?: string; status?: string; search?: string; page?: string }>;
}

export default async function ProgramsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const filters = {
    year: sp.year ? Number(sp.year) : undefined,
    category: sp.category as ProgramCategory | undefined,
    status: sp.status as ProgramStatus | undefined,
    search: sp.search || undefined,
    page: sp.page ? Number(sp.page) : 1,
  };

  const { data, total, page, totalPages } = await queryPrograms(filters);

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (sp.year) params.set('year', sp.year);
    if (sp.category) params.set('category', sp.category);
    if (sp.status) params.set('status', sp.status);
    if (sp.search) params.set('search', sp.search);
    params.set('page', String(p));
    return `/programs?${params.toString()}`;
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Page header */}
      <div className="relative overflow-hidden bg-muted">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mainImage/hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/92 via-[#0F172A]/75 to-[#0F172A]/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 mb-4 backdrop-blur-sm tracking-wide uppercase">
            <Leaf className="h-3.5 w-3.5 text-green-400" strokeWidth={2} />
            Program TJSL
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none mb-4">
            Program &amp; Kegiatan
          </h1>
          <p className="text-white/75 text-sm sm:text-base max-w-[60ch] leading-relaxed">
            Seluruh program TJSL PLN UID Banten dari tahun 2024 hingga sekarang.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <ProgramFilter
          currentYear={sp.year}
          currentCategory={sp.category}
          currentSearch={sp.search}
        />

        {/* Results count */}
        <div className="mt-6 mb-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{total}</span> program ditemukan
            {sp.year && <span> · Tahun {sp.year}</span>}
            {sp.category && <span> · {CATEGORY_LABELS[sp.category as ProgramCategory]}</span>}
          </p>
        </div>

        {/* Grid */}
        {data.length === 0 ? (
          <FadeIn>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">Tidak ada program</h3>
              <p className="text-sm text-muted-foreground max-w-[30ch]">
                Coba ubah filter atau kata kunci pencarian.
              </p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((p, i) => (
              <FadeIn key={p.id} delay={i * 50} direction="up">
                <ProgramCard program={p} />
              </FadeIn>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={buildUrl(page - 1)} />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink href={buildUrl(p)} isActive={p === page}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={buildUrl(page + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
