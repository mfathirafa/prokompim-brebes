# Requirement Matrix

Daftar fitur dengan prioritas MoSCoW untuk Portal Web Prokompim Brebes

---

## MoSCoW Prioritization

### Must Have (Wajib ada)

| ID | Fitur | Deskripsi | Kategori |
|----|-------|-----------|----------|
| M01 | Release Berita | Portal berita resmi Prokompim dengan format jurnalistik humas (lead, kutipan narasumber, konteks) | Publikasi |
| M02 | Download Sambutan | Daftar naskah sambutan pimpinan yang bisa didownload (perlu login) | Dokumen |
| M03 | Download Tata Upacara | Dokumen pedoman protokoler dan tata upacara hari besar (perlu login) | Dokumen |
| M04 | Judul Kegiatan | Daftar judul kegiatan upacara/hari nasional (tanpa detail lengkap) | Informasi |
| M05 | Liputan / Dokumentasi | Dokumentasi kegiatan pimpinan dalam bentuk artikel + foto | Publikasi |
| M06 | Auth Admin + CRUD | Sistem login admin dengan kemampuan CRUD semua konten | Manajemen |
| M07 | Auth Member | Sistem registrasi/login untuk pengguna yang ingin download | Manajemen |
| M08 | Dashboard Admin | Panel admin untuk mengelola berita, dokumen, user, dll | Manajemen |
| M09 | Kolom Penghargaan | Showcase capaian, piagam, prestasi Bupati/Pemkab | Publikasi |

---

### Should Have (Sebaiknya ada)

| ID | Fitur | Deskripsi | Kategori |
|----|-------|-----------|----------|
| S01 | E-Koran | Menampilkan koran digital/kliping publikasi berkala (PDF viewer/flipbook) | Publikasi |
| S02 | Komentar Pengunjung | Kolom komentar pada artikel berita (dengan moderasi) | Interaksi |
| S03 | Galeri Foto | Album foto kegiatan pimpinan | Dokumentasi |

---

### Could Have (Bagus kalau ada)

| ID | Fitur | Deskripsi | Kategori |
|----|-------|-----------|----------|
| C01 | Agenda Pimpinan | Jadwal kegiatan Bupati/Wabup/Sekda | Informasi |
| C02 | Profil Pimpinan | Halaman profil Bupati, Wakil Bupati, Sekda | Informasi |
| C03 | Breaking News Ticker | Running text berita terkini di halaman utama | Publikasi |
| C04 | Counter Pengunjung | Statistik pengunjung website | Statistik |

---

### Won't Have (Tidak dalam scope ini)

| ID | Fitur | Alasan |
|----|-------|--------|
| W01 | Live Streaming | Butuh infrastruktur lebih, di luar scope magang |
| W02 | Multi-language | Prioritas rendah, bisa ditambah nanti |
| W03 | Mobile App | Scope hanya web responsive |

---

## Detail Fitur

### M01 — Release Berita

**User Story:** Sebagai pengunjung, saya ingin membaca berita resmi Prokompim Brebes dengan format jurnalistik yang rapi.

**Fitur:**
- Daftar berita dengan card layout (judul, deskripsi singkat, gambar, tanggal)
- Detail berita dengan format lengkap (lead, body, kutipan, penulis, tanggal)
- Berita terkait di sidebar detail
- Tag/kategori berita
- View counter per artikel
- Pagination atau load more

**Referensi UI:** Prokompim Badung, Prokompim Pekalongan

---

### M02 — Download Sambutan

**User Story:** Sebagai member terdaftar, saya ingin mengunduh naskah sambutan pimpinan untuk keperluan resmi.

**Fitur:**
- Daftar dokumen sambutan (judul, tanggal, nama pejabat)
- Filter berdasarkan pejabat/tahun
- Tombol download (tampil setelah login)
- Log download (siapa, kapan, dokumen apa)
- Counter jumlah download

**Requirement:** Login member wajib

---

### M03 — Download Tata Upacara

**User Story:** Sebagai member terdaftar (SKPD/masyarakat), saya ingin mengunduh pedoman tata upacara untuk acara resmi.

**Fitur:**
- Daftar dokumen tata upacara (nama acara, tahun, file)
- Kategori: upacara bendera, hari nasional, protokoler umum
- Tombol download (tampil setelah login)
- Log download
- Counter jumlah download

**Requirement:** Login member wajib

---

### M04 — Judul Kegiatan

**User Story:** Sebagai pengunjung, saya ingin melihat daftar judul kegiatan upacara dan hari besar nasional.

**Fitur:**
- Daftar judul kegiatan (tanpa detail lengkap)
- Filter berdasarkan bulan/tahun
- Kategori: upacara, peringatan, kegiatan pimpinan

**Catatan:** Hanya judul, bukan agenda lengkap (fitur agenda lengkap di C01)

---

### M05 — Liputan / Dokumentasi

**User Story:** Sebagai pengunjung, saya ingin membaca liputan kegiatan pimpinan dengan dokumentasi foto.

**Fitur:**
- Artikel liputan dengan foto
- Gallery foto terkait
- Kategori berdasarkan jenis kegiatan
- Penulis dan tanggal

**Perbedaan dengan Release Berita:** Liputan lebih ke dokumentasi kegiatan, sedangkan Release Berita adalah press release resmi

---

### M06 & M07 — Auth Admin & Member

**User Story:**
- Sebagai admin, saya ingin login untuk mengelola semua konten
- Sebagai calon member, saya ingin mendaftar untuk bisa download dokumen

**Fitur:**
- Login dengan email/password
- Registrasi member (nama, email, no HP, instansi)
- Verifikasi email
- Reset password
- Role: Admin, Member

**Tech:** Supabase Auth

---

### M08 — Dashboard Admin

**User Story:** Sebagai admin, saya ingin mengelola semua konten melalui panel yang mudah digunakan.

**Fitur:**
- CRUD Berita
- CRUD Liputan
- CRUD Dokumen (sambutan, tata upacara, e-koran)
- CRUD Kegiatan
- CRUD Penghargaan
- Manajemen User Member
- Log Download
- Statistik (view counter, download counter)

---

### M09 — Kolom Penghargaan

**User Story:** Sebagai pengunjung, saya ingin melihat capaian dan penghargaan yang diterima Bupati/Pemkab Brebes.

**Fitur:**
- Daftar penghargaan (nama, tahun, deskripsi)
- Foto piagam/trophy
- Kategori penghargaan

---

### S01 — E-Koran

**User Story:** Sebagai pengunjung, saya ingin membaca koran digital publikasi berkala Prokompim.

**Fitur:**
- Daftar edisi e-koran
- PDF viewer atau flipbook
- Download PDF (opsional, perlu login)

---

### S02 — Komentar Pengunjung

**User Story:** Sebagai pengunjung, saya ingin memberikan komentar pada artikel berita.

**Fitur:**
- Form komentar (nama, email, isi)
- Komentar per artikel
- Moderasi oleh admin (approve/reject)
- Balas komentar (threaded)

---

### S03 — Galeri Foto

**User Story:** Sebagai pengunjung, saya ingin melihat album foto kegiatan pimpinan.

**Fitur:**
- Daftar album (nama kegiatan, tanggal)
- Grid foto dalam album
- Lightbox untuk melihat foto besar
- Download foto (opsional)

---

## Mapping Fitur ke Database

| Fitur | Tabel Database |
|-------|---------------|
| Release Berita | `berita`, `kategori_berita` |
| Download Sambutan | `dokumen`, `kategori_dokumen`, `log_download` |
| Download Tata Upacara | `dokumen`, `kategori_dokumen`, `log_download` |
| Judul Kegiatan | `kegiatan` |
| Liputan | `liputan`, `galeri` |
| Auth | `users` (Supabase Auth), `profiles` |
| Dashboard Admin | Semua tabel + `log_aktivitas` |
| Penghargaan | `penghargaan` |
| E-Koran | `ekoran` |
| Komentar | `komentar` |
| Galeri | `galeri`, `foto` |
| Agenda Pimpinan | `agenda` |
| Profil Pimpinan | `profil_pimpinan` |
