import { getSiteStats, getAllPrograms } from '@/lib/programs';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/lib/constants';
import { formatBudget, formatNumber } from '@/lib/utils';
import { Folder, Users, Banknote, CheckCircle2, Clock, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [stats, programs] = await Promise.all([getSiteStats(), getAllPrograms()]);

  const statusCounts = {
    completed: programs.filter((p) => p.status === 'completed').length,
    ongoing: programs.filter((p) => p.status === 'ongoing').length,
    planned: programs.filter((p) => p.status === 'planned').length,
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ringkasan program TJSL PLN UID Banten</p>
        </div>
        <Link href="/admin/programs/new" className={cn(buttonVariants(), 'cursor-pointer')}>
          Tambah Program
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Folder, label: 'Total Program', value: formatNumber(stats.totalPrograms), color: 'text-primary', bg: 'bg-primary/8' },
          { icon: Users, label: 'Penerima Manfaat', value: formatNumber(stats.totalBeneficiaries), color: 'text-accent', bg: 'bg-accent/8' },
          { icon: Banknote, label: 'Total Anggaran', value: formatBudget(stats.totalBudgetIDR), color: 'text-primary', bg: 'bg-primary/8' },
          { icon: CheckCircle2, label: 'Program Selesai', value: formatNumber(statusCounts.completed), color: 'text-accent', bg: 'bg-accent/8' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="rounded-xl border border-border/60 bg-white p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} mb-3`}>
              <Icon className={`h-4.5 w-4.5 ${color}`} strokeWidth={1.75} />
            </div>
            <div className={`font-heading text-xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="rounded-xl border border-border/60 bg-white p-5">
        <h2 className="font-heading font-semibold text-foreground mb-4">Status Program</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: CheckCircle2, label: STATUS_LABELS.completed, count: statusCounts.completed, color: 'text-green-600', bg: 'bg-green-50' },
            { icon: Clock, label: STATUS_LABELS.ongoing, count: statusCounts.ongoing, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: CalendarClock, label: STATUS_LABELS.planned, count: statusCounts.planned, color: 'text-slate-600', bg: 'bg-slate-50' },
          ].map(({ icon: Icon, label, count, color, bg }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.75} />
              </div>
              <div>
                <div className="font-heading font-bold text-lg text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent programs */}
      <div className="rounded-xl border border-border/60 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-foreground">Program Terbaru</h2>
          <Link href="/admin/programs" className="text-xs text-primary hover:underline font-medium">Lihat semua</Link>
        </div>
        {programs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada program. <Link href="/admin/programs/new" className="text-primary hover:underline">Tambah sekarang</Link>.</p>
        ) : (
          <div className="space-y-2">
            {programs.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.year} · {CATEGORY_LABELS[p.category]}</p>
                </div>
                <Link href={`/admin/programs/${p.id}/edit`} className="text-xs text-primary hover:underline shrink-0 ml-4">Edit</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
