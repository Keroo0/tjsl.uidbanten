import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import StatsSection from '@/components/home/StatsSection';
import ProgramsByYearSection from '@/components/home/ProgramsByYearSection';
import ContactSection from '@/components/home/ContactSection';
import { getAllPrograms, getSiteStats } from '@/lib/programs';
import { AVAILABLE_YEARS } from '@/lib/constants';
import type { Program } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [stats, programs] = await Promise.all([getSiteStats(), getAllPrograms()]);

  const programsByYear = Object.fromEntries(
    AVAILABLE_YEARS.map((year) => [year, programs.filter((p: Program) => p.year === year)])
  ) as Record<number, Program[]>;

  return (
    <>
      <HeroSection />
      <StatsSection
        totalPrograms={stats.totalPrograms}
        totalBeneficiaries={stats.totalBeneficiaries}
        totalBudgetIDR={stats.totalBudgetIDR}
        activeYears={stats.activeYears}
      />
      <AboutSection />
      <ProgramsByYearSection programsByYear={programsByYear} />
      <ContactSection />
    </>
  );
}
