import { notFound } from 'next/navigation';
import { getProgramById } from '@/lib/programs';
import ProgramForm from '../../../_components/ProgramForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProgramPage({ params }: Props) {
  const { id } = await params;
  const program = await getProgramById(id);
  if (!program) notFound();

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <Link href="/admin/programs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Kembali
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground">Edit Program</h1>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{program.title}</p>
      </div>
      <div className="rounded-xl border border-border/60 bg-white p-6">
        <ProgramForm program={program} />
      </div>
    </div>
  );
}
