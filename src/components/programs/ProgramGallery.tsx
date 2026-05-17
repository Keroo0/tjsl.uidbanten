'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  imageUrl: string;
  images?: string[];
  title: string;
}

export function ProgramGallery({ imageUrl, images, title }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  const all = [imageUrl, ...(images ?? [])];

  if (all.length <= 1) return null;

  return (
    <div>
      <h2 className="font-heading font-semibold text-foreground mb-3">Foto Kegiatan</h2>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 border border-border/60 bg-muted">
        <Image
          src={all[activeIdx]}
          alt={`${title} — foto ${activeIdx + 1}`}
          fill
          className="object-cover transition-all duration-500"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
        {all.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-[#0F172A]/60 backdrop-blur-sm px-2.5 py-1 text-xs text-white font-medium">
            {activeIdx + 1} / {all.length}
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
        {all.map((src, i) => (
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
