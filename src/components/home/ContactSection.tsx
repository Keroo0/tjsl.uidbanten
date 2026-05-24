import { MapPin, Phone, Mail, Clock, Zap } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

const contacts = [
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Jl. Jend. Sudirman No. 1, Sukasari, Kec. Tangerang, Kota Tangerang, Banten 15118',
    href: 'https://maps.google.com/?q=PLN+UID+Banten',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: Phone,
    label: 'Telepon',
    value: '(021) 5526716',
    href: 'tel:+62215526716',
    color: 'text-accent',
    bg: 'bg-accent/8',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'tjsl@pln-uidbanten.co.id',
    href: 'mailto:tjsl@pln-uidbanten.co.id',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: Clock,
    label: 'Jam Operasional',
    value: 'Senin – Jumat, 08.00 – 16.00 WIB',
    href: null,
    color: 'text-accent',
    bg: 'bg-accent/8',
  },
];

export default function ContactSection() {
  return (
    <section id="kontak" className="py-20 bg-slate-50 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: text */}
          <FadeIn direction="left">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4 tracking-wide uppercase">
              Hubungi Kami
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Kantor TJSL<br />PLN UID Banten
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-8">
              Untuk informasi lebih lanjut mengenai program TJSL, kemitraan, atau pengajuan proposal kegiatan,
              silakan menghubungi kami melalui saluran berikut.
            </p>

            {/* Brand mark */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-white w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <Zap className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-foreground">PT PLN (Persero)</p>
                <p className="text-xs text-muted-foreground">Unit Induk Distribusi Banten</p>
              </div>
            </div>
          </FadeIn>

          {/* Right: contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map(({ icon: Icon, label, value, href, color, bg }, i) => (
              <FadeIn key={label} delay={i * 80} direction="up">
                <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-white p-5 transition-shadow hover:shadow-md hover:shadow-black/5 h-full">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${color}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1 tracking-wide uppercase">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors leading-snug"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-foreground leading-snug">{value}</p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
