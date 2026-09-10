# Entity Relationship Diagram (ERD)

Struktur database untuk Portal Web Prokompim Brebes

---

## Diagram ERD

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              PROFILES                                    │
│  (Extend dari auth.users Supabase)                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  id (PK) : UUID → auth.users.id                                          │
│  nama_lengkap : VARCHAR(255)                                             │
│  email : VARCHAR(255)                                                    │
│  no_hp : VARCHAR(20)                                                     │
│  instansi : VARCHAR(255)                                                 │
│  role : ENUM('admin', 'member')                                          │
│  created_at : TIMESTAMP                                                   │
│  updated_at : TIMESTAMP                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1
                                    │
                                    │ N
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ LOG_DOWNLOAD  │         │   KOMENTAR    │         │    BERITA     │
├───────────────┤         ├───────────────┤         ├───────────────┤
│ id (PK)       │         │ id (PK)       │         │ id (PK)       │
│ user_id (FK)  │         │ user_id (FK)  │         │ author_id(FK) │
│ dokumen_id(FK)│         │ berita_id(FK) │         │ kategori_id(FK)│
│ downloaded_at │         │ isi           │         │ judul         │
└───────────────┘         │ status        │         │ slug          │
        │                 │ created_at    │         │ lead          │
        │                 └───────────────┘         │ body          │
        │                           │               │ gambar        │
        │                           │               │ view_count    │
        │                           │               │ status        │
        │                           │               │ created_at    │
        │                           │               │ updated_at    │
        │                           │               └───────────────┘
        │                           │                       │
        │                           │                       │
        ▼                           │                       │
┌───────────────┐                   │                       │
│   DOKUMEN     │                   │                       │
├───────────────┤                   │                       │
│ id (PK)       │◄──────────────────┘                       │
│ kategori_id(FK)│                                          │
│ judul         │                                           │
│ slug          │                                           │
│ deskripsi     │                                           │
│ file_url      │                                           │
│ file_size     │                                           │
│ download_count│                                           │
│ status        │                                           │
│ created_at    │                                           │
│ updated_at    │                                           │
└───────────────┘                                           │
        │                                                   │
        │                                                   │
        ▼                                                   │
┌───────────────────┐                                       │
│ KATEGORI_DOKUMEN  │                                       │
├───────────────────┤                                       │
│ id (PK)           │                                       │
│ nama              │                                       │
│ slug              │                                       │
│ deskripsi         │                                       │
└───────────────────┘                                       │
                                                            │
┌───────────────────┐                                       │
│ KATEGORI_BERITA   │◄──────────────────────────────────────┘
├───────────────────┤
│ id (PK)           │
│ nama              │
│ slug              │
│ deskripsi         │
└───────────────────┘


┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│    LIPUTAN    │         │     GALERI    │         │      FOTO     │
├───────────────┤         ├───────────────┤         ├───────────────┤
│ id (PK)       │         │ id (PK)       │         │ id (PK)       │
│ judul         │         │ liputan_id(FK)│         │ galeri_id(FK) │
│ slug          │         │ judul         │         │ url           │
│ deskripsi     │         │ slug          │         │ caption       │
│ tanggal       │         │ created_at    │         │ urutan        │
│ author_id(FK) │         └───────────────┘         │ created_at    │
│ gambar_utama  │                   │               └───────────────┘
│ view_count    │                   │ 1
│ status        │                   │
│ created_at    │                   │ N
│ updated_at    │                   │
└───────────────┘                   │
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        │                                                       │
        ▼                                                       ▼
┌───────────────┐                                       ┌───────────────┐
│   EKORAN      │                                       │ PENGHARGAAN   │
├───────────────┤                                       ├───────────────┤
│ id (PK)       │                                       │ id (PK)       │
│ judul         │                                       │ judul         │
│ slug          │                                       │ slug          │
│ edisi         │                                       │ deskripsi     │
│ tanggal_rilis │                                       │ tahun         │
│ file_url      │                                       │ gambar        │
│ cover_url     │                                       │ kategori      │
│ download_count│                                       │ status        │
│ status        │                                       │ created_at    │
│ created_at    │                                       │ updated_at    │
│ updated_at    │                                       └───────────────┘
└───────────────┘


┌───────────────┐         ┌───────────────┐
│   KEGIATAN    │         │    AGENDA     │
├───────────────┤         ├───────────────┤
│ id (PK)       │         │ id (PK)       │
│ judul         │         │ judul         │
│ slug          │         │ tanggal       │
│ kategori      │         │ jam_mulai     │
│ tanggal       │         │ jam_selesai   │
│ deskripsi     │         │ tempat        │
│ status        │         │ pimpinan_id(FK)│
│ created_at    │         │ kategori      │
│ updated_at    │         │ status        │
└───────────────┘         │ created_at    │
                          │ updated_at    │
                          └───────────────┘
                                  │
                                  │
                                  ▼
                          ┌───────────────┐
                          │ PIMPINAN      │
                          ├───────────────┤
                          │ id (PK)       │
                          │ nama          │
                          │ jabatan       │
                          │ foto          │
                          │ bio           │
                          │ created_at    │
                          │ updated_at    │
                          └───────────────┘
```

---

## Daftar Tabel

### 1. profiles
**Deskripsi:** Extend data user dari Supabase Auth

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK, FK ke auth.users |
| nama_lengkap | VARCHAR(255) | Nama lengkap user |
| email | VARCHAR(255) | Email (sama dengan auth.email) |
| no_hp | VARCHAR(20) | Nomor HP |
| instansi | VARCHAR(255) | Nama instansi/organisasi (opsional) |
| role | ENUM | 'admin' atau 'member' |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update terakhir |

---

### 2. berita
**Deskripsi:** Release berita resmi Prokompim

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| author_id | UUID | FK ke profiles.id |
| kategori_id | UUID | FK ke kategori_berita.id |
| judul | VARCHAR(255) | Judul berita |
| slug | VARCHAR(255) | URL-friendly judul (unique) |
| lead | TEXT | Paragraf pembuka |
| body | TEXT | Isi berita lengkap |
| gambar | VARCHAR(500) | URL gambar utama |
| view_count | INT | Jumlah dilihat |
| status | ENUM | 'draft', 'published', 'archived' |
| published_at | TIMESTAMP | Waktu dipublikasi |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

---

### 3. kategori_berita
**Deskripsi:** Kategori untuk berita

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| nama | VARCHAR(100) | Nama kategori |
| slug | VARCHAR(100) | URL-friendly (unique) |
| deskripsi | TEXT | Deskripsi kategori |

**Data awal:**
- Press Release
- Liputan Kegiatan
- Pengumuman

---

### 4. dokumen
**Deskripsi:** Dokumen yang bisa didownload (sambutan, tata upacara)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| kategori_id | UUID | FK ke kategori_dokumen.id |
| judul | VARCHAR(255) | Judul dokumen |
| slug | VARCHAR(255) | URL-friendly (unique) |
| deskripsi | TEXT | Deskripsi singkat |
| file_url | VARCHAR(500) | URL file di Supabase Storage |
| file_size | INT | Ukuran file (bytes) |
| download_count | INT | Jumlah didownload |
| status | ENUM | 'active', 'archived' |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

---

### 5. kategori_dokumen
**Deskripsi:** Kategori dokumen

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| nama | VARCHAR(100) | Nama kategori |
| slug | VARCHAR(100) | URL-friendly (unique) |
| deskripsi | TEXT | Deskripsi kategori |

**Data awal:**
- Sambutan Bupati
- Sambutan Wakil Bupati
- Sambutan Sekda
- Tata Upacara
- Pedoman Protokoler

---

### 6. log_download
**Deskripsi:** Log aktivitas download dokumen

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| user_id | UUID | FK ke profiles.id |
| dokumen_id | UUID | FK ke dokumen.id |
| downloaded_at | TIMESTAMP | Waktu download |

---

### 7. komentar
**Deskripsi:** Komentar pengunjung pada berita

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| berita_id | UUID | FK ke berita.id |
| user_id | UUID | FK ke profiles.id (nullable untuk guest) |
| nama_tamu | VARCHAR(100) | Nama jika guest |
| email_tamu | VARCHAR(255) | Email jika guest |
| isi | TEXT | Isi komentar |
| status | ENUM | 'pending', 'approved', 'rejected' |
| created_at | TIMESTAMP | Waktu dibuat |

---

### 8. liputan
**Deskripsi:** Liputan/dokumentasi kegiatan pimpinan

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| author_id | UUID | FK ke profiles.id |
| judul | VARCHAR(255) | Judul liputan |
| slug | VARCHAR(255) | URL-friendly (unique) |
| deskripsi | TEXT | Deskripsi kegiatan |
| tanggal | DATE | Tanggal kegiatan |
| gambar_utama | VARCHAR(500) | URL foto utama |
| view_count | INT | Jumlah dilihat |
| status | ENUM | 'draft', 'published', 'archived' |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

---

### 9. galeri
**Deskripsi:** Album foto kegiatan

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| liputan_id | UUID | FK ke liputan.id (opsional) |
| judul | VARCHAR(255) | Judul album |
| slug | VARCHAR(255) | URL-friendly (unique) |
| created_at | TIMESTAMP | Waktu dibuat |

---

### 10. foto
**Deskripsi:** Foto dalam galeri

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| galeri_id | UUID | FK ke galeri.id |
| url | VARCHAR(500) | URL foto |
| caption | TEXT | Keterangan foto |
| urutan | INT | Urutan tampilan |
| created_at | TIMESTAMP | Waktu dibuat |

---

### 11. ekoran
**Deskripsi:** E-Koran / koran digital

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| judul | VARCHAR(255) | Judul edisi |
| slug | VARCHAR(255) | URL-friendly (unique) |
| edisi | VARCHAR(50) | Edisi (misal: "September 2026") |
| tanggal_rilis | DATE | Tanggal rilis |
| file_url | VARCHAR(500) | URL file PDF |
| cover_url | VARCHAR(500) | URL cover |
| download_count | INT | Jumlah didownload |
| status | ENUM | 'active', 'archived' |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

---

### 12. penghargaan
**Deskripsi:** Penghargaan/capaian Bupati/Pemkab

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| judul | VARCHAR(255) | Nama penghargaan |
| slug | VARCHAR(255) | URL-friendly (unique) |
| deskripsi | TEXT | Deskripsi penghargaan |
| tahun | INT | Tahun mendapat penghargaan |
| gambar | VARCHAR(500) | URL foto piagam/trophy |
| kategori | VARCHAR(100) | Kategori penghargaan |
| status | ENUM | 'active', 'archived' |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

---

### 13. kegiatan
**Deskripsi:** Judul kegiatan upacara/hari nasional

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| judul | VARCHAR(255) | Judul kegiatan |
| slug | VARCHAR(255) | URL-friendly (unique) |
| kategori | VARCHAR(100) | Kategori (upacara, peringatan, dll) |
| tanggal | DATE | Tanggal pelaksanaan |
| deskripsi | TEXT | Deskripsi singkat |
| status | ENUM | 'active', 'archived' |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

---

### 14. agenda
**Deskripsi:** Agenda kegiatan pimpinan (optional, Could Have)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| pimpinan_id | UUID | FK ke pimpinan.id |
| judul | VARCHAR(255) | Judul agenda |
| tanggal | DATE | Tanggal |
| jam_mulai | TIME | Jam mulai |
| jam_selesai | TIME | Jam selesai |
| tempat | VARCHAR(255) | Lokasi |
| kategori | VARCHAR(100) | Kategori agenda |
| status | ENUM | 'scheduled', 'completed', 'cancelled' |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

---

### 15. pimpinan
**Deskripsi:** Data pimpinan (Bupati, Wabup, Sekda)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| nama | VARCHAR(255) | Nama lengkap |
| jabatan | VARCHAR(100) | Jabatan |
| foto | VARCHAR(500) | URL foto |
| bio | TEXT | Biografi singkat |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

---

## Relasi Antar Tabel

| Dari | Ke | Jenis |
|------|-----|-------|
| profiles | auth.users | 1:1 (extend) |
| berita | profiles | N:1 (author) |
| berita | kategori_berita | N:1 |
| dokumen | kategori_dokumen | N:1 |
| log_download | profiles | N:1 |
| log_download | dokumen | N:1 |
| komentar | berita | N:1 |
| komentar | profiles | N:1 (nullable) |
| liputan | profiles | N:1 (author) |
| galeri | liputan | N:1 (nullable) |
| foto | galeri | N:1 |
| agenda | pimpinan | N:1 |

---

## SQL Migration (Supabase)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nama_lengkap VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  no_hp VARCHAR(20),
  instansi VARCHAR(255),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Kategori Berita
CREATE TABLE kategori_berita (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Berita
CREATE TABLE berita (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id),
  kategori_id UUID REFERENCES kategori_berita(id),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  lead TEXT,
  body TEXT,
  gambar VARCHAR(500),
  view_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Kategori Dokumen
CREATE TABLE kategori_dokumen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dokumen
CREATE TABLE dokumen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kategori_id UUID REFERENCES kategori_dokumen(id),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  deskripsi TEXT,
  file_url VARCHAR(500),
  file_size INT,
  download_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Log Download
CREATE TABLE log_download (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  dokumen_id UUID REFERENCES dokumen(id),
  downloaded_at TIMESTAMP DEFAULT NOW()
);

-- Komentar
CREATE TABLE komentar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  berita_id UUID REFERENCES berita(id),
  user_id UUID REFERENCES profiles(id),
  nama_tamu VARCHAR(100),
  email_tamu VARCHAR(255),
  isi TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Liputan
CREATE TABLE liputan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  deskripsi TEXT,
  tanggal DATE,
  gambar_utama VARCHAR(500),
  view_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Galeri
CREATE TABLE galeri (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  liputan_id UUID REFERENCES liputan(id),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Foto
CREATE TABLE foto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  galeri_id UUID REFERENCES galeri(id),
  url VARCHAR(500) NOT NULL,
  caption TEXT,
  urutan INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- E-Koran
CREATE TABLE ekoran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  edisi VARCHAR(50),
  tanggal_rilis DATE,
  file_url VARCHAR(500),
  cover_url VARCHAR(500),
  download_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Penghargaan
CREATE TABLE penghargaan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  deskripsi TEXT,
  tahun INT,
  gambar VARCHAR(500),
  kategori VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Kegiatan
CREATE TABLE kegiatan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  kategori VARCHAR(100),
  tanggal DATE,
  deskripsi TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pimpinan
CREATE TABLE pimpinan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(100),
  foto VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agenda
CREATE TABLE agenda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pimpinan_id UUID REFERENCES pimpinan(id),
  judul VARCHAR(255) NOT NULL,
  tanggal DATE,
  jam_mulai TIME,
  jam_selesai TIME,
  tempat VARCHAR(255),
  kategori VARCHAR(100),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Catatan Implementasi

1. **UUID** — Semua primary key menggunakan UUID untuk keamanan dan skalabilitas

2. **Slug** — Digunakan untuk URL yang SEO-friendly

3. **Soft Delete** — Menggunakan status 'archived' daripada hard delete

4. **Timestamps** — `created_at` dan `updated_at` untuk audit trail

5. **Supabase Storage** — File (dokumen, gambar) disimpan di Supabase Storage, tabel hanya menyimpan URL

6. **RLS (Row Level Security)** — Akan dikonfigurasi di Supabase untuk keamanan data
