import type { ProgramCategory, ProgramStatus } from '@/types';

export const CATEGORY_LABELS: Record<ProgramCategory, string> = {
  pendidikan: 'Pendidikan',
  kesehatan: 'Kesehatan',
  lingkungan: 'Lingkungan Hidup',
  ekonomi: 'Pemberdayaan Ekonomi',
  infrastruktur: 'Infrastruktur',
  sosial: 'Sosial & Kemasyarakatan',
};

export const STATUS_LABELS: Record<ProgramStatus, string> = {
  planned: 'Direncanakan',
  ongoing: 'Berjalan',
  completed: 'Selesai',
};

export const STATUS_COLORS: Record<ProgramStatus, string> = {
  planned: 'bg-slate-100 text-slate-700 border-slate-200',
  ongoing: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
};

export const CATEGORY_COLORS: Record<ProgramCategory, string> = {
  pendidikan: 'bg-amber-50 text-amber-700 border-amber-200',
  kesehatan: 'bg-rose-50 text-rose-700 border-rose-200',
  lingkungan: 'bg-green-50 text-green-700 border-green-200',
  ekonomi: 'bg-purple-50 text-purple-700 border-purple-200',
  infrastruktur: 'bg-blue-50 text-blue-700 border-blue-200',
  sosial: 'bg-orange-50 text-orange-700 border-orange-200',
};

export const AVAILABLE_YEARS = [2024, 2025, 2026] as const;

export const PAGE_SIZE = 9;

export const EXCEL_DOWNLOADS = [
  {
    year: 2024,
    filename: 'RKA-2024.xlsx',
    label: 'RKA Unit 2024',
    description: 'Rencana Kegiatan Anggaran UID Banten Tahun 2024',
  },
  {
    year: 2025,
    filename: 'RKA-2025.xlsx',
    label: 'RKA Unit 2025',
    description: 'Rencana Kegiatan Anggaran UID Banten Tahun 2025',
  },
  {
    year: 2026,
    filename: 'RKA-2026.xlsx',
    label: 'RKA Unit 2026',
    description: 'Rencana Kegiatan Anggaran UID Banten Tahun 2026',
  },
] as const;
