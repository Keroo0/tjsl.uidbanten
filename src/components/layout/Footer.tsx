import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0F172A] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <Zap className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-sm text-white">TJSL</span>
                <span className="text-[10px] text-slate-400">PLN UID Banten</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Program Tanggung Jawab Sosial dan Lingkungan PT PLN (Persero) Unit Induk Distribusi Banten
              untuk masyarakat yang lebih berdaya dan lingkungan yang berkelanjutan.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm mb-4">Navigasi</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/programs', label: 'Program & Kegiatan' },
                { href: '/#program', label: 'Program per Tahun' },
                { href: '/#tentang', label: 'Tentang TJSL' },
                { href: '/#kontak', label: 'Hubungi Kami' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {year} PT PLN (Persero) UID Banten. Hak Cipta Dilindungi.
          </p>
          <p className="text-xs text-slate-500">
            Sub Divisi TJSL — Tanggung Jawab Sosial &amp; Lingkungan
          </p>
        </div>
      </div>
    </footer>
  );
}
