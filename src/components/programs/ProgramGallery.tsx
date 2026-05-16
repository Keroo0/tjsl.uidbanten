'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ProgramCategory } from '@/types';

// Fallback Unsplash photos per category
const CATEGORY_FALLBACKS: Record<ProgramCategory, string[]> = {
  pendidikan: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  ],
  kesehatan: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80',
  ],
  lingkungan: [
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  ],
  ekonomi: [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80',
  ],
  infrastruktur: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  ],
  sosial: [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
  ],
};

interface Props {
  imageUrl: string;
  images?: string[];
  category: ProgramCategory;
  title: string;
}

export function ProgramGallery({ imageUrl, images, category, title }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Build gallery: main image first, then extras, then category fallbacks, deduplicated, capped at 3
  const extra = images ?? [];
  const fallbacks = CATEGORY_FALLBACKS[category];
  const all = [imageUrl, ...extra, ...fallbacks];
  const seen = new Set<string>();
  const gallery: string[] = [];
  for (const url of all) {
    if (!seen.has(url) && gallery.length < 3) {
      seen.add(url);
      gallery.push(url);
    }
  }

  return (
    <div>
      <h2 className="font-heading font-semibold text-foreground mb-3">Foto Kegiatan</h2>

      {/* Active photo */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 border border-border/60 bg-muted">
        <Image
          src={gallery[activeIdx]}
          alt={`${title} — foto ${activeIdx + 1}`}
          fill
          className="object-cover transition-all duration-500"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
        {gallery.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-[#0F172A]/60 backdrop-blur-sm px-2.5 py-1 text-xs text-white font-medium">
            {activeIdx + 1} / {gallery.length}
          </div>
        )}
      </div>

      {/* Thumbnails — horizontal scroll on mobile, row on desktop */}
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
        {gallery.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={cn(
              'relative shrink-0 w-24 sm:w-28 h-16 sm:h-[4.5rem] rounded-lg overflow-hidden border-2 transition-all snap-start cursor-pointer',
              activeIdx === i
                ? 'border-primary opacity-100 ring-2 ring-primary/20'
                : 'border-transparent opacity-55 hover:opacity-80'
            )}
          >
            <Image
              src={src}
              alt={`Thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="112px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
