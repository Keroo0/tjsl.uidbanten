import { Users, Folder, Calendar } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { FadeIn } from '@/components/ui/fade-in';

interface StatsSectionProps {
  totalPrograms: number;
  totalBeneficiaries: number;
  activeYears: number[];
}

const stats = (props: StatsSectionProps) => [
  {
    icon: Folder,
    label: 'Total Program',
    value: formatNumber(props.totalPrograms),
    desc: 'Program aktif & selesai',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: Users,
    label: 'Penerima Manfaat',
    value: formatNumber(props.totalBeneficiaries),
    desc: 'Jiwa terbantu',
    color: 'text-accent',
    bg: 'bg-accent/8',
  },
  {
    icon: Calendar,
    label: 'Tahun Aktif',
    value: props.activeYears.length > 0 ? `${props.activeYears[0]}–${props.activeYears[props.activeYears.length - 1]}` : '2024–2026',
    desc: `${props.activeYears.join(', ')}`,
    color: 'text-accent',
    bg: 'bg-accent/8',
  },
];

export default function StatsSection(props: StatsSectionProps) {
  const items = stats(props);
  return (
    <section className="py-16 bg-white border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map(({ icon: Icon, label, value, desc, color, bg }, i) => (
            <FadeIn key={label} delay={i * 80} direction="up">
              <div className="flex flex-col items-start gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.75} />
                </div>
                <div>
                  <div className={`font-heading text-2xl sm:text-3xl font-bold ${color} tracking-tight`}>
                    {value}
                  </div>
                  <div className="font-medium text-sm text-foreground mt-0.5">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
