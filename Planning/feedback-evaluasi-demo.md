# Lembar Notulensi Evaluasi & Umpan Balik Demo Prototype

**Proyek:** Portal Web Bagian Protokol dan Komunikasi Pimpinan (Prokompim) Setda Brebes  
**Developer:** Muhammad Fathi Rafa (Magang)  
**Milestone:** M4 — Evaluasi Pasca Demo Prototype V1  
**Waktu Pelaksanaan:** Minggu ke-5 (Oktober 2026)  
**Lokasi:** Ruang Rapat Bagian Prokompim Setda Kabupaten Brebes  

---

## 1. Daftar Hadir & Peserta Rapat Evaluasi

| No | Nama | Jabatan / Peran | Tanda Tangan / Kehadiran |
|---|---|---|---|
| 1 | | Kepala Bagian Prokompim Setda Brebes | [ ] Hadir |
| 2 | | Subkoordinator Subbagian Protokol | [ ] Hadir |
| 3 | | Subkoordinator Subbagian Komunikasi Pimpinan | [ ] Hadir |
| 4 | | Subkoordinator Subbagian Dokumentasi & Naskah | [ ] Hadir |
| 5 | Muhammad Fathi Rafa | Pengembang Sistem (Mahasiswa Magang) | [x] Hadir |

---

## 2. Agenda Evaluasi Prototype

1. Pembukaan dan presentasi gambaran umum arsitektur portal (Next.js 16 + Supabase SSR).
2. Demonstrasi modul publik (Beranda, Profil Pimpinan, Rilis Berita, Unduhan Naskah, Kegiatan, E-Koran, dan Liputan).
3. Demonstrasi 8 modul panel admin (CRUD Berita, Moderasi Komentar, Dokumen, Kegiatan, Liputan, Penghargaan, dan Pengguna).
4. Simulasi fitur cetak laporan kedinasan (Rilis Berita, Dokumen Sambutan, dan Agenda Acara).
5. Sesi tanya jawab, pengumpulan kritik, saran, dan arahan penyempurnaan.

---

## 3. Matriks Catatan & Umpan Balik Stakeholder

| No | Modul / Fitur | Masukan / Rekomendasi Stakeholder | Tindak Lanjut Teknis | Prioritas |
|---|---|---|---|---|
| 1 | **Tampilan Beranda & Branding** | *Contoh: Apakah penempatan logo Brebes, foto pimpinan, dan palet warna sudah sesuai pakem protokoler?* | | Sedang |
| 2 | **Format Berita & Pers Rilis** | *Contoh: Kelengkapan penulisan narasumber, kutipan pimpinan, dan tata letak galeri gambar.* | | Tinggi |
| 3 | **Layanan Unduhan Sambutan** | *Contoh: Kebijakan apakah dokumen tertentu boleh diunduh publik langsung atau tetap wajib registrasi member.* | | Tinggi |
| 4 | **Alur Kerja Panel Admin** | *Contoh: Kemudahan proses penyuntingan, notifikasi komentar pending, dan pengelolaan status akun.* | | Tinggi |
| 5 | **Fitur Cetak Laporan Kedinasan** | *Contoh: Format kop surat dinas dan penataan kolom tabel saat dicetak fisik.* | | Sedang |

---

## 4. Kesimpulan & Arahan Pengembangan Tahap Final (Bulan ke-4)

* **Status Penerimaan Prototype:**
  - [ ] **Diterima Penuh** (Lanjut ke pengujian akhir & serah terima).
  - [ ] **Diterima dengan Catatan Revisi** (Masuk ke siklus branch `feedback/*`).
  - [ ] **Perlu Demonstrasi Ulang** setelah revisi mayor.

* **Catatan Khusus Pimpinan:**
  > *(Ruang untuk menuliskan arahan langsung dari Kabag / Kasubbag Prokompim)*

---

## 5. Rencana Tindak Lanjut (Action Plan)

1. Membuat branch revisi `feedback/<nama-revisi>` untuk menangani poin masukan prioritas tinggi.
2. Memperbarui `Planning/progress.md` dan `Planning/timeline_magang.md` berdasarkan hasil evaluasi.
3. Melakukan pengujian integrasi menyeluruh sebelum serah terima akhir (Milestone M6).
