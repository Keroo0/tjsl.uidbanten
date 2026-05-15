import { getAllPrograms } from '@/lib/programs';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import { formatBudget, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DeleteButton from '../_components/DeleteButton';
import { PlusCircle, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminProgramsPage() {
  const programs = await getAllPrograms();

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Program</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{programs.length} program terdaftar</p>
        </div>
        <Link href="/admin/programs/new" className={cn(buttonVariants(), 'cursor-pointer')}>
          <PlusCircle className="h-4 w-4 mr-2" strokeWidth={2} />
          Tambah Program
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-white p-12 text-center">
          <p className="text-muted-foreground text-sm mb-3">Belum ada program.</p>
          <Link href="/admin/programs/new" className={cn(buttonVariants({ size: 'sm' }), 'cursor-pointer')}>
            Tambah Program Pertama
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Judul</TableHead>
                <TableHead className="font-semibold">Tahun</TableHead>
                <TableHead className="font-semibold">Kategori</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Anggaran</TableHead>
                <TableHead className="font-semibold text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium max-w-[200px]">
                    <p className="truncate text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(p.date)}</p>
                  </TableCell>
                  <TableCell className="text-sm">{p.year}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{CATEGORY_LABELS[p.category]}</TableCell>
                  <TableCell>
                    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold', STATUS_COLORS[p.status])}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatBudget(p.budget)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/programs/${p.id}/edit`} aria-label="Edit program" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer')}>
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                      <DeleteButton id={p.id} title={p.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
