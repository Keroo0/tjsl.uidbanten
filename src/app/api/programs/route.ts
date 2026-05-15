import { NextResponse } from 'next/server';
import { queryPrograms, createProgram } from '@/lib/programs';
import { z } from 'zod';
import type { ProgramCategory, ProgramStatus } from '@/types';

const programSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  year: z.number().int().min(2024).max(2030),
  category: z.enum(['pendidikan', 'kesehatan', 'lingkungan', 'ekonomi', 'infrastruktur', 'sosial']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().min(2),
  beneficiariesCount: z.number().int().min(0),
  budget: z.number().min(0),
  status: z.enum(['planned', 'ongoing', 'completed']),
  imageUrl: z.string().url(),
  impactDescription: z.string(),
  tags: z.array(z.string()),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters = {
    year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    category: (searchParams.get('category') as ProgramCategory) || undefined,
    status: (searchParams.get('status') as ProgramStatus) || undefined,
    search: searchParams.get('search') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
  };

  const result = await queryPrograms(filters);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = programSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const program = await createProgram(parsed.data);
  return NextResponse.json(program, { status: 201 });
}
