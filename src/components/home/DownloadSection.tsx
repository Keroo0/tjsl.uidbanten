import { FileSpreadsheet, Download } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EXCEL_DOWNLOADS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function DownloadSection() {
  return (
    <section id="unduh" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-10">
          <div className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-4 tracking-wide uppercase">
            Data Terbuka
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
            Unduh Data RKA
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Rencana Kegiatan Anggaran (RKA) PLN UID Banten tersedia untuk diunduh secara bebas sebagai
            bentuk transparansi program TJSL.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {EXCEL_DOWNLOADS.map(({ year, filename, label, description }) => (
            <div
              key={year}
              className="group flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-5 transition-shadow hover:shadow-md hover:shadow-black/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <FileSpreadsheet className="h-5 w-5 text-accent" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-heading font-semibold text-sm text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">Tahun {year}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{description}</p>
              <a
                href={`/downloads/${filename}`}
                download={filename}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full border-border/60 hover:bg-accent hover:text-white hover:border-accent transition-colors cursor-pointer')}
              >
                <Download className="mr-2 h-3.5 w-3.5" strokeWidth={2} />
                Unduh Excel
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
