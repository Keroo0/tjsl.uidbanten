'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  speed?: number;
}

export default function ParallaxHero({ children, speed = 0.35 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = (window.innerHeight - rect.top) * speed;
        el.style.transform = `translateY(${Math.min(offset, 0)}px)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={ref} className="will-change-transform">
      {children}
    </div>
  );
}
