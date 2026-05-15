export type ProgramStatus = 'planned' | 'ongoing' | 'completed';

export type ProgramCategory =
  | 'pendidikan'
  | 'kesehatan'
  | 'lingkungan'
  | 'ekonomi'
  | 'infrastruktur'
  | 'sosial';

export interface Program {
  id: string;
  title: string;
  description: string;
  year: number;
  category: ProgramCategory;
  date: string;
  location: string;
  beneficiariesCount: number;
  budget: number;
  status: ProgramStatus;
  imageUrl: string;
  impactDescription: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProgramSummary = Pick<
  Program,
  | 'id'
  | 'title'
  | 'year'
  | 'category'
  | 'date'
  | 'location'
  | 'status'
  | 'imageUrl'
  | 'tags'
  | 'budget'
  | 'beneficiariesCount'
>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProgramFilters {
  year?: number;
  category?: ProgramCategory;
  status?: ProgramStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface SiteStats {
  totalPrograms: number;
  totalBeneficiaries: number;
  totalBudgetIDR: number;
  activeYears: number[];
  categoryCounts: Record<ProgramCategory, number>;
}

export type ProgramFormData = Omit<Program, 'id' | 'createdAt' | 'updatedAt'>;
