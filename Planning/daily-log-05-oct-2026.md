# Laporan Progres Harian — 05 Oktober 2026

**Nama:** Muhammad Fathi Rafa (Magang)  
**Proyek:** Portal Web Bagian Protokol dan Komunikasi Pimpinan (Prokompim) Setda Brebes  
**Tech Stack:** Next.js 16 (Turbopack) + Supabase SSR + Tailwind CSS + Vercel  
**Live URL:** [https://prokompim-brebeskab.vercel.app](https://prokompim-brebeskab.vercel.app)  
**Branch:** `feat/admin-panel`

---

## 1. Ringkasan Pekerjaan Hari Ini

Hari ini fokus pada penuntasan siklus penuh **CRUD Berita Admin**, pembangunan **Modul Moderasi Komentar Publik**, perbaikan bug **Base UI**, serta penyempurnaan **Sistem Autentikasi & Otorisasi Role Admin**:

### Sesi Pagi: CRUD Berita & Moderasi Komentar
1. **Halaman Edit Berita (`/admin/berita/[id]/edit/page.tsx`)**:
   - Server Component dengan penanganan `params` dinamis asynchronous Next.js 16 (`await params`).
   - Mengambil data eksisting berita (`id, judul, slug, ringkasan, isi, gambar_url, kategori_id, status`) dari Supabase beserta daftar kategori.
   - Terintegrasi dengan komponen formulir `BeritaForm` (mode `isEdit = true`) dan server action `updateBerita`.

2. **Modul Moderasi Komentar Admin (`/admin/komentar`)**:
   - **Server Actions (`actions.ts`)**: Fungsi `approveKomentar`, `rejectKomentar`, dan `deleteKomentar` lengkap dengan revalidasi cache Next.js (`/admin/komentar`, `/admin`, `/berita`).
   - **Client Row Actions (`komentar-actions.tsx`)**: Tombol aksi baris untuk menyetujui, membatalkan persetujuan, dan menghapus komentar secara aman (konfirmasi dialog & transisi loading `useTransition`).
   - **Tabel & Filter Moderasi (`page.tsx`)**:
     - Filter tab status: *Semua*, *Menunggu Moderasi (Pending)*, dan *Disetujui (Approved)* dengan jumlah counter dinamis.
     - Pencarian teks berdasarkan nama pengirim atau isi komentar.
     - Relasi relasional ke rilis berita terkait lengkap dengan tautan pratinjau publik.
     - Paginasi server-side 10 item per halaman (`ADMIN_ITEMS_PER_PAGE = 10`).

### Sesi Siang: Bug Fixing UI & Otentikasi Role Admin
3. **Perbaikan Crash Base UI (`DropdownMenuLabel`)**:
   - **Gejala**: Uncaught Error `Base UI: MenuGroupContext is missing. Menu group parts must be used within <Menu.Group> or <Menu.RadioGroup>`.
   - **Solusi**: Mengganti implementasi internal `DropdownMenuLabel` pada `src/components/ui/dropdown-menu.tsx` dari `MenuPrimitive.GroupLabel` menjadi elemen `div` kustom agar kompatibel digunakan bebas sebagai header informasi akun user di Navbar.

4. **Resolusi Otorisasi Role Admin & Guard Middleware**:
   - **Gejala**: Akun user yang sudah diatur role admin di database tetap terbaca sebagai "member" di Navbar dan dialihkan (*redirect*) saat mengakses rute `/admin`.
   - **Investigasi Akar Masalah**: Ditemukan Postgres error `42501 (permission denied for table profiles & files_download)` karena belum adanya hak akses skema publik untuk role database.
   - **Solusi**: Beralih ke arsitektur role berbasis **Supabase Auth JWT `app_metadata`**:
     - Membuat script otomasi `scripts/create-admin.mjs` dan `scripts/set-admin-role.mjs`.
     - Menyuntikkan klaim role `"admin"` langsung ke dalam `app_metadata` Supabase Auth untuk akun admin (`admin@prokompim-brebes.go.id` dan `admin@prokompim.go.id`).
     - Memperbarui `src/middleware.ts` untuk memeriksa otorisasi admin langsung dari `user.app_metadata.role` (100% bypass RLS, zero database query overhead).
     - Memperbarui `src/components/layout/navbar.tsx` dan `src/app/admin/layout.tsx` dengan resolver profil yang mengutamakan role dari token JWT session user.

5. **Pengujian & Validasi Build**:
   - Menjalankan `next build` (Turbopack) dengan hasil **100% SUKSES** tanpa ada error TypeScript maupun sintaks pada seluruh 18 route.

---

## 2. Rincian File yang Dibuat & Dimodifikasi

| No | Path File | Status | Keterangan |
|---|---|---|---|
| 1 | `src/app/admin/berita/[id]/edit/page.tsx` | File Baru | Halaman edit berita admin |
| 2 | `src/app/admin/komentar/actions.ts` | File Baru | Server actions moderasi komentar |
| 3 | `src/app/admin/komentar/komentar-actions.tsx` | File Baru | Komponen tombol aksi baris komentar |
| 4 | `src/app/admin/komentar/page.tsx` | File Baru | Halaman tabel kelola & moderasi komentar |
| 5 | `scripts/create-admin.mjs` | File Baru | Script pembuatan akun admin via Supabase Admin API |
| 6 | `scripts/set-admin-role.mjs` | File Baru | Script injeksi `app_metadata.role = 'admin'` |
| 7 | `src/components/ui/dropdown-menu.tsx` | Dimodifikasi | Fix Base UI `MenuGroupContext` pada `DropdownMenuLabel` |
| 8 | `src/middleware.ts` | Dimodifikasi | Guard `/admin` berbasis `app_metadata` JWT |
| 9 | `src/components/layout/navbar.tsx` | Dimodifikasi | Resolusi profil & role admin dari JWT user |
| 10 | `src/app/admin/layout.tsx` | Dimodifikasi | Fallback profil admin dari JWT user |
| 11 | `Planning/daily-log-05-oct-2026.md` | Dimodifikasi | Pembaruan laporan harian komprehensif |
| 12 | `Planning/progress.md` | Dimodifikasi | Pembaruan status milestone M5 & riwayat harian |

---

## 3. Status Milestone Proyek

| Milestone | Target | Status Realisasi | Keterangan |
|---|---|---|---|
| M1: Requirement & Setup | 19 Sep 2026 | ✅ Selesai (14 Sep) | Setup Next.js, Supabase, branding |
| M2: Desain & Database Ready | 26 Sep 2026 | ✅ Selesai (16 Sep) | Skema database, seed data, storage |
| M3: Prototype V1 Siap Demo | 10 Okt 2026 | ✅ Selesai (22 Sep) | Tuntas 18 hari lebih cepat dari jadwal |
| M4: Evaluasi Pasca Demo | 17 Okt 2026 | ⏳ Menunggu Demo | Menampung masukan stakeholder |
| **M5: Modul Panel Admin** | **31 Okt 2026** | 🔄 **Dalam Pengerjaan** | **Layout, Dashboard, CRUD Berita Penuh, Moderasi Komentar, & Auth Admin Selesai** |
| M6: Finalisasi & Serah Terima | 12 Nov 2026 | ⏳ Dijadwalkan | Deployment akhir & serah terima |

---

## 4. Kendala & Penyelesaian Teknis Hari Ini

1. **Base UI MenuGroupContext Missing**:
   - *Penyebab*: `MenuPrimitive.GroupLabel` harus berada di dalam `<Menu.Group>`.
   - *Solusi*: Komponen disederhanakan menjadi elemen `div` kustom ber-styling data atribut Tailwind yang sama tanpa keterikatan context.
2. **Role Member Persistent & Redirect /admin**:
   - *Penyebab*: Postgres table privileges schema `public` belum di-grant ke `anon`/`authenticated`, memicu code `42501 (permission denied)`.
   - *Solusi*: Mengalihkan sistem pengecekan role ke `app_metadata` JWT Supabase Auth yang terbebas dari restriksi tabel RLS.

---

## 5. Rencana Kerja Selanjutnya

1. Pembuatan modul **Kelola Agenda Kegiatan** (`/admin/kegiatan`).
2. Pembuatan modul **Kelola Dokumen Unduhan** (`/admin/download`).
3. Pembuatan modul **Kelola Penghargaan Daerah** (`/admin/penghargaan`).
