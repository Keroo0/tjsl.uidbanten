import { NextResponse } from 'next/server';
import { getProgramById, updateProgram, deleteProgram } from '@/lib/programs';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  year: z.number().int().min(2024).max(2030).optional(),
  category: z.enum(['pendidikan', 'kesehatan', 'lingkungan', 'ekonomi', 'infrastruktur', 'sosial']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  location: z.string().min(2).optional(),
  beneficiariesCount: z.number().int().min(0).optional(),
  status: z.enum(['planned', 'ongoing', 'completed']).optional(),
  imageUrl: z.string().min(1).refine(
    (v) => v.startsWith('/') || /^https?:\/\//.test(v),
    'Path gambar tidak valid'
  ).optional(),
  images: z.array(z.string()).optional(),
  impactDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = await getProgramById(id);
  if (!program) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(program);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await updateProgram(id, parsed.data);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteProgram(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new Response(null, { status: 204 });
}
