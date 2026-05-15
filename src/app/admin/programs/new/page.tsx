import ProgramForm from '../../_components/ProgramForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewProgramPage() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <Link href="/admin/programs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Kembali
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground">Tambah Program</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Isi formulir untuk menambahkan program baru.</p>
      </div>
      <div className="rounded-xl border border-border/60 bg-white p-6">
        <ProgramForm />
      </div>
    </div>
  );
}
