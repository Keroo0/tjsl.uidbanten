import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS, CATEGORY_COLORS } from '@/lib/constants';
import { formatBudget, formatDate, formatNumber } from '@/lib/utils';
import type { ProgramSummary, Program } from '@/types';
import { cn } from '@/lib/utils';

type Props = { program: ProgramSummary | Program };

export default function ProgramCard({ program }: Props) {
  return (
    <Link
      href={`/programs/${program.id}`}
      className="group flex flex-col rounded-xl border border-border/60 bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/6 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={program.imageUrl}
          alt={program.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm bg-white/90', STATUS_COLORS[program.status])}>
            {STATUS_LABELS[program.status]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm bg-white/90', CATEGORY_COLORS[program.category])}>
            {CATEGORY_LABELS[program.category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-semibold text-primary">{program.year}</span>
          <span className="text-border">·</span>
          <span className="text-xs text-muted-foreground font-medium">{formatBudget(program.budget)}</span>
        </div>

        <h3 className="font-heading font-semibold text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {program.title}
        </h3>

        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{program.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span>{formatDate(program.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span>{formatNumber(program.beneficiariesCount)} penerima manfaat</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
