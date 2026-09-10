# User Roles

Definisi peran pengguna dan hak akses pada Portal Web Prokompim Brebes

---

## Daftar Roles

| Role | Deskripsi | Akses |
|------|-----------|-------|
| Guest | Pengunjung umum tanpa login | Baca konten publik |
| Member | Pengguna terdaftar | + Download dokumen |
| Admin | Pengelola website | + CRUD semua konten |

---

## Detail Roles

### 1. Guest (Pengunjung)

**Deskripsi:** Pengunjung website tanpa perlu login

**Hak Akses:**
| Fitur | Akses |
|-------|-------|
| Baca Release Berita | ✅ Ya |
| Baca Liputan/Dokumentasi | ✅ Ya |
| Lihat Judul Kegiatan | ✅ Ya |
| Lihat Kolom Penghargaan | ✅ Ya |
| Lihat E-Koran | ✅ Ya |
| Lihat Galeri Foto | ✅ Ya |
| Komentar (jika fitur ada) | ⚠️ Perlu input nama/email |
| Download Sambutan | ❌ Tidak |
| Download Tata Upacara | ❌ Tidak |
| Download E-Koran PDF | ❌ Tidak |

---

### 2. Member (Pengguna Terdaftar)

**Deskripsi:** Pengguna yang sudah mendaftar dan login untuk mengakses fitur download

**Data yang dikumpulkan saat registrasi:**
- Nama lengkap (wajib)
- Email (wajib, sebagai kredensial login)
- No. HP (wajib)
- Nama Instansi/Organisasi (opsional)

**Hak Akses:**
| Fitur | Akses |
|-------|-------|
| Semua fitur Guest | ✅ Ya |
| Download Sambutan | ✅ Ya |
| Download Tata Upacara | ✅ Ya |
| Download E-Koran PDF | ✅ Ya |
| Komentar dengan identitas terverifikasi | ✅ Ya |
| CRUD Konten | ❌ Tidak |
| Akses Dashboard Admin | ❌ Tidak |

**Alur Registrasi:**
1. User mengisi form registrasi
2. Sistem mengirim email verifikasi
3. User klik link verifikasi
4. Akun aktif, user bisa login

---

### 3. Admin

**Deskripsi:** Pengelola website dari Prokompim Brebes

**Hak Akses:**
| Fitur | Akses |
|-------|-------|
| Semua fitur Member | ✅ Ya |
| CRUD Berita | ✅ Ya |
| CRUD Liputan | ✅ Ya |
| CRUD Dokumen (sambutan, tata upacara, e-koran) | ✅ Ya |
| CRUD Kegiatan | ✅ Ya |
| CRUD Penghargaan | ✅ Ya |
| CRUD Galeri | ✅ Ya |
| Manajemen User Member | ✅ Ya (view, deactivate, delete) |
| Moderasi Komentar | ✅ Ya (approve, reject, delete) |
| Lihat Log Download | ✅ Ya |
| Lihat Statistik | ✅ Ya |

---

## Matriks Hak Akses Lengkap

| Fitur | Guest | Member | Admin |
|-------|:-----:|:------:|:-----:|
| **Publikasi** |
| Baca Release Berita | ✅ | ✅ | ✅ |
| Baca Liputan | ✅ | ✅ | ✅ |
| Lihat E-Koran | ✅ | ✅ | ✅ |
| Lihat Penghargaan | ✅ | ✅ | ✅ |
| Lihat Galeri | ✅ | ✅ | ✅ |
| **Dokumen** |
| Download Sambutan | ❌ | ✅ | ✅ |
| Download Tata Upacara | ❌ | ✅ | ✅ |
| Download E-Koran PDF | ❌ | ✅ | ✅ |
| **Interaksi** |
| Komentar | ⚠️* | ✅ | ✅ |
| Moderasi Komentar | ❌ | ❌ | ✅ |
| **Manajemen** |
| CRUD Berita | ❌ | ❌ | ✅ |
| CRUD Liputan | ❌ | ❌ | ✅ |
| CRUD Dokumen | ❌ | ❌ | ✅ |
| CRUD Kegiatan | ❌ | ❌ | ✅ |
| CRUD Penghargaan | ❌ | ❌ | ✅ |
| CRUD Galeri | ❌ | ❌ | ✅ |
| CRUD E-Koran | ❌ | ❌ | ✅ |
| **User Management** |
| Registrasi Member | - | ✅ | ✅ |
| Lihat Daftar Member | ❌ | ❌ | ✅ |
| Deactivate Member | ❌ | ❌ | ✅ |
| **Statistik** |
| Lihat Log Download | ❌ | ❌ | ✅ |
| Lihat View Counter | ❌ | ❌ | ✅ |
| Dashboard Admin | ❌ | ❌ | ✅ |

*⚠️ = Perlu input nama/email setiap komentar*

---

## Implementasi dengan Supabase Auth

### Struktur Tabel Users

```sql
-- Tabel profiles (extend dari auth.users Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nama_lengkap VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  no_hp VARCHAR(20),
  instansi VARCHAR(255),
  role VARCHAR(20) DEFAULT 'member', -- 'member' atau 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Policy: User hanya bisa lihat profile sendiri
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Admin bisa lihat semua profile
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Alur Login

### Guest → Member
```
Guest → Klik "Daftar" → Isi Form → Verifikasi Email → Login → Member
```

### Member → Admin
```
Admin dibuat langsung oleh developer atau admin lain
(Tidak ada registrasi publik untuk role Admin)
```

---

## Catatan untuk Development

1. **Default Admin:** Satu akun admin awal dibuat manual saat setup (seed data)

2. **Verifikasi Email:** Wajib untuk member, menggunakan Supabase Auth

3. **Session Management:** Supabase menangani session dan token

4. **Logout:** Tersedia di semua halaman setelah login

5. **Protected Routes:**
   - `/admin/*` — hanya untuk Admin
   - `/download/*` — hanya untuk Member dan Admin
