# 📦 DOKUMEN SERAH TERIMA & PANDUAN DEPLOYMENT MANDIRI (INTERNAL)
**Portal Web Resmi Bagian Protokol dan Komunikasi Pimpinan (Prokompim)**  
**Sekretariat Daerah Kabupaten Brebes**

---

## DAFTAR ISI
1. [Berita Acara Serah Terima (BAST) Internal](#1-berita-acara-serah-terima-bast-internal)
2. [Spesifikasi Teknis Sistem](#2-spesifikasi-teknis-sistem)
3. [Panduan Deployment Mandiri (Vercel & Supabase)](#3-panduan-deployment-mandiri)
4. [Daftar Kebutuhan Environment Variables](#4-daftar-kebutuhan-environment-variables)
5. [Skrip Migrasi Basis Data & Konfigurasi Storage](#5-skrip-migrasi-basis-data--konfigurasi-storage)
6. [SOP Operasional & Pemeliharaan Rutin](#6-sop-operasional--pemeliharaan-rutin)

---

## 1. Berita Acara Serah Terima (BAST) Internal

```
========================================================================================
                      PEMERINTAH KABUPATEN BREBES
                     SEKRETARIAT DAERAH KABUPATEN BREBES
            BAGIAN PROTOKOL DAN KOMUNIKASI PIMPINAN (PROKOMPIM)
               Jl. Pangeran Diponegoro No. 141, Brebes, Jawa Tengah
========================================================================================

                 BERITA ACARA SERAH TERIMA APLIKASI WEB PORTAL
                         BAGIAN PROKOMPIM SETDA BREBES
                     Nomor: 000.1.2/BAST-TIK/PROKOMPIM/2026

Pada hari ini, Rabu, tanggal Dua Puluh Delapan bulan Oktober tahun Dua Ribu Dua Puluh Enam (28-10-2026), 
telah dilaksanakan serah terima hasil perancangan dan pembangunan sistem perangkat lunak aplikasi 
berbasis web antara:

I.  Nama          : Muhammad Fathi Rafa
    Peran         : Pengembang Sistem / Mahasiswa Magang Pengembang Web
    Selanjutnya disebut sebagai PIHAK PERTAMA.

II. Nama          : Bagian Protokol dan Komunikasi Pimpinan
    Instansi      : Sekretariat Daerah Kabupaten Brebes
    Selanjutnya disebut sebagai PIHAK KEDUA.

Kedua belah pihak menyatakan sebagai berikut:
1. PIHAK PERTAMA telah menyelesaikan pembangunan Website Portal Humas, Berita, Agenda, 
   Dokumen, dan Liputan Pimpinan Bagian Prokompim Setda Brebes sesuai ruang lingkup yang disepakati.
2. Hasil pekerjaan yang diserahkan meliputi:
   a. Source code aplikasi Next.js (App Router, Turbopack, Tailwind CSS).
   b. Skema basis data relasional PostgreSQL (Supabase) beserta Row Level Security (RLS).
   c. Dokumentasi teknis, petunjuk operasional, dan panduan deployment mandiri.
3. PIHAK KEDUA menerima hasil penyerahan tersebut dalam kondisi siap operasional (production ready) 
   setelah melalui pengujian mutu, audit keamanan, dan verifikasi fitur.

Demikian Berita Acara Serah Terima ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.

        PIHAK PERTAMA,                                    PIHAK KEDUA,
     Pengembang Sistem,                            Pejabat / PIC Bagian Prokompim
                                                       Setda Kabupaten Brebes


 ( Muhammad Fathi Rafa )                            ( _________________________ )
========================================================================================
```

---

## 2. Spesifikasi Teknis Sistem

* **Framework Web:** Next.js 16.3.4 (React 19, Server Components & Server Actions, Turbopack).
* **Styling & UI:** Tailwind CSS v4, Lucide React, Shadcn UI primitives, Recharts.
* **Basis Data & Autentikasi:** Supabase (PostgreSQL 15+, Supabase SSR Auth, Realtime Postgres Changes).
* **Penyimpanan Berkas (Object Storage):** Supabase Storage (Buckets: `berita-images`, `penghargaan-images`, `liputan-photos`, `download-files`, `ekoran-files`).
* **Fitur Utama Terintegrasi:**
  1. Portal Publik: Beranda warta, Profil Prokompim, Agenda Pimpinan, Galeri Liputan Dokumentasi, Arsip Dokumen Unduhan Sambutan, E-Koran Daerah.
  2. Panel Administrasi: CRUD Berita, Kegiatan, Liputan, Download, E-Koran, Penghargaan, Moderasi Komentar, dan Manajemen Pengguna.
  3. Hardening Keamanan: Row Level Security (RLS) di 11 tabel, JWT validation, CSRF/XSS protection via Server Actions.
  4. Analitik & Audit: Dashboard statistik grafik views berita (Recharts), Activity Audit Trail (`activity_log`), Notifikasi komentar realtime.
  5. Fitur Penunjang: Mode Terang/Gelap adaptif (`next-themes`), Ekspor Rekapitulasi CSV/Excel (BOM UTF-8), SEO Dinamis (sitemap.xml & robots.txt).

---

## 3. Panduan Deployment Mandiri

### Opsi Rekomendasi: Deployment ke Vercel (Produksi)
1. **Persiapan Repository Git:**
   - Push branch `main` ke repository GitHub / GitLab instansi.
2. **Koneksi Proyek di Vercel:**
   - Masuk ke dashboard [https://vercel.com](https://vercel.com).
   - Klik **"Add New Project"** -> Import repository bersangkutan.
   - Tetapkan **Root Directory** ke folder `web` (bila menggunakan monorepo/subfolder).
   - Framework preset otomatis terdeteksi: **Next.js**.
3. **Konfigurasi Domain Dinas (brebeskab.go.id):**
   - Di menu *Settings > Domains*, tambahkan domain resmi misalnya `prokompim.brebeskab.go.id`.
   - Konfigurasikan CNAME di DNS Kominfo Brebes:
     - `prokompim.brebeskab.go.id` -> `cname.vercel-dns.com`

---

## 4. Daftar Kebutuhan Environment Variables

Pastikan variabel-variabel berikut telah dimasukkan pada menu *Environment Variables* di platform hosting:

```env
# ─── SUPABASE CREDENTIALS ───
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT-ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (Anon Public Key)
SUPABASE_SERVICE_ROLE_KEY=eyJh... (Service Role Key - RAHASIA / Server-only)

# ─── URL WEBSITE ───
NEXT_PUBLIC_SITE_URL=https://prokompim.brebeskab.go.id
```

---

## 5. Skrip Migrasi Basis Data & Konfigurasi Storage

Sebelum aplikasi diluncurkan di server baru, jalankan berkas migrasi SQL berikut secara berurutan di menu **Supabase Dashboard > SQL Editor**:

1. `supabase/migrations/20261028_rls_security_hardening.sql`  
   *(Mengaktifkan RLS, isolasi hak akses tabel, dan policy admin)*
2. `supabase/migrations/20261028_activity_log.sql`  
   *(Membuat tabel audit trail aktivitas admin dan trigger)*
3. `supabase/migrations/20261028_ekoran.sql`  
   *(Membuat tabel manajemen e-koran dan majalah daerah)*

### Konfigurasi Storage Buckets
Pastikan 5 bucket berikut tersedia di menu **Storage**:
| Nama Bucket | Sifat Akses | Penggunaan |
|---|---|---|
| `berita-images` | Public | Foto sampul & ilustrasi rilis berita |
| `penghargaan-images` | Public | Dokumentasi piagam & piala prestasi |
| `liputan-photos` | Public | Foto resolusi tinggi agenda liputan pimpinan |
| `download-files` | **Private** | Dokumen naskah sambutan / surat kedinasan (Signed URL) |
| `ekoran-files` | **Private / Public** | Berkas PDF publikasi koran & buletin digital |

---

## 6. SOP Operasional & Pemeliharaan Rutin

1. **Pembuatan Akun Admin Baru:**
   - Daftarkan email staf di menu Autentikasi Supabase atau via halaman Registrasi.
   - Ubah role pengguna di tabel `profiles` atau melalui Panel Admin `/admin/users` menjadi `admin`.
2. **Moderasi Komentar:**
   - Setiap komentar publik yang masuk akan berstatus pending dan memunculkan badge notifikasi realtime di header admin.
   - Akses `/admin/komentar` untuk menyetujui (*approve*) atau menolak (*reject*).
3. **Pencadangan Data Rutin (Backup):**
   - Supabase secara otomatis mencadangkan basis data harian (*Daily Backup*).
   - Tim IT dapat mengunduh snapshot basis data manual melalui menu *Settings > Database > Backups*.
4. **Pemantauan Log Aktivitas:**
   - Seluruh tindakan penambahan, pengubahan, dan penghapusan konten terekam di `/admin/activity-log` lengkap dengan email admin pelaksana dan timestamp WIB.

---
*Dokumen ini disusun untuk keperluan serah terima teknis internal Bagian Prokompim Setda Kabupaten Brebes.*
