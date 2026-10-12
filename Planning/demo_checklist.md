# Panduan Skenario Demo Prototype & Lembar Evaluasi Stakeholder

**Proyek:** Portal Web Bagian Protokol dan Komunikasi Pimpinan (Prokompim) Setda Brebes  
**Developer:** Muhammad Fathi Rafa (Magang)  
**Target Audiens:** Kepala Bagian & Subkoordinator Prokompim Setda Brebes  
**Fase SDLC:** Fase 3 — Evaluasi Prototype V1 (Menuju Milestone M4)

---

## 1. Tujuan Sesi Demo

1. Memperagakan secara langsung cara kerja sistem portal berita publik, layanan dokumen keprotokolan, dan panel administrasi kepada stakeholder.
2. Memvalidasi kesesuaian alur kerja humas dan protokol Pemkab Brebes dengan fitur-fitur yang telah dibangun.
3. Mengumpulkan catatan evaluasi, kritik, dan masukan penyempurnaan (*feedback loop*) sebelum memasuki tahap finalisasi Bulan ke-4.

---

## 2. Persiapan Sebelum Demo

- [ ] Pastikan koneksi internet stabil (atau siapkan local server cadangan via `npm run dev`).
- [ ] Buka tab browser utama: [https://prokompim-brebeskab.vercel.app](https://prokompim-brebeskab.vercel.app) atau `http://localhost:3000`.
- [ ] Buka tab penyamaran / incognito untuk simulasi peran pengunjung (*Guest*) dan peran anggota (*Member*).
- [ ] Siapkan akun login admin: `admin@prokompim-brebes.go.id`.
- [ ] Siapkan contoh file naskah sambutan PDF dummy dan foto liputan untuk simulasi unggah konten.

---

## 3. Skenario Alur Demonstrasi (Demo Flow)

```
┌─────────────────────────────────────────────────────────┐
│  1. PORTAL PUBLIK & BRANDING BREBES                     │
│     • Beranda (Hero, Breaking Ticker, Statistik Portal) │
│     • Profil Pj. Bupati, Sekda, & Tupoksi Prokompim     │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  2. PUBLIKASI BERITA & INTERAKSI MASYARAKAT             │
│     • Jelajah berita, kategori dinamis, pencarian       │
│     • Baca artikel, view counter, form komentar publik  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  3. LAYANAN PROTOKOLER & DOKUMEN UNDUHAN                │
│     • Direktori sambutan & tata upacara                 │
│     • Simulasi proteksi unduh (wajib login member)      │
│     • Agenda kegiatan pimpinan & katalog e-koran        │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  4. PANEL ADMIN KONTROL PENUH (/admin)                  │
│     • Dashboard metrik pembaca & ringkasan aktivitas    │
│     • CRUD Rilis Berita & unggah cover                  │
│     • Moderasi komentar publik                          │
│     • Kelola dokumen sambutan, tata upacara, & users    │
└─────────────────────────────────────────────────────────┘
```

### Tahap 1: Halaman Depan & Profil Daerah (5 Menit)
* Tunjukkan keselarasan identitas visual daerah: Logo Brebes, warna khas merah-emas-biru (*branding* Brebes).
* Peragakan **Breaking News Ticker** yang menampilkan rilis warta terkini secara otomatis.
* Tunjukkan **Bar Statistik Keterbukaan Informasi**: transparansi jumlah artikel, total pembaca publik, arsip naskah, dan agenda kegiatan.
* Buka menu **Profil Pimpinan (`/profil`)**: perlihatkan profil kepala daerah, Sekretaris Daerah, serta rincian 3 subbagian kerja Prokompim Setda Brebes.

### Tahap 2: Portal Rilis Warta Humas (`/berita`) (5 Menit)
* Buka halaman `/berita`: peragakan filter kategori (Pemerintahan, Pembangunan, Sosial, Kebudayaan), pencarian kata kunci, dan pagination.
* Buka salah satu detail berita: perlihatkan tipografi jurnalistik humas yang nyaman dibaca, sidebar 5 berita terkait, serta tombol bagikan (*share*).
* Tunjukkan **View Counter Otomatis** yang bertambah saat artikel dibuka.
* Berikan contoh pengisian komentar warga di bagian bawah artikel. Jelaskan bahwa komentar tidak langsung tayang karena harus melewati moderasi admin terlebih dahulu untuk mencegah spam/ujaran kebencian.

### Tahap 3: Layanan Dokumen & Keprotokolan (`/download`) (5 Menit)
* Buka halaman `/download`: jelaskan fungsinya sebagai pusat arsip naskah sambutan pimpinan, pedoman upacara hari besar, dan modul protokoler.
* Tunjukkan sistem filter kategori cepat.
* Tunjukkan bahwa untuk men-download file asli, pengguna diarahkan untuk login terlebih dahulu (keamanan arsip kedinasan).
* Tampilkan juga halaman **Agenda Kegiatan (`/kegiatan`)**, **E-Koran (`/e-koran`)**, dan **Galeri Liputan (`/liputan`)**.

### Tahap 4: Panel Administrasi Prokompim (`/admin`) (10 Menit)
* Masuk ke dashboard admin menggunakan akun administrator.
* Tunjukkan **4 Kartu Metrik Statistik**: Total berita terbit, total dokumen, member terdaftar, dan jumlah komentar pending.
* **Simulasi CRUD Berita**:
  * Tambah berita baru lengkap dengan ringkasan dan upload foto cover.
  * Tunjukkan perubahan status *Draft* vs *Published*.
* **Simulasi Moderasi Komentar**:
  * Tunjukkan komentar yang tadi dimasukkan di Tahap 2 kini masuk ke daftar antrean moderasi admin.
  * Lakukan *Approve* (komentar langsung tayang di portal publik) atau *Reject*.
* **Kelola Dokumen Unduhan**:
  * Tunjukkan filter kategori unduhan yang responsif.
  * Peragakan fitur aktifkan/nonaktifkan dokumen dan unduh preview file.
* **Manajemen Pengguna (`/admin/users`)**:
  * Tunjukkan daftar member yang mendaftar di web, opsi aktifkan/nonaktifkan akun, dan audit peran.

---

## 4. Lembar Catatan & Umpan Balik Stakeholder (Feedback Form)

| No | Aspek Penilaian | Catatan / Masukan Stakeholder | Tindak Lanjut |
|---|---|---|---|
| 1 | **Kesesuaian Tampilan (UI/UX)** | *Apakah tata letak dan warna sesuai dengan standar protokoler Brebes?* | |
| 2 | **Format Rilis Berita** | *Apakah struktur judul, lead, dan foto sudah memenuhi kaidah jurnalistik humas?* | |
| 3 | **Alur Download Dokumen** | *Apakah pembatasan login untuk naskah sambutan disetujui atau perlu ada yang dibuat publik bebas?* | |
| 4 | **Kebutuhan Modul Admin** | *Apakah alur kerja upload dan moderasi komentar sudah dirasa cukup praktis bagi staf Prokompim?* | |
| 5 | **Fitur Tambahan yang Diharapkan** | *Adakah laporan atau fitur spesifik lain yang ingin ditambahkan pada Bulan ke-4?* | |

---

## 5. Langkah Pasca Demo

1. Rangkum seluruh masukan stakeholder ke dalam dokumen `Planning/feedback-evaluasi-demo.md`.
2. Buat branch revisi `feedback/<nama-revisi>` sesuai panduan Git Branching Strategy jika terdapat penyesuaian alur.
3. Lakukan pengujian dan pemutakhiran jadwal pada `Planning/timeline_magang.md`.
