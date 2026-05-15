'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AVAILABLE_YEARS, CATEGORY_LABELS } from '@/lib/constants';
import { Search, X } from 'lucide-react';

interface Props {
  currentYear?: string;
  currentCategory?: string;
  currentSearch?: string;
}

export default function ProgramFilter({ currentYear, currentCategory, currentSearch }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string | null | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    startTransition(() => router.push(`/programs?${params.toString()}`));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateFilter('search', fd.get('search') as string || undefined);
  };

  const hasFilters = !!(currentYear || currentCategory || currentSearch);

  const clearAll = () => {
    startTransition(() => router.push('/programs'));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <Input
            name="search"
            placeholder="Cari program..."
            defaultValue={currentSearch}
            className="pl-9 bg-white"
          />
        </div>
        <Button type="submit" variant="default" size="default" className="shrink-0 cursor-pointer">
          Cari
        </Button>
      </form>

      {/* Year filter */}
      <Select
        value={currentYear ?? 'all'}
        onValueChange={(v) => updateFilter('year', v === 'all' ? undefined : v)}
      >
        <SelectTrigger className="w-[140px] bg-white cursor-pointer">
          <SelectValue placeholder="Semua Tahun" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tahun</SelectItem>
          {AVAILABLE_YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category filter */}
      <Select
        value={currentCategory ?? 'all'}
        onValueChange={(v) => updateFilter('category', v === 'all' ? undefined : v)}
      >
        <SelectTrigger className="w-[190px] bg-white cursor-pointer">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="default" onClick={clearAll} className="text-muted-foreground hover:text-foreground cursor-pointer">
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
