# Progress TJSL PLN UID Banten

## ✅ Sudah Selesai

- [x] Struktur folder `public/{2024,2025,2026}/{judul-program}/` selesai dibuat (56 folder)
- [x] Data 56 program dari Excel RKA tahun 2024–2026 tersimpan di `data/programs.json`
- [x] Halaman publik: Home, Programs (listing + filter + pagination), Detail Program
- [x] Admin panel: Login, Dashboard, CRUD Program, Upload gambar
- [x] Auth: JWT via jose, httpOnly cookie (`admin_session`)
- [x] Animasi scroll reveal via `FadeIn` component

## 🔜 Selanjutnya: Ganti Semua Gambar Unsplash dengan Gambar Asli

**Latar Belakang:**
Saat ini semua `imageUrl` di `data/programs.json` masih pakai Unsplash (56 entri + fallback di `ProgramGallery.tsx`). Ini bersifat sementara dan harus diganti dengan foto asli dari kegiatan TJSL.

**Status infrastructure:**
- ✅ Komponen `ProgramGallery` sudah ada dan siap pakai (navigasi thumbnails, counter)
- ✅ Tipe `Program` sudah punya field `images?: string[]` (opsional)
- ✅ Halaman detail program sudah memanggil `<ProgramGallery>` dengan props `imageUrl`, `images`, `category`, `title`
- ⏳ Yang kurang: data `images` di `programs.json` masih belum ada (perlu diisi)
- ⏳ `CATEGORY_FALLBACKS` di `ProgramGallery.tsx` masih berisi URL Unsplash

**Folder tujuan:** `public/{tahun}/{judul-program}/`

### Yang Perlu Dilakukan:

### 1. Kumpulkan Foto Asli

Tempatkan file gambar asli (format: `.jpg`, `.png`, `.webp`) ke:
```
public/2024/Desa Berdaya - Agrowisata Kopi/
public/2024/Desa Berdaya - Budidaya Ikan/
public/2024/Program Bambu Cetak Kreatif/
... (56 folder total)
```

Setiap program butuh **4 foto**:
- `main.{ext}` — foto utama (tampilan hero/card)
- `dok-1.{ext}` — foto dokumentasi kegiatan #1
- `dok-2.{ext}` — foto dokumentasi kegiatan #2
- `dok-3.{ext}` — foto dokumentasi kegiatan #3

### 2. Update `data/programs.json`

Ubah `imageUrl` dan tambah `images` di setiap program:
```json
{
  "imageUrl": "/2024/Desa Berdaya - Agrowisata Kopi/main.jpg",
  "images": [
    "/2024/Desa Berdaya - Agrowisata Kopi/dok-1.jpg",
    "/2024/Desa Berdaya - Agrowisata Kopi/dok-2.jpg",
    "/2024/Desa Berdaya - Agrowisata Kopi/dok-3.jpg"
  ]
}
```

### 3. Update `ProgramGallery.tsx`

- Hapus `CATEGORY_FALLBACKS` — tidak perlu lagi karena setiap program punya fotonya sendiri
- Jika `gallery.length <= 1`, jangan render komponen galeri (sembunyikan section "Foto Kegiatan")

### 4. Update Upload API (`src/app/api/upload/route.ts`)

Saat ini upload menyimpan ke `public/uploads/{uuid}.{ext}`. Perlu diubah agar:

1. Menerima parameter `year`, `title`, `type` (`main` / `dok-1` / `dok-2` / `dok-3`)
2. Menyimpan file ke `public/{year}/{title}/{type}.{ext}`
3. Output: `{url: "/2025/HUB UMKM PLN UID Banten/main.jpg"}`

### 5. Update `ProgramForm.tsx`

- Kirim data `year`, `title`, `type` ke upload endpoint
- Sediakan 4 upload area: 1 untuk foto utama (`main`), 3 untuk dokumentasi (`dok-1` `dok-2` `dok-3`)
- Tampilkan preview untuk keempat foto
- Validasi minimal `imageUrl` (foto utama) harus diisi

### 6. Update Validasi Zod

- `src/app/api/programs/route.ts` — ubah `imageUrl: z.string().url()` jadi menerima path lokal
- `ProgramForm.tsx` — sesuaikan schema agar path lokal valid

### Catatan

- Total: 56 program × 4 foto = 224 foto asli
- Foto harus dari dokumentasi kegiatan TJSL yang sesuai program masing-masing
- Setelah gambar terkumpul, jalankan `npm run build` untuk verifikasi path
