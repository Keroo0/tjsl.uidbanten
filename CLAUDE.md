@AGENTS.md

---

# TJSL PLN UID Banten — Project Guide

## Gambaran Proyek

Website publik untuk **Sub-Divisi TJSL (Tanggung Jawab Sosial dan Lingkungan)** PT PLN (Persero) Unit Induk Distribusi Banten. Tujuannya: transparansi program CSR ke publik, dan manajemen data program secara internal melalui admin panel tersembunyi.

- **Audiens publik**: Masyarakat Banten, stakeholder PLN, auditor, media
- **Audiens internal**: Tim TJSL PLN UID Banten (via admin panel)
- **Bahasa**: Bahasa Indonesia sepenuhnya — semua teks UI, label, pesan error harus dalam Bahasa Indonesia
- **Data**: 56 program nyata dari 3 file Excel RKA (2024/2025/2026), tersimpan di `data/programs.json`

---

## Tech Stack

| Layer | Pilihan | Versi |
|---|---|---|
| Framework | Next.js App Router | 16.2.6 |
| Language | TypeScript | 5+ |
| Styling | Tailwind CSS | v4 |
| UI Components | shadcn/ui (berbasis `@base-ui/react`) | v4 |
| Auth | JWT via `jose` + httpOnly cookie | — |
| Font | Outfit (heading) + Jost (body) via next/font | — |
| Icons | `lucide-react` | — |
| Forms | `react-hook-form` + `zod` | — |
| Storage | JSON file (`data/programs.json`) via `fs/promises` | — |
| Runtime | Node.js 20.9+ | — |

---

## Wajib Dilakukan Sebelum Menulis Kode

### 1. Cek Context7 untuk dokumentasi library

Sebelum menggunakan API dari library apapun (Next.js, shadcn, zod, jose, react-hook-form, dll), **gunakan Context7 MCP untuk fetch dokumentasi terkini**. Jangan andalkan training data karena banyak API yang sudah berubah di versi terbaru.

```
Contoh: sebelum menulis kode auth dengan jose, fetch dulu:
→ resolve-library-id "jose"
→ query-docs dengan pertanyaan spesifik
```

### 2. Cek breaking changes Next.js 16

Baca `node_modules/next/dist/docs/` jika ragu tentang API Next.js. Hal-hal yang sering salah:

- `params` dan `searchParams` di page components **harus di-await**
- `cookies()` dan `headers()` di Server Components **harus di-await**
- Route protection menggunakan **`proxy.ts`** (bukan `middleware.ts` yang deprecated)
- Fungsi di `proxy.ts` bernama `proxy`, **bukan** `middleware`
- `shadcn/ui` v4 menggunakan `@base-ui/react` — **tidak ada `asChild` prop**

### 3. Jangan pernah gunakan `asChild`

`@base-ui/react` tidak mendukung `asChild`. Pattern yang benar:

```tsx
// ❌ SALAH — akan error TypeScript
<Button asChild><Link href="/foo">Klik</Link></Button>

// ✅ BENAR — gunakan buttonVariants() langsung
import { buttonVariants } from '@/components/ui/button';
<Link href="/foo" className={cn(buttonVariants({ variant: 'outline' }), 'extra-class')}>Klik</Link>
```

---

## Design System

### Warna

```css
/* Primary — Biru PLN */
--primary: oklch(0.546 0.222 263);   /* #2563EB */

/* Accent — Hijau lingkungan */
--accent: oklch(0.576 0.162 148);    /* #16A34A */

/* Background — Putih kebiruan */
--background: oklch(0.982 0.003 248);

/* Dark surface (hero, footer) */
bg-[#0F172A]  /* slate-950 */
```

**Aturan warna:**
- Maksimal 1 warna aksen per section
- Jangan pakai warna selain primary/accent kecuali untuk badge kategori (lihat `constants.ts`)
- Badge status: slate (planned), blue (ongoing), green (completed)
- Badge kategori: amber (pendidikan), rose (kesehatan), green (lingkungan), purple (ekonomi), blue (infrastruktur), orange (sosial)

### Typography

```
Font heading : Outfit (variable: --font-heading)
Font body    : Jost   (variable: --font-sans)
Font mono    : Geist Mono (variable: --font-mono)
```

**Scale yang digunakan:**

| Konteks | Class |
|---|---|
| Hero h1 | `font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none` |
| Section h2 | `font-heading text-3xl sm:text-4xl font-bold tracking-tight` |
| Card title | `font-heading font-semibold leading-snug` |
| Body | `text-sm sm:text-base leading-relaxed` |
| Label/badge | `text-xs font-semibold tracking-wide uppercase` |
| Stat number | `font-heading text-2xl sm:text-3xl font-bold tracking-tight` |

**Aturan typography:**
- Jangan pakai Inter — sudah diganti Outfit + Jost
- Heading selalu pakai `font-heading`
- Body text max-width: `max-w-[65ch]` atau `max-w-xl`
- Jangan gunakan `text-black` — pakai `text-foreground`

### Spacing & Layout

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section padding: `py-20` (besar) atau `py-16` (medium)
- Card: `rounded-xl border border-border/60 bg-white p-4 sm:p-5`
- Gap grid: `gap-6` (cards) atau `gap-8 lg:gap-12` (section)

### Animasi

Animasi menggunakan `FadeIn` component (`src/components/ui/fade-in.tsx`) dengan IntersectionObserver. **Tidak ada framer-motion.**

```tsx
// Scroll reveal — gunakan untuk semua section di bawah fold
import { FadeIn } from '@/components/ui/fade-in';

<FadeIn delay={0} direction="up">...</FadeIn>      // default
<FadeIn delay={100} direction="left">...</FadeIn>  // slide dari kiri
<FadeIn delay={100} direction="right">...</FadeIn> // slide dari kanan

// Stagger cards — naikkan delay per item
{items.map((item, i) => (
  <FadeIn key={item.id} delay={i * 80}>...</FadeIn>
))}
```

**Hero section** (above fold) — gunakan CSS `data-hero-item` + CSS custom property, bukan FadeIn:
```tsx
<div data-hero-item style={{ '--hero-delay': '100ms' } as React.CSSProperties}>
```

**Aturan animasi:**
- Hanya animate `transform` dan `opacity` — jangan `width`, `height`, `top`, `left`
- `prefers-reduced-motion` sudah di-handle di `globals.css` — tidak perlu cek manual
- Gunakan timing `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)

---

## Struktur File

```
/Users/rmg/Penelitian/tjls/
├── public/downloads/          # File Excel RKA untuk diunduh
│   ├── RKA-2024.xlsx
│   ├── RKA-2025.xlsx
│   └── RKA-2026.xlsx
├── data/
│   └── programs.json          # Data store utama — 56 program nyata
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout: Navbar+Footer (skip untuk /admin)
│   │   ├── globals.css        # CSS variables + keyframes animasi
│   │   ├── page.tsx           # Home page (Server Component)
│   │   ├── programs/
│   │   │   ├── page.tsx       # Listing + filter + pagination
│   │   │   └── [id]/page.tsx  # Detail program
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Admin sidebar layout
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx       # Dashboard stats
│   │   │   └── programs/      # CRUD program
│   │   └── api/
│   │       ├── auth/          # login + logout routes
│   │       └── programs/      # GET/POST/PUT/DELETE
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Sticky navbar + mobile sheet
│   │   │   └── Footer.tsx     # Dark footer (#0F172A)
│   │   ├── home/
│   │   │   ├── HeroSection.tsx          # Hero dengan CSS load animation
│   │   │   ├── StatsSection.tsx         # 4 stat cards
│   │   │   ├── AboutSection.tsx         # 2 kolom + 6 pilar
│   │   │   ├── ProgramsByYearSection.tsx # Tab tahun + download inline (Client)
│   │   │   └── ContactSection.tsx       # 4 contact cards
│   │   ├── programs/
│   │   │   ├── ProgramCard.tsx          # Card dengan badge
│   │   │   └── ProgramFilter.tsx        # Filter tahun/kategori/search (Client)
│   │   ├── admin/
│   │   │   └── ProgramForm.tsx          # react-hook-form + zod
│   │   └── ui/
│   │       ├── fade-in.tsx    # Custom IntersectionObserver animation wrapper
│   │       └── ...            # shadcn components
│   ├── lib/
│   │   ├── programs.ts        # getAllPrograms, queryPrograms, CRUD functions
│   │   ├── auth.ts            # createSessionToken, verifySessionToken (jose)
│   │   ├── constants.ts       # CATEGORY_LABELS, STATUS_LABELS, AVAILABLE_YEARS, EXCEL_DOWNLOADS
│   │   └── utils.ts           # cn(), formatBudget(), formatCurrency(), formatDate(), formatNumber()
│   ├── types/index.ts         # Program, ProgramSummary, PaginatedResponse, SiteStats
│   └── proxy.ts               # Route protection /admin (Next.js 16 pengganti middleware.ts)
├── .env.local                 # ADMIN_PASSWORD, ADMIN_SESSION_SECRET
├── CLAUDE.md                  # File ini
└── AGENTS.md                  # Next.js 16 breaking changes warning
```

---

## Data Model

```typescript
// src/types/index.ts
type ProgramStatus   = 'planned' | 'ongoing' | 'completed';
type ProgramCategory = 'pendidikan' | 'kesehatan' | 'lingkungan' | 'ekonomi' | 'infrastruktur' | 'sosial';

interface Program {
  id: string;               // uuid v4
  title: string;
  description: string;
  year: number;             // 2024 | 2025 | 2026
  category: ProgramCategory;
  date: string;             // "YYYY-MM-DD"
  location: string;         // Nama kota/kabupaten di Banten
  beneficiariesCount: number;
  budget: number;           // IDR (Rupiah penuh, bukan juta)
  status: ProgramStatus;
  imageUrl: string;         // Unsplash URL (sementara)
  impactDescription: string;
  tags: string[];
  createdAt: string;        // ISO string
  updatedAt: string;        // ISO string
}
```

**Saat membuat/edit program:**
- `id` — generate dengan `uuid()` dari `uuid` package
- `budget` — simpan dalam Rupiah penuh (bukan ribuan/jutaan)
- `date` — format ISO "YYYY-MM-DD"
- `location` — nama kota/kabupaten Banten, bukan nama lembaga

---

## Auth Admin

```
URL tersembunyi: /admin  (tidak ada link publik ke sini)
Password: dari .env.local → ADMIN_PASSWORD
Session: JWT 24 jam, cookie httpOnly bernama admin_session
Secret: dari .env.local → ADMIN_SESSION_SECRET
```

Flow:
1. Akses `/admin/*` → `proxy.ts` verifikasi cookie
2. Tidak valid → redirect ke `/admin/login`
3. POST `/api/auth/login` dengan password → set cookie → redirect `/admin`
4. POST `/api/auth/logout` → hapus cookie → redirect `/admin/login`

---

## Konvensi Koding

### Server vs Client Components

- Default: **Server Component** — tidak perlu `'use client'`
- Jadikan Client Component **hanya jika** perlu: `useState`, `useEffect`, event handler, browser API
- `ProgramsByYearSection` adalah Client Component karena ada `useState` untuk tab tahun
- `ProgramFilter` adalah Client Component karena pakai `useRouter`

### Form Validation

Gunakan `zod` v4 API (sudah breaking change dari v3):

```typescript
// ✅ Zod v4 — field number dari form HTML
budget: z.number({ error: 'Harus angka' }).positive(),
// Di register: { valueAsNumber: true }

// ❌ Jangan gunakan z.coerce.number() untuk form fields
```

### API Routes

```typescript
// Selalu validasi input di API routes
// Selalu kembalikan JSON dengan status code yang tepat
// Error 401 untuk unauthenticated, 403 untuk unauthorized
// Error 404 untuk not found, 400 untuk bad input
```

### Formatting Angka

```typescript
import { formatBudget, formatCurrency, formatNumber, formatDate } from '@/lib/utils';

formatBudget(150000000)    // "Rp 150 Jt"    — untuk card/list (singkat)
formatCurrency(150000000)  // "Rp 150.000.000" — untuk detail page (penuh)
formatNumber(1234)         // "1.234"          — penerima manfaat
formatDate("2024-03-15")   // "15 Maret 2024"  — tampilan tanggal
```

---

## Hal yang Tidak Boleh Dilakukan

- **Jangan** tambah fitur yang tidak diminta — no over-engineering
- **Jangan** pakai emoji di UI kecuali diminta eksplisit
- **Jangan** hardcode string bahasa Inggris di UI yang terlihat pengguna
- **Jangan** commit perubahan ke `.env.local`
- **Jangan** gunakan `console.log` di production code
- **Jangan** buat file dokumentasi/README baru kecuali diminta
- **Jangan** hapus data di `data/programs.json` tanpa konfirmasi eksplisit
- **Jangan** push ke remote tanpa konfirmasi eksplisit

---

## Catatan Deployment

Storage JSON file (`data/programs.json`) **hanya cocok untuk server lokal atau VPS**. Jika suatu saat deploy ke Vercel, filesystem bersifat read-only dan perlu migrasi ke Supabase atau database eksternal. Beritahu user jika ada pertanyaan tentang deployment ke platform serverless.
