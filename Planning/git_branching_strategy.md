# Panduan Git Branching & Commit Strategy — SDLC Prototype

Dokumen ini memuat standar alur kerja Git (branching model dan commit message convention) untuk proyek **Portal Web Prokompim Brebes** yang dikembangkan dengan metodologi **SDLC Prototype** oleh solo developer (magang).

---

## 1. Konteks & Karakteristik SDLC Prototype

Dalam model Prototype:
1. **Kecepatan Iterasi & Demo-Oriented**: Aplikasi harus segera mencapai kondisi fungsional (*working prototype*) untuk didemokan secara berkala kepada pembimbing dan stakeholder Bagian Prokompim Setda Brebes.
2. **Fase Evaluasi & Revisi Intensif**: Setelah demo prototype pertama (Minggu 4), ada siklus evaluasi dan revisi cepat di Minggu 5. Fitur bisa diubah atau dibatalkan sesuai feedback.
3. **Solo Developer**: Tidak ada kebutuhan branching rumit untuk menghindari merge conflict antar developer. Branching dibuat terstruktur untuk menjaga kebersihan riwayat dan memudahkan pelacakan di laporan magang.
4. **Kesiapan Production/Deploy Vercel**: Branch `main` harus selalu stabil dan siap pakai sewaktu-waktu stakeholder membuka tautan Vercel.

---

## 2. Model Branching yang Dipilih: Feature-Branching (GitHub Flow disesuaikan)

Model branching yang digunakan adalah **Feature Branching berbasis milestone SDLC Prototype**.

```
main (Production / Live Vercel / Always Working & Demo-Ready)
 │
 ├── [Fase 1] feat/foundation-boilerplate  ──► Merge ke main
 ├── [Fase 1] feat/layout-navbar-footer    ──► Merge ke main
 ├── [Fase 1] feat/beranda-hero            ──► Merge ke main
 ├── [Fase 1] feat/berita-slug             ──► Merge ke main
 ├── [Fase 1] feat/auth-supabase           ──► Merge ke main  [TAG: v0.1-prototype-fase1]
 │
 ├── [Fase 2] feat/download-dokumen        ──► Merge ke main
 ├── [Fase 2] feat/penghargaan-kegiatan    ──► Merge ke main
 ├── [Fase 2] feat/liputan-ekoran          ──► Merge ke main  [TAG: v0.2-prototype-demo] <-- Demo Minggu 4
 │
 ├── [Fase 3: Revisi] feedback/evaluasi-demo-1 ──► Merge ke main [TAG: v0.3-prototype-revisi]
 │
 └── [Fase 4: Admin] feat/admin-panel      ──► Merge ke main  [TAG: v1.0-final-release]
```

### Penjelasan Cabang:
* **`main`**: Cabang utama yang terhubung ke pipeline Vercel. Setiap kode yang di-merge ke `main` harus sudah lolos pengujian lokal dan tidak merusak build.
* **`feat/<nama-fitur>`**: Cabang untuk pengerjaan per fitur. Setelah fitur selesai dan diuji, langsung di-merge ke `main` lalu branch dihapus.
* **`feedback/<nama-revisi>`**: Cabang khusus untuk menampung perubahan dan masukan hasil demo dari stakeholder pada Minggu 5.
* **`fix/<nama-bug>`**: Cabang untuk perbaikan bug spesifik.

---

## 3. Aturan Penamaan Branch

| Prefix | Tujuan Penggunaan | Contoh |
|---|---|---|
| `feat/` | Fitur baru atau halaman baru | `feat/layout-navbar-footer`, `feat/download-dokumen` |
| `feedback/` | Revisi berdasarkan hasil demo klien | `feedback/revisi-filter-kategori`, `feedback/penyesuaian-hero-beranda` |
| `fix/` | Perbaikan bug atau error | `fix/signed-url-expiry`, `fix/mobile-navbar-toggle` |
| `docs/` | Pembaruan dokumen perencanaan/laporan | `docs/update-daily-log-2026-09-14`, `docs/update-erd` |

---

## 4. Standar Pesan Commit (Conventional Commits)

Format commit pesan yang digunakan:
```text
<tipe>: <deskripsi singkat dalam bahasa Indonesia/Inggris>
```

### Tipe Commit:
* `feat`: Menambahkan fitur, komponen, atau halaman baru (misal: `feat: implementasi navbar sticky dengan transisi scroll`).
* `fix`: Memperbaiki kesalahan kode atau bug (misal: `fix: perbaiki route param views di Next.js 16`).
* `docs`: Perubahan atau penambahan dokumentasi di folder Planning/ (misal: `docs: tambah daily log 14 September 2026`).
* `style`: Penyesuaian visual, CSS, Tailwind tanpa mengubah logika (misal: `style: terapkan warna brand red pada tombol download`).
* `refactor`: Restrukturisasi kode tanpa merubah fungsi (misal: `refactor: optimasi helper function di utils.ts`).
* `chore`: Konfigurasi proyek, build tools, instalasi paket (misal: `chore: install @supabase/ssr dan tailwind-merge`).

---

## 5. Alur Kerja Praktis Harian

1. **Membuat Branch Fitur Baru**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/nama-fitur
   ```

2. **Bekerja dan Melakukan Commit Bertahap**:
   ```bash
   git add <file>
   git commit -m "feat: deskripsi perubahan"
   ```

3. **Menguji Secara Lokal**:
   Pastikan tidak ada error TypeScript maupun build:
   ```bash
   npm run build
   ```

4. **Merge ke `main` dan Push ke GitHub**:
   ```bash
   git checkout main
   git merge feat/nama-fitur
   git push origin main
   ```

5. **Memberikan Git Tag pada Milestone Penting**:
   ```bash
   git tag -a v0.1-prototype-fase1 -m "Milestone: Prototype publik dasar selesai"
   git push origin --tags
   ```
