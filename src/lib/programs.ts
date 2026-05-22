import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Program, ProgramFilters, ProgramFormData, PaginatedResponse, ProgramSummary } from '@/types';
import { PAGE_SIZE } from './constants';

const DATA_FILE = path.join(process.cwd(), 'data', 'programs.json');

async function readPrograms(): Promise<Program[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Program[];
  } catch {
    return [];
  }
}

async function writePrograms(programs: Program[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(programs, null, 2), 'utf-8');
}

export async function getAllPrograms(): Promise<Program[]> {
  return readPrograms();
}

export async function getProgramById(id: string): Promise<Program | null> {
  const programs = await readPrograms();
  return programs.find((p) => p.id === id) ?? null;
}

export async function createProgram(data: ProgramFormData): Promise<Program> {
  const programs = await readPrograms();
  const now = new Date().toISOString();
  const program: Program = {
    ...data,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  programs.unshift(program);
  await writePrograms(programs);
  return program;
}

export async function updateProgram(
  id: string,
  data: Partial<ProgramFormData>
): Promise<Program | null> {
  const programs = await readPrograms();
  const index = programs.findIndex((p) => p.id === id);
  if (index === -1) return null;
  programs[index] = { ...programs[index], ...data, updatedAt: new Date().toISOString() };
  await writePrograms(programs);
  return programs[index];
}

export async function deleteProgram(id: string): Promise<boolean> {
  const programs = await readPrograms();
  const filtered = programs.filter((p) => p.id !== id);
  if (filtered.length === programs.length) return false;
  await writePrograms(filtered);
  return true;
}

export async function queryPrograms(
  filters: ProgramFilters
): Promise<PaginatedResponse<ProgramSummary>> {
  let programs = await readPrograms();

  if (filters.year) {
    programs = programs.filter((p) => p.year === filters.year);
  }
  if (filters.category) {
    programs = programs.filter((p) => p.category === filters.category);
  }
  if (filters.status) {
    programs = programs.filter((p) => p.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    programs = programs.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const total = programs.length;
  const pageSize = filters.pageSize ?? PAGE_SIZE;
  const page = filters.page ?? 1;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const sliced = programs.slice(start, start + pageSize);

  const data: ProgramSummary[] = sliced.map(({ id, title, year, category, date, location, status, imageUrl, tags, beneficiariesCount }) => ({
    id, title, year, category, date, location, status, imageUrl, tags, beneficiariesCount,
  }));

  return { data, total, page, pageSize, totalPages };
}

export async function getSiteStats() {
  const programs = await readPrograms();
  const totalBeneficiaries = programs.reduce((sum, p) => sum + p.beneficiariesCount, 0);
  const activeYears = [...new Set(programs.map((p) => p.year))].sort();

  const categoryCounts = programs.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalPrograms: programs.length,
    totalBeneficiaries,
    activeYears,
    categoryCounts,
  };
}
