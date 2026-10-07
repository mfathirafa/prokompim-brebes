# Index Dokumen Perencanaan Proyek

Portal Web Prokompim Brebes — Sistem Informasi Release Berita dan Layanan Protokoler

---

## Struktur Dokumen

| No | File | Deskripsi |
|----|------|-----------|
| 01 | [konteks.md](./konteks.md) | Riset referensi web prokompim daerah lain |
| 02 | [timeline_magang.md](./timeline_magang.md) | Jadwal magang bulan 3 & 4, milestone, dan target |
| 03 | [tech_stack.md](./tech_stack.md) | Teknologi yang digunakan beserta alasan pemilihan |
| 04 | [sdlc_model.md](./sdlc_model.md) | Model pengembangan software yang dipilih |
| 05 | [requirement_matrix.md](./requirement_matrix.md) | Daftar fitur dengan prioritas MoSCoW |
| 06 | [user_roles.md](./user_roles.md) | Definisi peran pengguna dan hak akses |
| 07 | [erd.md](./erd.md) | Entity Relationship Diagram database |
| 08 | [referensi.md](./referensi.md) | Daftar link referensi prokompim daerah lain |
| 09 | [git_branching_strategy.md](./git_branching_strategy.md) | Panduan alur branching dan commit Git (SDLC Prototype) |

---

## Log Harian Magang (Daily Logs)

| Tanggal | File | Catatan Utama |
|---|---|---|
| 10 September 2026 | [daily_log_2026-09-10.md](./daily_log_2026-09-10.md) | Inisialisasi proyek, requirement gathering, setup Next.js |
| 11 September 2026 | [daily_log_2026-09-11.md](./daily_log_2026-09-11.md) | Test koneksi Supabase, ekstraksi warna branding Brebes |
| 14 September 2026 | [daily_log_2026-09-14.md](./daily_log_2026-09-14.md) | Migrasi Supabase baru, seed data dummy, storage, fondasi boilerplate Next.js |
| 15 September 2026 | [daily_log_2026-09-15.md](./daily_log_2026-09-15.md) | Perbaikan layout Navbar & Footer, normalisasi CSS branding Brebes, integrasi Beranda dengan Supabase SSR |
| 16 September 2026 | [daily_log_2026-09-16.md](./daily_log_2026-09-16.md) | Implementasi modul rilis berita publik (`/berita`) & detail (`/berita/[slug]`), card reusable, dan image domain |
| 17 September 2026 | [daily_log_2026-09-17.md](./daily_log_2026-09-17.md) | Implementasi modul autentikasi publik (`/login` & `/register`), layout auth, dan troubleshooting Next.js image |
| 21 September 2026 | [daily_log_2026-09-21.md](./daily_log_2026-09-21.md) | Implementasi modul Liputan, Penghargaan, Kegiatan, E-Koran, dan perapihan build |
| 22 September 2026 | [daily-log-22-sep-2026.md](./daily-log-22-sep-2026.md) | Fitur komentar berita pengunjung & sukses deploy live ke Vercel |
| 23 September 2026 | [daily-log-23-sep-2026.md](./daily-log-23-sep-2026.md) | Branch `feat/admin-panel`, layout admin sidebar responsif, statistik dashboard |
| 25 September 2026 | [daily-log-25-sep-2026.md](./daily-log-25-sep-2026.md) | Server actions & row actions kelola berita admin (`/admin/berita`) |
| 29 September 2026 | [daily-log-29-sep-2026.md](./daily-log-29-sep-2026.md) | Tabel manajemen berita & form tambah berita (`/admin/berita/tambah`) |
| 05 Oktober 2026 | [daily-log-05-oct-2026.md](./daily-log-05-oct-2026.md) | Form edit berita, modul moderasi komentar, fix Base UI, auth role JWT |
| 07 Oktober 2026 | [daily-log-07-oct-2026.md](./daily-log-07-oct-2026.md) | 4 Modul Admin Selesai (Kegiatan, Download, Penghargaan, Liputan) & pembersihan linting |

---

## Quick Info

| Item | Keterangan |
|------|------------|
| Nama Proyek | Portal Web Prokompim Brebes |
| Klien | Bagian Protokol dan Komunikasi Pimpinan Pemkab Brebes |
| Developer | Rafa (Magang) |
| Periode Magang | 13 September 2026 - 12 November 2026 |
| Model SDLC | Prototype |
| Tech Stack | Next.js 16 + Supabase + Vercel |
| Status | Fase 3 - Prototype Fase 1 (Seluruh Halaman Publik Utama Selesai, Siap Demo) |
