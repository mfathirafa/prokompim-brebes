# Laporan Progres Harian — 23 September 2026

**Nama:** Muhammad Fathi Rafa (Magang)  
**Proyek:** Portal Web Bagian Protokol dan Komunikasi Pimpinan (Prokompim) Setda Brebes  
**Tech Stack:** Next.js 16 + Supabase + Tailwind CSS + Vercel  
**Live URL:** [https://prokompim-brebeskab.vercel.app](https://prokompim-brebeskab.vercel.app)

---

## 1. Ringkasan Pekerjaan Hari Ini

Hari ini fokus pada pembangunan **fondasi Modul Panel Admin (`/admin`)** — mencakup layout global admin dengan sidebar responsif, halaman Dashboard dengan statistik real-time, serta persiapan kode aksi server untuk manajemen berita. Branch baru `feat/admin-panel` dibuat dari `main`.

---

## 2. Rincian Pekerjaan & Fitur yang Dikerjakan

### A. Layout Admin Panel (`src/app/admin/layout.tsx`)
* **`"use client"` Component** — mengelola state user, profil, dan navigasi aktif di sisi browser.
* **Sidebar Desktop (w-64):**
  * Logo Brebes + teks "Admin Prokompim" dan "Setda Kab. Brebes" di bagian atas.
  * Daftar navigasi dari `ADMIN_SIDEBAR_LINKS` (`@/lib/constants`) dengan icon Lucide yang di-map secara dinamis via `ICON_MAP`.
  * Indikator link aktif: `bg-primary/10 text-primary border-l-2 border-primary`.
  * Latar belakang sidebar: `bg-muted/30 border-r border-border`.
* **Sidebar Mobile (Sheet):**
  * Hamburger icon (`<Menu />`) di topbar yang membuka `<Sheet side="left">` berisi konten sidebar yang sama.
* **Topbar:**
  * Judul halaman dinamis di kiri (berdasarkan link aktif saat ini).
  * Nama admin dan email di kanan (di-fetch dari tabel `profiles`).
  * Avatar inisial dengan latar `bg-primary`.
* **Footer Sidebar:**
  * Tautan "Lihat Website" ke `/` (buka tab baru).
  * Tombol Keluar (Logout) — memanggil `supabase.auth.signOut()` lalu redirect ke `/`.
* Fetch user profile dari tabel `profiles` menggunakan `createClient()` dari `@/lib/supabase/client`.

### B. Halaman Dashboard (`src/app/admin/page.tsx`)
* **Server Component** — seluruh data di-fetch sisi server menggunakan `Promise.all` secara paralel.
* **4 Stats Card (grid 2x2 → 4 kolom di layar besar):**
  * Total Berita Published → `count` dari `berita WHERE status='published'` (accent `border-l-primary`)
  * Total File Download → `count` dari `files_download WHERE is_active=true` (accent `border-l-brand-sky`)
  * Total Member → `count` dari `profiles WHERE role='member'` (accent `border-l-brand-gold`)
  * Komentar Pending → `count` dari `komentar WHERE is_approved=false` (accent `border-l-brand-red`)
  * Setiap card dapat diklik dan mengarah ke halaman kelola masing-masing.
* **Tabel "Berita Terbaru"** (5 data terbaru):
  * Kolom: Judul (link ke detail), Kategori, Views, Tanggal, Status badge.
  * Status badge: *Published* (hijau emerald), *Draft* (abu zinc).
* **Tabel "Komentar Pending"** (5 data terbaru):
  * Kolom: Nama pengirim, Cuplikan isi, Judul berita, Tanggal.
  * Shortcut link ke halaman moderasi `/admin/komentar`.

### C. Git
* Branch baru dibuat: `feat/admin-panel` dari `main`.
* WIP commit: `feat: tambah admin layout dan dashboard page`.

---

## 3. Status Milestone Proyek

| Milestone | Target | Status Realisasi | Keterangan |
|---|---|---|---|
| M1: Requirement & Setup | 19 Sep 2026 | ✅ Selesai (14 Sep) | Setup Next.js, Supabase, branding |
| M2: Desain & Database Ready | 26 Sep 2026 | ✅ Selesai (16 Sep) | Skema database, seed data, storage |
| M3: Prototype V1 Siap Demo | 10 Okt 2026 | ✅ Selesai (22 Sep) | Tuntas 18 hari lebih cepat dari jadwal |
| M4: Evaluasi Pasca Demo | 17 Okt 2026 | ⏳ Menunggu Demo | Menampung masukan stakeholder |
| **M5: Modul Panel Admin** | **31 Okt 2026** | 🔄 **Dalam Pengerjaan** | **Layout + Dashboard selesai hari ini** |
| M6: Finalisasi & Serah Terima | 12 Nov 2026 | ⏳ Dijadwalkan | Deployment akhir & dokumentasi |

---

## 4. Rencana Kerja Selanjutnya (Sesi Berikutnya)

1. **Server Actions Berita** (`src/app/admin/berita/actions.ts`):
   * `toggleBeritaStatus(id, currentStatus)` — toggle Published ↔ Draft + `revalidatePath`.
   * `deleteBerita(id)` — hapus berita + komentar terkait + `revalidatePath`.
2. **Halaman Kelola Berita** (`src/app/admin/berita/page.tsx`):
   * Tabel semua berita dengan filter tab (Semua / Published / Draft via `?status=`).
   * Kolom aksi: Edit, Toggle Status, Hapus.
   * Pagination 10 item per halaman via `?page=`.
3. **Perbaikan typo minor** pada `page.tsx` (nama variabel & class Tailwind).
4. **`npm run build`** validasi lolos 100%, lalu commit final branch `feat/admin-panel`.
