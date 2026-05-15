# TJSL PLN UID Banten

Website informasi program Tanggung Jawab Sosial dan Lingkungan (TJSL) PT PLN (Persero) Unit Induk Distribusi Banten.

Dibangun menggunakan [Next.js](https://nextjs.org) (App Router) dengan TypeScript, Tailwind CSS, dan shadcn/ui.

## Fitur

### Halaman Publik
- **Beranda** — Hero, statistik, tentang TJSL dengan 6 pilar, program per tahun (tab 2024–2026), kontak, dan unduh RKA.
- **Program** — Daftar program CSR dengan pencarian, filter tahun & kategori, pagination, dan URL yang bisa di-bookmark.
- **Detail Program** — Informasi lengkap setiap program (deskripsi, dampak, lokasi, anggaran, status, tags).

### Panel Admin (`/admin`)
- Login dengan password (JWT via httpOnly cookie, 24 jam).
- Dashboard dengan ringkasan statistik dan breakdown status.
- CRUD program: tambah, edit, lihat daftar, dan hapus program.
- Form terintegrasi dengan validasi Zod + react-hook-form.

### API
- `GET /api/programs` — Query program (filter: tahun, kategori, status, kata kunci; pagination).
- `POST /api/programs` — Tambah program baru.
- `GET /api/programs/[id]` — Detail program.
- `PUT /api/programs/[id]` — Update program.
- `DELETE /api/programs/[id]` — Hapus program.
- `POST /api/auth/login` — Login admin.
- `POST /api/auth/logout` — Logout admin.

## Tech Stack

| Teknologi | Keterangan |
|---|---|
| Next.js 16 | App Router |
| TypeScript | — |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Komponen UI (Radix UI) |
| JWT (jose) | Autentikasi admin |
| react-hook-form + Zod | Form & validasi |
| lucide-react | Ikon |
| sonner | Notifikasi toast |
| JSON file (`data/programs.json`) | Penyimpanan data |

## Struktur Proyek

```
src/
├── proxy.ts                  # Proteksi route admin (Next.js 16 middleware)
├── types/index.ts            # Tipe data Program, dll.
├── lib/
│   ├── programs.ts           # CRUD program
│   ├── auth.ts               # JWT session
│   ├── constants.ts          # Label, warna, konfigurasi
│   └── utils.ts              # Helper: format mata uang, tanggal, dll.
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── home/                 # Hero, Stats, About, ProgramsByYear, Contact, Download
│   ├── programs/             # ProgramCard, ProgramFilter
│   └── ui/                   # Komponen shadcn/ui
└── app/
    ├── page.tsx              # Beranda
    ├── programs/             # Listing & detail program
    ├── admin/                # Panel admin (dashboard, CRUD, login)
    └── api/                  # REST API
```

## Memulai

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Environment Variables

Buat `.env.local`:

```
ADMIN_PASSWORD=your-password
ADMIN_SESSION_SECRET=your-jwt-secret-min-32-chars
```

## Catatan

- Data program disimpan di `data/programs.json` (membutuhkan filesystem persistent — tidak kompatibel dengan serverless read-only Vercel tanpa migrasi).
- Semua UI dalam Bahasa Indonesia.
