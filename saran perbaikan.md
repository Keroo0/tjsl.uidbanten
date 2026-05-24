# Saran Perbaikan — TJSL PLN UID Banten

Hasil audit menyeluruh terhadap kode proyek per **2026-05-24**, divalidasi terhadap dokumentasi internal Next.js 16 (`node_modules/next/dist/docs/`), serta konvensi terbaru Tailwind v4, shadcn v4 / `@base-ui/react`, zod v4, dan `jose` v6.

Daftar disusun dari **kritis → moderat → minor**. Setiap item mencantumkan: **lokasi file**, **masalah**, **dampak**, **rekomendasi perbaikan**.

---

## 🚨 KRITIS — Bug yang harus diperbaiki segera

### 1. **Auth bypass pada `/api/upload`** — `verifySessionToken` tidak pernah melempar error

[src/app/api/upload/route.ts:13-17](src/app/api/upload/route.ts#L13-L17)

```ts
try {
  await verifySessionToken(session);
} catch {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Masalah**: [src/lib/auth.ts:18-26](src/lib/auth.ts#L18-L26) — `verifySessionToken` mengembalikan `boolean` dan **tidak pernah melempar error** (try/catch sudah ada di dalamnya, return `false` jika gagal). Konsekuensinya, blok `catch` di atas tidak pernah aktif. **Siapapun dengan cookie `admin_session` apapun (bahkan invalid/expired) dapat mengupload file ke server.**

**Dampak**: Buka pintu upload arbitrary file ke `public/<year>/<title>/<type>.<ext>` tanpa auth → bisa disisipi konten berbahaya, melahap disk, atau menggantikan gambar program lain.

**Perbaikan**:

```ts
const valid = await verifySessionToken(session);
if (!valid) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

### 2. **API mutasi program (`POST` / `PUT` / `DELETE`) tanpa proteksi auth**

[src/app/api/programs/route.ts](src/app/api/programs/route.ts), [src/app/api/programs/[id]/route.ts](src/app/api/programs/[id]/route.ts)

**Masalah**: `proxy.ts` hanya mencocokkan `matcher: ['/admin/:path*']`, tidak mengamankan route `/api/programs/*`. Endpoint `POST /api/programs`, `PUT /api/programs/[id]`, `DELETE /api/programs/[id]` dapat dipanggil oleh siapapun yang tahu URL-nya — **publik bisa membuat, mengubah, menghapus program tanpa login**.

Dokumentasi Next.js 16 secara eksplisit memperingatkan:
> *Always verify authentication and authorization inside each Server Function rather than relying on Proxy alone.* — [proxy.md](node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md)

**Perbaikan**: Buat helper guard di `src/lib/auth.ts`:

```ts
import { cookies } from 'next/headers';

export async function requireAdmin(): Promise<boolean> {
  const session = (await cookies()).get('admin_session')?.value;
  if (!session) return false;
  return verifySessionToken(session);
}
```

Lalu di setiap handler mutasi:

```ts
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}
```

Terapkan untuk: `POST /api/programs`, `PUT /api/programs/[id]`, `DELETE /api/programs/[id]`, dan **`POST /api/upload`** (sekaligus memperbaiki bug #1).

---

### 3. **`x-pathname` header tidak pernah diset → Navbar/Footer/BackToTop bocor ke `/admin`**

[src/app/layout.tsx:86-101](src/app/layout.tsx#L86-L101)

```ts
const headersList = await headers();
const pathname = headersList.get('x-pathname') ?? '';
const isAdmin = pathname.startsWith('/admin');
```

**Masalah**: `proxy.ts` tidak pernah memanggil `requestHeaders.set('x-pathname', ...)`. `pathname` selalu string kosong, `isAdmin` selalu `false`. Akibatnya, **Navbar publik, Footer, dan BackToTop muncul juga di halaman admin** — bertabrakan dengan `AdminNav` sidebar.

**Perbaikan A (recommended)** — Pakai Route Groups, ini lebih idiomatis untuk App Router:

```
src/app/
├── (public)/
│   ├── layout.tsx        ← Navbar + Footer + BackToTop
│   ├── page.tsx          ← home
│   └── programs/
└── admin/
    ├── layout.tsx        ← AdminNav saja (sudah ada)
    └── ...
```

Setelah migrasi, hapus seluruh logika `headers()` + `isAdmin` di root layout. Root layout cukup berisi `<html>`, font, `ThemeProvider`, `Toaster`.

**Perbaikan B** — Jika tidak ingin restruktur, set header di proxy:

```ts
// proxy.ts
const requestHeaders = new Headers(request.headers);
requestHeaders.set('x-pathname', pathname);
const response = NextResponse.next({ request: { headers: requestHeaders } });
```

Tapi opsi A jauh lebih bersih.

---

### 4. **Race condition pada penulisan `programs.json`**

[src/lib/programs.ts:18-20](src/lib/programs.ts#L18-L20)

```ts
async function writePrograms(programs: Program[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(programs, null, 2), 'utf-8');
}
```

**Masalah**: Dua request POST/PUT/DELETE bersamaan akan masing-masing `readPrograms()` → modifikasi → `writePrograms()`. Hasil tulisan terakhir menimpa yang lebih awal — **data hilang diam-diam**. Selain itu, jika proses crash mid-write, file bisa rusak/parsial.

**Perbaikan**: Tulis ke file temp lalu rename (atomic):

```ts
async function writePrograms(programs: Program[]): Promise<void> {
  const tmp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(programs, null, 2), 'utf-8');
  await fs.rename(tmp, DATA_FILE);
}
```

Jika beban tulis tinggi, tambahkan mutex sederhana (`Promise` queue) atau pertimbangkan migrasi ke SQLite/Supabase — lihat catatan di [CLAUDE.md](CLAUDE.md).

---

### 5. **Path traversal & sanitasi nama folder di upload**

[src/app/api/upload/route.ts:45-50](src/app/api/upload/route.ts#L45-L50)

```ts
const folderName = title.replace(/[<>:"/\\|?*]/g, '').trim();
const uploadDir = join(process.cwd(), 'public', year, folderName);
```

**Masalah**: Sanitasi hanya menghapus karakter shell, tapi:
- `..` (dot-dot) tidak diblok → folder bisa dibuat di luar `public/`
- `\0` null byte tidak diblok
- `year` dari client (bukan validated number) — string `2024/../etc` lolos
- `ext` diambil dari `file.name` client side, tidak diverifikasi terhadap `file.type`

**Perbaikan**:

```ts
function safeSegment(s: string): string {
  return s.replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 100);
}

const yearNum = Number(formData.get('year'));
if (!Number.isInteger(yearNum) || yearNum < 2020 || yearNum > 2100) {
  return NextResponse.json({ error: 'Year invalid' }, { status: 400 });
}

const folderName = safeSegment(title);
if (!folderName) return NextResponse.json({ error: 'Title invalid' }, { status: 400 });

const typeMap: Record<string, true> = { 'main': true, 'dok-1': true, 'dok-2': true, 'dok-3': true };
if (!typeMap[type]) return NextResponse.json({ error: 'Type invalid' }, { status: 400 });

// derive ext dari MIME, bukan filename client
const extMap: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const ext = extMap[file.type];
```

Pertimbangkan juga membaca beberapa byte awal file untuk validasi magic number — `file.type` mudah dipalsukan.

---

### 6. **Timing attack pada login**

[src/app/api/auth/login/route.ts:7](src/app/api/auth/login/route.ts#L7)

```ts
if (password !== process.env.ADMIN_PASSWORD) { ... }
```

**Masalah**: Perbandingan string `!==` selesai pada karakter pertama yang beda. Penyerang dapat menyimpulkan karakter password satu per satu dengan mengukur waktu respons (timing attack).

**Perbaikan**: Pakai `crypto.timingSafeEqual`:

```ts
import { timingSafeEqual } from 'crypto';

const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? '');
const actual = Buffer.from(password ?? '');

// timingSafeEqual perlu length sama → padding
const ok =
  expected.length === actual.length &&
  timingSafeEqual(expected, actual);

if (!ok) return NextResponse.json({ error: 'Password salah' }, { status: 401 });
```

Tambahan: rate-limit endpoint login (mis. 5 attempt/15 menit per IP) untuk mencegah brute force. Untuk in-memory simpel, simpan `Map<ip, { count, resetAt }>` — atau pakai paket seperti `next-rate-limit`. Untuk multi-instance, butuh Redis/Upstash.

---

### 7. **`programs/[id]/page.tsx` — gambar hero double-wrapped & bisa h=0 lagi**

[src/app/programs/[id]/page.tsx:41-51](src/app/programs/[id]/page.tsx#L41-L51) — sudah diperbaiki (commit terakhir), tapi **`programs/page.tsx`** dan **`AboutSection.tsx`** punya pola serupa. Pastikan setiap `<Image fill>` punya parent dengan `position: relative` + height eksplisit yang **tidak** dibalut komponen lain yang merusak konteks positioning. Sudah OK saat audit, hanya catatan defensif.

---

## ⚠️ MODERAT — Sebaiknya diperbaiki sebelum produksi

### 8. **Hardcoded production URL di ShareButton**

[src/app/programs/[id]/page.tsx:158](src/app/programs/[id]/page.tsx#L158)

```ts
url={`https://tjsl-pln-uidbanten.com/programs/${program.id}`}
```

**Masalah**: Jika domain berubah atau dideploy ke preview/staging, link share akan keliru.

**Perbaikan**:

```ts
// dalam ShareButton.tsx, hilangkan prop url, derive sendiri:
const url = typeof window !== 'undefined' ? window.location.href : '';
```

Atau set `NEXT_PUBLIC_SITE_URL` dan baca dari env.

---

### 9. **Tidak ada `loading.tsx`, `error.tsx`, `not-found.tsx`**

Semua halaman App Router. Konvensi Next.js 16:

```
src/app/
├── loading.tsx     ← Skeleton global
├── error.tsx       ← Error boundary
├── not-found.tsx   ← 404
└── programs/
    ├── loading.tsx
    └── [id]/
        ├── loading.tsx
        └── not-found.tsx
```

`notFound()` dipanggil di [src/app/programs/[id]/page.tsx:35](src/app/programs/[id]/page.tsx#L35) dan [src/app/admin/programs/[id]/edit/page.tsx:14](src/app/admin/programs/[id]/edit/page.tsx#L14), tapi tanpa `not-found.tsx` user akan dapat halaman default Next.js (tidak konsisten brand).

**Perbaikan minimal**: Buat `src/app/not-found.tsx` global + `src/app/error.tsx`:

```tsx
// src/app/not-found.tsx
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-5xl font-bold mb-3">404</h1>
      <p className="text-muted-foreground mb-6">Halaman tidak ditemukan.</p>
      <Link href="/" className={cn(buttonVariants())}>Kembali ke Beranda</Link>
    </div>
  );
}
```

---

### 10. **`force-dynamic` pada semua halaman → opt-out caching tanpa alasan**

[src/app/page.tsx:10](src/app/page.tsx#L10), [src/app/programs/page.tsx:11](src/app/programs/page.tsx#L11), [src/app/admin/page.tsx:9](src/app/admin/page.tsx#L9), [src/app/admin/programs/page.tsx:11](src/app/admin/programs/page.tsx#L11)

```ts
export const dynamic = 'force-dynamic';
```

**Masalah**: Memaksa SSR setiap request, padahal data di `programs.json` hanya berubah ketika admin POST/PUT/DELETE. Halaman publik bisa di-cache dan **direvalidasi on-demand** dari API route.

**Perbaikan**: Hapus `force-dynamic`, gunakan **on-demand revalidation**:

```ts
// programs.ts — tambahkan tag
import { unstable_cache } from 'next/cache';

export const getAllPrograms = unstable_cache(
  async () => { /* baca file */ },
  ['programs-all'],
  { tags: ['programs'] }
);
```

Lalu di `POST/PUT/DELETE`:

```ts
import { revalidateTag } from 'next/cache';
// setelah mutasi:
revalidateTag('programs');
```

Halaman admin masih harus `force-dynamic` agar admin lihat hasil terbaru (atau pakai `revalidatePath('/admin/programs')`).

---

### 11. **`queryPrograms` membaca seluruh file untuk filter & paginate**

[src/lib/programs.ts:65-102](src/lib/programs.ts#L65-L102)

**Masalah**: Skala 56 program masih OK, tapi setiap request membaca + parse JSON penuh. Filter pencarian linear `O(n × m)` setiap query. Tidak ada caching.

**Perbaikan jangka pendek**: Cache hasil `readPrograms()` di memory dengan invalidasi pada write (lihat #10).

**Perbaikan jangka panjang**: Pertimbangkan migrasi ke SQLite (better-sqlite3) atau Supabase. JSON file akan berhenti scale ketika program > beberapa ratus.

---

### 12. **`ProgramFilter` — search tanpa debounce, hanya submit-form**

[src/components/programs/ProgramFilter.tsx:33-37](src/components/programs/ProgramFilter.tsx#L33-L37)

User harus klik tombol "Cari" untuk submit. Sebenarnya OK untuk UX, tapi tidak ada loading indicator dari `useTransition`.

**Perbaikan**: Pakai `isPending` dari `useTransition` untuk menampilkan spinner:

```ts
const [isPending, startTransition] = useTransition();
// ...
<Button type="submit" disabled={isPending}>
  {isPending ? 'Mencari...' : 'Cari'}
</Button>
```

---

### 13. **`ImageLightbox` — `priority` salah pasang & sizing kacau**

[src/components/programs/ImageLightbox.tsx:60-68](src/components/programs/ImageLightbox.tsx#L60-L68)

```tsx
<Image
  src={images[idx]}
  width={1200}
  height={800}
  className="max-h-[85dvh] w-auto h-auto object-contain rounded-lg"
  sizes="90vw"
  priority
/>
```

**Masalah**:
1. `priority` pada gambar yang baru muncul saat user buka lightbox — tidak relevan, hilangkan.
2. `width/height` + Tailwind `w-auto h-auto` membuat aspect-ratio konflik dan warning Next.js bisa muncul.
3. `sizes="90vw"` tidak akurat karena gambar `object-contain` di-clamp ke `max-h-85dvh`.

**Perbaikan**: Untuk lightbox, plain `<img>` lebih sederhana dan tidak perlu optimasi (semua sudah dimuat sebelumnya):

```tsx
<img
  src={images[idx]}
  alt={`${title} — foto ${idx + 1}`}
  className="max-h-[85dvh] max-w-full object-contain rounded-lg"
/>
```

Atau jika tetap pakai `next/image`, gunakan `fill` di parent dengan dimensi pasti.

---

### 14. **`AdminNav` — login button di mobile pakai `SheetTrigger render={...}` lalu children**

[src/app/admin/_components/AdminNav.tsx:74-78](src/app/admin/_components/AdminNav.tsx#L74-L78)

```tsx
<SheetTrigger render={<Button variant="ghost" size="icon" .../>}>
  <Menu className="h-5 w-5" />
</SheetTrigger>
```

**Masalah**: Di `@base-ui/react`, prop `render` merender pengganti, jadi `children` (`<Menu/>`) dilewatkan **ke `Button`** sebagai children. Ini berfungsi karena props di-merge — tapi pola yang lebih jelas:

```tsx
<SheetTrigger render={
  <Button variant="ghost" size="icon" aria-label="Menu navigasi" className="cursor-pointer">
    <Menu className="h-5 w-5" />
  </Button>
}/>
```

Sama outputnya, tapi intent lebih eksplisit.

---

### 15. **`ProgramsByYearSection` — `useRef` + `useEffect` untuk track perubahan tahun**

[src/components/home/ProgramsByYearSection.tsx:22-29](src/components/home/ProgramsByYearSection.tsx#L22-L29)

```ts
const [cardKey, setCardKey] = useState(0);
const prevYear = useRef(activeYear);

useEffect(() => {
  if (prevYear.current !== activeYear) {
    setCardKey((k) => k + 1);
    prevYear.current = activeYear;
  }
}, [activeYear]);
```

**Masalah**: Logika berlebihan. `activeYear` berubah hanya saat onClick — increment cardKey langsung di handler:

```ts
const [activeYear, setActiveYear] = useState<number>(years[0]);
const [cardKey, setCardKey] = useState(0);

const handleYearClick = (year: number) => {
  if (year !== activeYear) {
    setActiveYear(year);
    setCardKey((k) => k + 1);
  }
};
```

Hapus `prevYear` ref dan effect.

---

### 16. **`programs.json` di-`unshift` saat create → seluruh array di-shift**

[src/lib/programs.ts:40](src/lib/programs.ts#L40)

```ts
programs.unshift(program);
```

**Masalah**: `unshift` adalah `O(n)` (shift seluruh array). Untuk 56 entri tidak masalah, tapi `push` + sort by `createdAt` desc di `queryPrograms` lebih scalable. Atau biarkan `unshift` tapi sadari biayanya.

**Saran**: Tidak prioritas, tapi tambahkan sorting eksplisit di `queryPrograms` agar urutan deterministik tidak bergantung urutan tulis:

```ts
programs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
```

---

### 17. **`Toaster` tanpa konfigurasi tema**

[src/components/ui/sonner.tsx](src/components/ui/sonner.tsx) (auto-generated shadcn) dipakai langsung — toast mungkin tidak mengikuti dark mode. Cek konfigurasi `Toaster` membaca `useTheme()` dari `next-themes`.

**Perbaikan**: Pastikan komponen `Toaster` menerima prop `theme={useTheme().theme}` (template shadcn modern sudah otomatis). Verifikasi.

---

### 18. **Logo image — tidak ada fallback / lazy semua kecuali navbar**

[src/components/layout/Navbar.tsx:28-35](src/components/layout/Navbar.tsx#L28-L35) — `priority` OK karena above-fold.

[src/components/layout/Footer.tsx:14-19](src/components/layout/Footer.tsx#L14-L19) — tanpa `priority`, tanpa `sizes`. OK karena below-fold, tapi tambahkan `sizes="120px"` untuk hindari warning.

---

### 19. **Image upload preview pakai `unoptimized`**

[src/app/admin/_components/ProgramForm.tsx:269](src/app/admin/_components/ProgramForm.tsx#L269)

```tsx
<Image ... unoptimized sizes="(max-width: 768px) 100vw, 25vw" />
```

**Masalah**: `unoptimized` melewati image optimizer Next.js. Untuk preview admin yang baru di-upload, alasan masuk akal (file langsung tersedia di filesystem, tidak perlu optimasi). Tapi pertimbangkan: setelah upload selesai, gambar sudah ada di `public/` dan path-nya valid → Next.js dapat optimize.

Hapus `unoptimized` kecuali ada alasan konkret.

---

### 20. **Tidak ada CSP / security headers**

[next.config.ts](next.config.ts) kosong dari segi security.

**Perbaikan**:

```ts
const nextConfig: NextConfig = {
  images: { remotePatterns: [] },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};
```

CSP penuh (`Content-Security-Policy`) bisa ditambahkan setelah audit script eksternal.

---

### 21. **Tidak ada `robots.txt` / `sitemap.xml`**

Untuk SEO publik, App Router mendukung:

- `src/app/robots.ts`
- `src/app/sitemap.ts`

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllPrograms } from '@/lib/programs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programs = await getAllPrograms();
  const base = 'https://tjsl-pln-uidbanten.com';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/programs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...programs.map((p) => ({
      url: `${base}/programs/${p.id}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
```

---

## 🔧 MINOR — Polish & best practice

### 22. **`tsconfig.json` target ES2017** — bisa dinaikkan ke ES2022

[tsconfig.json:3](tsconfig.json#L3) — `"target": "ES2017"`. Proyek pakai Node 20.9+ dan React 19 — ES2022 (atau ES2023) aman dan menghasilkan output lebih ringkas. Bonus: bisa pakai `Array.prototype.at()`, `Object.hasOwn`, error cause, dll. tanpa polyfill.

---

### 23. **`utils.ts` — `slugify` tidak dipakai**

[src/lib/utils.ts:16-18](src/lib/utils.ts#L16-L18) — fungsi tidak direferensikan di mana pun. Hapus.

---

### 24. **`utils.ts` — formatBudget/formatCurrency disebut di CLAUDE.md tapi tidak ada**

CLAUDE.md menyebut `formatBudget` dan `formatCurrency` di [bagian Formatting Angka](CLAUDE.md). Tapi `utils.ts` hanya export `cn`, `formatNumber`, `formatDate`, `slugify`. Tidak ada `formatBudget`/`formatCurrency`.

**Aksi**: Karena field `budget` sudah dihapus (commit `9ed4b34`), update CLAUDE.md untuk menghilangkan referensi `formatBudget`/`formatCurrency`. Hapus dari dokumentasi.

---

### 25. **`Footer.tsx` — `new Date().getFullYear()` di Server Component**

[src/components/layout/Footer.tsx:5](src/components/layout/Footer.tsx#L5) — Server Component yang merender sekali per request. Kalau halaman pakai static caching (lihat #10), tahun bisa "stuck" sampai revalidasi. Akhir tahun → bug copyright.

**Perbaikan**: Render di client minimal:

```tsx
'use client';
// atau pakai suppressHydrationWarning + render via JS
```

Lebih sederhana: terima kompromi (tahun update saat revalidate) atau hardcode dengan ekspor `dynamic` di footer.

---

### 26. **`AnimatedCounter` & `ReadingProgress` — scroll listener tanpa throttle**

[src/components/ui/ReadingProgress.tsx:8-14](src/components/ui/ReadingProgress.tsx#L8-L14)
[src/components/ui/BackToTop.tsx:10-13](src/components/ui/BackToTop.tsx#L10-L13)

Listener berjalan tiap scroll event (60-120fps). Untuk progress bar visual, `requestAnimationFrame` throttle akan lebih halus + hemat baterai:

```ts
useEffect(() => {
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```

---

### 27. **Zod schemas duplikat antara form & API**

[src/app/admin/_components/ProgramForm.tsx:19-35](src/app/admin/_components/ProgramForm.tsx#L19-L35) dan [src/app/api/programs/route.ts:6-22](src/app/api/programs/route.ts#L6-L22) hampir identik (kecuali `tags` string vs array).

**Perbaikan**: Pindah ke `src/lib/schemas.ts`, share antara client & server:

```ts
// src/lib/schemas.ts
import { z } from 'zod';

export const programBaseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  // ...
});

export const programApiSchema = programBaseSchema.extend({
  tags: z.array(z.string()),
});

export const programFormSchema = programBaseSchema.extend({
  tags: z.string(), // form-level, di-split saat submit
});
```

---

### 28. **`type ProgramFormData = Omit<Program, 'id' | 'createdAt' | 'updatedAt'>`** — tapi `Program` punya `images?` yang opsional

[src/types/index.ts:67](src/types/index.ts#L67) — OK secara teknis, tapi pastikan `ProgramFormData` cocok dengan schema validasi. Audit cepat: cocok.

---

### 29. **AboutSection — image path hardcoded**

[src/components/home/AboutSection.tsx:54](src/components/home/AboutSection.tsx#L54)

```tsx
<Image src="/2025/Desa Berdaya Agrowisata Kopi/main.jpg" ... />
```

**Masalah**: Jika program ini dihapus dari `programs.json`, file masih ada tapi referensi dari about jadi nyangkut.

**Perbaikan**: Buat constant atau ambil dari program "featured" yang diberi flag.

---

### 30. **`Eye`/`EyeOff` di login — strokeWidth lebar inkonsisten**

[src/app/admin/login/page.tsx:81](src/app/admin/login/page.tsx#L81) — pakai `strokeWidth={1.75}`. Konsisten dengan project, OK.

---

### 31. **Komentar `eslint-disable-next-line react-hooks/incompatible-library`**

[src/app/admin/_components/ProgramForm.tsx:105](src/app/admin/_components/ProgramForm.tsx#L105)

```ts
// eslint-disable-next-line react-hooks/incompatible-library
const current = watch('images') ?? [];
```

**Masalah**: `watch()` di event handler tidak ideal (re-render heavy). Lebih baik pakai `getValues()`:

```ts
import { useFormContext } from 'react-hook-form';
// di handleUpload:
const current = getValues('images') ?? [];
```

`getValues` dari `useForm` destructure. Tidak triggering re-render.

---

### 32. **`react-hooks/set-state-in-effect` di ThemeToggle**

[src/components/layout/ThemeToggle.tsx:12-13](src/components/layout/ThemeToggle.tsx#L12-L13)

```ts
// eslint-disable-next-line react-hooks/set-state-in-effect
useEffect(() => { setMounted(true); }, []);
```

**Masalah**: Pola anti-hydration-mismatch yang sudah dikenal `next-themes`. Karena ini one-time, OK tapi alternatif: pakai `useSyncExternalStore` atau cek `typeof window !== 'undefined'`. Atau biarkan, ini convention.

---

### 33. **`ProgramFilter.tsx` — `useSearchParams` membuat halaman dynamic**

[src/components/programs/ProgramFilter.tsx:19](src/components/programs/ProgramFilter.tsx#L19) — `useSearchParams` di Client Component sudah benar. Tapi pastikan komponen dibungkus `Suspense` jika di Server Component parent ingin static. Saat ini parent (`programs/page.tsx`) sudah `force-dynamic`, jadi tidak ada warning.

Setelah perbaikan #10 (hilangkan force-dynamic), tambahkan:

```tsx
import { Suspense } from 'react';
<Suspense fallback={null}>
  <ProgramFilter ... />
</Suspense>
```

---

### 34. **`lucide-react ^1.16.0`** — versi mayor baru

`lucide-react` baru saja rilis v1.x (2026). API icon tetap, tapi tree-shaking dan bundle size mungkin berubah. Audit: tidak ada breaking change pada icon yang dipakai (`ChevronLeft`, `MapPin`, dll). OK.

---

### 35. **`uuid ^14.0.0`** — versi mayor baru

`uuid` v14 mengubah default export (sudah ESM-only). Di [src/lib/programs.ts:3](src/lib/programs.ts#L3) dipakai `import { v4 as uuidv4 } from 'uuid';` — benar untuk v14. OK.

---

### 36. **Aspect ratio gambar program — `aspect-[16/9]` di card vs `aspect-[4/3]` di about**

Tidak masalah, sengaja. Hanya catatan: foto program orisinal punya aspect bervariasi. Pertimbangkan pipeline preprocessing (sharp) untuk normalisasi.

---

### 37. **`globals.css` — `--font-heading: var(--font-sans);`**

[src/app/globals.css:21](src/app/globals.css#L21) — `--font-heading` aliased ke `--font-sans`!

**Masalah**: CLAUDE.md menyatakan heading harus `Outfit` (dimuat di layout.tsx sebagai `--font-heading`). Tapi di `@theme inline`, `--font-heading` di-override jadi `--font-sans` (Jost). **Akibatnya semua `font-heading` kelas merender Jost, bukan Outfit.**

[src/app/layout.tsx:11-23](src/app/layout.tsx#L11-L23) — sudah benar mendeklarasikan kedua font.

**Perbaikan**:

```css
@theme inline {
  --font-sans: var(--font-sans);     /* Jost */
  --font-heading: var(--font-heading); /* Outfit — bukan re-alias ke --font-sans! */
  --font-mono: var(--font-geist-mono);
  ...
}
```

Verifikasi visual: `class="font-heading"` di hero seharusnya Outfit yang lebih display, bukan Jost.

> **Ini sebenarnya issue kritis untuk visual brand**, harusnya naik ke moderat — tapi tidak menyebabkan crash, jadi tetap di minor.

---

### 38. **Eslint config — overrides di `react-hooks/incompatible-library` & `set-state-in-effect`**

Beberapa file pakai disable inline. Pertimbangkan pindahkan ke override per-file di `eslint.config.mjs` jika polanya berulang.

---

### 39. **Komentar TODO / placeholder hardcoded**

Audit grep:
- `value: 'tjsl@pln-uidbanten.co.id'` — pastikan ini email aktif, atau ganti dengan email resmi PLN.
- Alamat `Jl. Jend. Sudirman No. 1, Sukasari, Kec. Tangerang...` di [ContactSection.tsx:8](src/components/home/ContactSection.tsx#L8) — verifikasi dengan tim PLN.

---

### 40. **Skripts package.json**

[package.json:6](package.json#L6) — `NODE_OPTIONS='--no-deprecation'` membungkam semua deprecation warning. Risiko: warning Next.js 16 → 17 nanti tidak terlihat. Pertimbangkan hapus setelah upgrade clean.

---

## 📋 Ringkasan prioritas

| # | Item | Severity | Estimasi |
|---|---|---|---|
| 1 | Auth bypass `/api/upload` | 🚨 Kritis | 5 menit |
| 2 | API mutasi tanpa auth | 🚨 Kritis | 30 menit |
| 3 | `isAdmin` selalu false (layout) | 🚨 Kritis | 30 menit (route groups) |
| 4 | Race condition `programs.json` | 🚨 Kritis | 10 menit |
| 5 | Path traversal upload | 🚨 Kritis | 20 menit |
| 6 | Timing attack login | 🚨 Kritis | 10 menit |
| 8 | Hardcoded share URL | ⚠️ Moderat | 5 menit |
| 9 | Tambah error/not-found/loading | ⚠️ Moderat | 30 menit |
| 10 | Hilangkan force-dynamic + on-demand revalidation | ⚠️ Moderat | 1 jam |
| 20 | Security headers | ⚠️ Moderat | 15 menit |
| 21 | Sitemap & robots | ⚠️ Moderat | 20 menit |
| 37 | `--font-heading` re-alias bug | 🔧 Minor (tapi visual) | 2 menit |

**Total estimasi perbaikan kritis: ~2 jam.**

---

## 📚 Referensi dokumentasi yang dipakai

- Next.js 16: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
- Next.js 16 Auth Guide: `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- Tailwind v4: `@theme inline` syntax (sudah diverifikasi via globals.css)
- shadcn v4 / `@base-ui/react`: pola `render={...}` (tanpa `asChild`) — sudah konsisten di codebase
- zod v4: `z.enum(['a','b'])` + `z.number().int()` — sudah benar, tidak pakai `z.coerce.*`
- `jose` v6: `SignJWT` + `jwtVerify` — pola sudah benar

---

*Audit selesai. Untuk pertanyaan lanjut atau bantuan implementasi perbaikan tertentu, sebut nomor item.*
