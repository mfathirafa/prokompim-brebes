# Buku Panduan Penggunaan Panel Admin (User Manual)

**Sistem Informasi Release Berita & Layanan Protokoler**  
**Bagian Protokol dan Komunikasi Pimpinan (Prokompim) Setda Kabupaten Brebes**

---

## 1. Pendahuluan

Buku panduan ini disusun sebagai petunjuk operasional bagi staf, pranata humas, dan pengelola sistem di lingkungan Bagian Prokompim Sekretariat Daerah Kabupaten Brebes dalam mengelola konten portal website resmi.

Sistem panel admin dirancang dengan antarmuka yang bersih, responsif, dan mudah digunakan untuk mendukung kecepatan publikasi warta kedinasan serta transparansi arsip keprotokolan.

---

## 2. Akses & Autentikasi Admin

### A. Alamat URL Masuk
* Akses URL: `https://prokompim-brebeskab.vercel.app/login` atau `/login` pada domain resmi.
* Masukkan alamat email kedinasan dan kata sandi yang telah didaftarkan dengan hak akses peran `admin`.

### B. Keamanan & Batas Sesi
* Hanya akun dengan atribut `role: admin` yang dapat membuka rute panel kontrol `/admin/*`.
* Pengguna publik/member yang mencoba mengakses URL admin akan dialihkan secara otomatis ke halaman depan (*access control middleware*).
* Untuk mengakhiri sesi, klik tombol profil/logout di pojok kanan atas sidebar.

---

## 3. Modul 1: Dashboard Utama (`/admin`)

Dashboard utama memberikan ikhtisar kinerja portal dalam satu layar:
1. **4 Kartu Metrik Utama:**
   * **Total Berita Published:** Jumlah warta rilis yang aktif mengudara.
   * **Total File Download:** Jumlah dokumen sambutan dan tata upacara aktif.
   * **Total Member:** Jumlah masyarakat/aparatur SKPD yang telah terdaftar.
   * **Komentar Pending:** Jumlah tanggapan pengunjung yang membutuhkan moderasi.
2. **Tabel 5 Berita Terbaru:** Menampilkan rilis berita termutakhir beserta jumlah pembaca (*views*).
3. **Antrean Komentar Pending:** Notifikasi cepat komentar masuk yang belum diproses.

---

## 4. Modul 2: Manajemen Rilis Berita (`/admin/berita`)

### A. Melihat & Menyaring Berita
* Gunakan tab filter: **Semua**, **Published**, atau **Draft**.
* Kolom pencarian di kanan atas memungkinkan pencarian berdasarkan judul berita.

### B. Menulis Berita Baru (`/admin/berita/tambah`)
1. Klik tombol **"Tambah Berita"** di kanan atas.
2. Isi formulir:
   * **Judul Berita:** Gunakan kalimat lugas dan menarik (maks. 150 karakter). Slug URL akan otomatis terbentuk.
   * **Kategori:** Pilih kategori berita (Pemerintahan, Pembangunan, Sosial, Kebudayaan).
   * **Ringkasan (Lead):** Paragraf pembuka berisi unsur 5W+1H (maks. 300 karakter).
   * **Isi Berita:** Konten berita lengkap dengan format jurnalistik humas.
   * **Foto Cover / Thumbnail:** Unggah foto dokumentasi kegiatan berformat JPG/PNG/WebP (maks. 2MB, rasio 16:9 disarankan).
   * **Status:**
     * *Published*: Berita langsung tayang di portal publik.
     * *Draft*: Berita disimpan secara privat untuk penyuntingan lanjutan.
3. Klik **"Simpan Berita"**.

### C. Mengubah & Menghapus Berita
* Klik ikon pensil (**Edit**) pada baris berita untuk memperbarui konten.
* Klik ikon tempat sampah (**Hapus**) untuk menghapus berita secara permanen beserta file foto di penyimpanan storage.

---

## 5. Modul 3: Moderasi Komentar Publik (`/admin/komentar`)

Untuk menjaga portal pemerintah tetap kondusif, setiap komentar dari pengunjung harus disetujui staf admin sebelum tampil di artikel:
1. Masuk ke menu **Komentar**.
2. Tinjau isi teks tanggapan, nama pengirim, dan artikel rujukan.
3. Klik tombol hijau (**Setujui / Approve**) untuk menayangkan komentar ke publik.
4. Klik tombol merah (**Tolak / Hapus**) jika komentar mengandung unsur spam, promosi komersial, atau ujaran yang tidak pantas.

---

## 6. Modul 4: Pengelolaan Dokumen Unduhan (`/admin/download`)

Digunakan untuk menyediakan naskah sambutan pimpinan, pedoman upacara hari besar, dan berkas keprotokolan resmi:
1. **Menambah Dokumen Baru (`/admin/download/tambah`):**
   * Masukkan judul dokumen dan tanggal kegiatan terkait.
   * Pilih kategori dokumen (Naskah Sambutan, Tata Upacara, Pedoman Protokol, dll.).
   * Unggah berkas dokumen (format PDF diutamakan, maks. 10MB). File akan disimpan pada *private bucket* yang aman.
2. **Pratinjau Dokumen:** Klik ikon unduh untuk membuka tautan berkas resmi berbatas waktu (*secure signed URL*).
3. **Pengaturan Status:** Klik ikon status (centang hijau / silang oranye) untuk mengaktifkan atau menonaktifkan dokumen secara instan tanpa perlu menghapusnya.

---

## 7. Modul 5: Agenda Kegiatan Pimpinan (`/admin/kegiatan`)

1. Klik **"Tambah Kegiatan"** pada menu Kegiatan.
2. Tentukan:
   * **Nama Acara / Kegiatan:** Contoh: *"Upacara Peringatan Hari Kesaktian Pancasila"*.
   * **Jenis Kegiatan:** Upacara, Hari Nasional, atau Kegiatan Pimpinan.
   * **Pimpinan yang Menghadiri:** Pj. Bupati, Sekretaris Daerah, atau Asisten Sekda.
   * **Lokasi & Tanggal Pelaksanaan.**
3. Kegiatan yang aktif akan otomatis muncul pada linimasa vertikal di halaman `/kegiatan`.

---

## 8. Modul 6: Dokumentasi Liputan Visual (`/admin/liputan`)

1. Setiap kegiatan pimpinan dapat dibuatkan album liputan tersendiri.
2. Unggah foto sampul album utama (*cover*).
3. Setelah album dibuat, admin dapat menambahkan galeri foto dokumentasi pendukung yang akan tertata rapi dalam tampilan masonry di halaman `/liputan/[id]`.

---

## 9. Modul 7: Direktori Penghargaan Daerah (`/admin/penghargaan`)

1. Catat capaian piagam, plakat, dan prestasi yang diraih Pemerintah Kabupaten Brebes.
2. Isi nama penghargaan, instansi pemberi apresiasi (kementerian/lembaga), tingkat (Kabupaten, Provinsi, Nasional), dan unggah foto piagam/trofi.

---

## 10. Modul 8: Manajemen Pengguna & Member (`/admin/users`)

1. Melihat seluruh akun pengunjung yang mendaftar untuk layanan unduh dokumen.
2. Fitur yang tersedia:
   * **Ubah Peran (Role):** Menetapkan staf menjadi *Admin* atau mengembalikan ke *Member*.
   * **Toggle Status Aktif:** Memblokir/menonaktifkan akun yang melanggar aturan penggunaan layanan.
   * **Hapus Akun:** Menghapus data akun secara permanen.

---

## 11. Bantuan & Pemeliharaan Sistem

* **Dukungan Teknis:** Tim Pengembang Portal / Subbagian Komunikasi Pimpinan Setda Brebes.
* **Surel Layanan:** `prokompim@brebeskab.go.id`
* **Laporan Masalah:** Kontak administrator via portal atau repository GitHub proyek.
