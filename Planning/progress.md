# Progress Report — Portal Web Prokompim Brebes

**Terakhir diperbarui:** 18 September 2026  
**Developer:** Rafa (Magang)  
**Periode:** 13 September – 12 November 2026

---

## Status Keseluruhan

| Item | Detail |
|------|--------|
| **Proyek** | Portal Web Prokompim Brebes |
| **Klien** | Bagian Protokol dan Komunikasi Pimpinan Pemkab Brebes |
| **Tech Stack** | Next.js 16 + Supabase + Vercel |
| **Model SDLC** | Prototype |
| **Fase Aktif** | Fase 3 — Prototype Fase 1 |
| **Progress Global** | `████████░░` ~55% |

---

## Milestone

| # | Milestone | Target | Status | Catatan |
|---|-----------|--------|--------|---------|
| M1 | Requirement & Setup Selesai | 19 Sep | ✅ **Selesai** | Tercapai lebih awal (14 Sep) |
| M2 | Desain & Database Ready | 26 Sep | 🔄 **In Progress** | Database & branding siap, wireframe belum |
| M3 | Prototype V1 Siap Demo | 10 Okt | ⏳ Pending | — |
| M4 | Iterasi Selesai | 17 Okt | ⏳ Pending | — |
| M5 | Pengembangan Final Selesai | 31 Okt | ⏳ Pending | — |
| M6 | Testing & Deploy Selesai | 12 Nov | ⏳ Pending | — |

---

## Progress Per Minggu

```
Minggu 1  (13–19 Sep)  ████████████ 100%  ✅ Requirement & Setup
Minggu 2  (20–26 Sep)  ████████░░░░  80%  🔄 Desain & Database (wireframe kurang)
Minggu 3  (27 Sep–3 Okt) ████████░░░░  ~80%  🔄 Prototype Fase 1 (download sisa)
Minggu 4  (4–10 Okt)   ░░░░░░░░░░░░   0%  ⏳ Prototype Fase 2
Minggu 5–9              ░░░░░░░░░░░░   0%  ⏳ Belum dimulai
```

---

## Progress Per Fitur (MoSCoW)

### ✅ Must Have

| ID | Fitur | Status | Keterangan |
|----|-------|--------|------------|
| M01 | Release Berita (`/berita` & `/berita/[slug]`) | ✅ **Selesai** | List + detail + card reusable |
| M02 | Download Sambutan | ⏳ **Belum** | Target minggu ini |
| M03 | Download Tata Upacara | ⏳ **Belum** | Target minggu ini |
| M04 | Judul Kegiatan | ⏳ **Belum** | — |
| M05 | Liputan / Dokumentasi | 🔄 **Parsial** | Data seed + Beranda sudah tampil |
| M06 | Auth Admin + CRUD | ⏳ **Belum** | Dashboard admin belum |
| M07 | Auth Member (Login & Register) | ✅ **Selesai** | Supabase Auth SSR, branch `feat/auth-login` |
| M08 | Dashboard Admin | ⏳ **Belum** | Minggu 6 |
| M09 | Kolom Penghargaan | ⏳ **Belum** | — |

### 🟡 Should Have

| ID | Fitur | Status |
|----|-------|--------|
| S01 | E-Koran | ⏳ Belum |
| S02 | Komentar Pengunjung | ⏳ Belum |
| S03 | Galeri Foto | ⏳ Belum |

### 🔵 Could Have

| ID | Fitur | Status |
|----|-------|--------|
| C01 | Agenda Pimpinan | ⏳ Belum |
| C02 | Profil Pimpinan | ⏳ Belum |
| C03 | Breaking News Ticker | ⏳ Belum |
| C04 | Counter Pengunjung | ⏳ Belum |

---

## Halaman & Modul yang Sudah Selesai

| Halaman / Modul | Route | Keterangan |
|-----------------|-------|------------|
| Layout Publik (Navbar + Footer) | `(public)/layout.tsx` | Responsif, branding Brebes |
| Beranda | `/` | SSR Supabase, liputan terkini |
| Daftar Berita | `/berita` | Card grid, data dari Supabase |
| Detail Berita | `/berita/[slug]` | Full artikel, slug-based |
| Layout Auth | `(auth)/layout.tsx` | Centered card, tanpa Navbar/Footer |
| Login | `/login` | `signInWithPassword`, redirect param |
| Register | `/register` | `signUp`, validasi client-side |

---

## Riwayat Kerja Harian

| Tanggal | Fokus | Hasil |
|---------|-------|-------|
| 10 Sep | Inisialisasi proyek | Setup Next.js, requirement gathering, ERD awal |
| 11 Sep | Koneksi Supabase | Test koneksi, ekstraksi warna branding Brebes |
| 14 Sep | Fondasi database | Migrasi Supabase baru, seed data dummy, storage |
| 15 Sep | Layout & Beranda | Navbar, Footer, normalisasi CSS, integrasi SSR Beranda |
| 16 Sep | Modul Berita | `/berita`, `/berita/[slug]`, card reusable, image domain |
| 17 Sep | Modul Auth | `/login`, `/register`, layout auth, fix image URL & TypeScript |
| **18 Sep** | **—** | **Hari ini** |

---

## Rencana Kerja Selanjutnya

### Sesi Terdekat
1. **Merge `feat/auth-login` → `main`** — verifikasi build bersih terlebih dahulu
2. **Branch baru `feat/download`** — modul dokumen unduhan:
   - Halaman katalog unduhan `/download`
   - Tab kategori: Sambutan, Tata Upacara, E-Koran, Majalah
   - Proteksi signed URL Supabase Storage (login required)
   - Counter unduhan (`increment_download_count`)
3. **Modul Liputan** — halaman penuh `/liputan` & `/liputan/[slug]`

### Target Minggu Ini (18–19 Sep)
- [ ] Merge auth ke main
- [ ] Mulai halaman `/download` — struktur halaman & tab kategori
- [ ] Integrasi data dokumen dari Supabase

---

## Kendala & Catatan Teknis

| Tanggal | Masalah | Status |
|---------|---------|--------|
| 17 Sep | `ERR_INVALID_URL` next/image akibat `cover_url` berisi whitespace/newline di seed data | ✅ Ditangani (sanitasi regex + query SQL) |
| 17 Sep | TS2339: import `createClient` salah modul (server vs client) di halaman login | ✅ Diperbaiki |

---

## Catatan

> Progres dikerjakan lebih cepat dari jadwal asal (timeline menetapkan Prototype Fase 1 di Minggu 3, tapi sebagian besar sudah selesai sejak hari ke-6 magang). Minggu 2 dari timeline formal (20–26 Sep) berpeluang difokuskan untuk wireframe yang masih kurang dan mulai Prototype Fase 2 (download, liputan, penghargaan).
