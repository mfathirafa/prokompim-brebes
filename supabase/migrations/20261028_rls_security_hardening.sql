-- ==============================================================================
-- Migration: Row Level Security (RLS) Hardening & Security Audit
-- Project: Portal Web Bagian Prokompim Setda Brebes
-- Date: 28 Oktober 2026
-- Description:
--   Menerapkan dan mengunci Row Level Security (RLS) pada seluruh tabel publik
--   dan modul administrasi, serta mendefinisikan helper function berbasis JWT role.
-- ==============================================================================

-- 1. HELPER FUNCTION: IS_ADMIN()
-- Memeriksa apakah token JWT pengguna memiliki klaim role 'admin'
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Berikan izin eksekusi helper function kepada publik dan pengguna terotentikasi
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- ==============================================================================
-- 2. AKTIFKAN ROW LEVEL SECURITY PADA SELURUH TABEL
-- ==============================================================================

ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kategori_berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.files_download ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kategori_dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.liputan ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.foto_liputan ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.penghargaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ekoran ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.komentar ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. KEBIJAKAN TABEL: PROFILES
-- ==============================================================================
DROP POLICY IF EXISTS "Profiles: Publik dapat melihat info profil terbatas" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: Pengguna dapat membaca profil sendiri" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: Pengguna dapat mengubah profil sendiri" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: Admin memiliki akses penuh" ON public.profiles;

CREATE POLICY "Profiles: Pengguna dapat membaca profil sendiri"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles: Pengguna dapat mengubah profil sendiri"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    -- Pengguna biasa tidak boleh mengubah role mereka sendiri
    CASE
      WHEN public.is_admin() THEN true
      ELSE role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    END
  );

CREATE POLICY "Profiles: Admin memiliki akses penuh"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 4. KEBIJAKAN TABEL: BERITA & KATEGORI BERITA
-- ==============================================================================
DROP POLICY IF EXISTS "Berita: Publik dapat membaca berita terbit" ON public.berita;
DROP POLICY IF EXISTS "Berita: Admin memiliki akses penuh berita" ON public.berita;

CREATE POLICY "Berita: Publik dapat membaca berita terbit"
  ON public.berita FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Berita: Admin memiliki akses penuh berita"
  ON public.berita FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Kategori: Publik dapat membaca kategori berita" ON public.kategori_berita;
DROP POLICY IF EXISTS "Kategori: Admin dapat mengelola kategori berita" ON public.kategori_berita;

CREATE POLICY "Kategori: Publik dapat membaca kategori berita"
  ON public.kategori_berita FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Kategori: Admin dapat mengelola kategori berita"
  ON public.kategori_berita FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 5. KEBIJAKAN TABEL: FILES_DOWNLOAD & KATEGORI DOKUMEN
-- ==============================================================================
DROP POLICY IF EXISTS "Files: Pengguna terotentikasi dapat membaca dokumen aktif" ON public.files_download;
DROP POLICY IF EXISTS "Files: Admin memiliki akses penuh dokumen" ON public.files_download;

CREATE POLICY "Files: Pengguna terotentikasi dapat membaca dokumen aktif"
  ON public.files_download FOR SELECT
  TO authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Files: Admin memiliki akses penuh dokumen"
  ON public.files_download FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Kategori Dokumen: Pengguna dapat membaca kategori" ON public.kategori_dokumen;
DROP POLICY IF EXISTS "Kategori Dokumen: Admin dapat mengelola kategori" ON public.kategori_dokumen;

CREATE POLICY "Kategori Dokumen: Pengguna dapat membaca kategori"
  ON public.kategori_dokumen FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Kategori Dokumen: Admin dapat mengelola kategori"
  ON public.kategori_dokumen FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 6. KEBIJAKAN TABEL: KEGIATAN
-- ==============================================================================
DROP POLICY IF EXISTS "Kegiatan: Publik dapat membaca kegiatan aktif" ON public.kegiatan;
DROP POLICY IF EXISTS "Kegiatan: Admin memiliki akses penuh kegiatan" ON public.kegiatan;

CREATE POLICY "Kegiatan: Publik dapat membaca kegiatan aktif"
  ON public.kegiatan FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Kegiatan: Admin memiliki akses penuh kegiatan"
  ON public.kegiatan FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 7. KEBIJAKAN TABEL: LIPUTAN & FOTO_LIPUTAN
-- ==============================================================================
DROP POLICY IF EXISTS "Liputan: Publik dapat membaca liputan aktif" ON public.liputan;
DROP POLICY IF EXISTS "Liputan: Admin memiliki akses penuh liputan" ON public.liputan;

CREATE POLICY "Liputan: Publik dapat membaca liputan aktif"
  ON public.liputan FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Liputan: Admin memiliki akses penuh liputan"
  ON public.liputan FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Foto Liputan: Publik dapat membaca foto liputan" ON public.foto_liputan;
DROP POLICY IF EXISTS "Foto Liputan: Admin memiliki akses penuh foto liputan" ON public.foto_liputan;

CREATE POLICY "Foto Liputan: Publik dapat membaca foto liputan"
  ON public.foto_liputan FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Foto Liputan: Admin memiliki akses penuh foto liputan"
  ON public.foto_liputan FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 8. KEBIJAKAN TABEL: PENGHARGAAN & E-KORAN
-- ==============================================================================
DROP POLICY IF EXISTS "Penghargaan: Publik dapat membaca penghargaan aktif" ON public.penghargaan;
DROP POLICY IF EXISTS "Penghargaan: Admin memiliki akses penuh penghargaan" ON public.penghargaan;

CREATE POLICY "Penghargaan: Publik dapat membaca penghargaan aktif"
  ON public.penghargaan FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Penghargaan: Admin memiliki akses penuh penghargaan"
  ON public.penghargaan FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "E-Koran: Publik dapat membaca e-koran aktif" ON public.ekoran;
DROP POLICY IF EXISTS "E-Koran: Admin memiliki akses penuh e-koran" ON public.ekoran;

CREATE POLICY "E-Koran: Publik dapat membaca e-koran aktif"
  ON public.ekoran FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "E-Koran: Admin memiliki akses penuh e-koran"
  ON public.ekoran FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 9. KEBIJAKAN TABEL: KOMENTAR
-- ==============================================================================
DROP POLICY IF EXISTS "Komentar: Publik dapat membaca komentar yang disetujui" ON public.komentar;
DROP POLICY IF EXISTS "Komentar: Pengguna dapat mengirim komentar baru" ON public.komentar;
DROP POLICY IF EXISTS "Komentar: Admin memiliki akses penuh moderasi" ON public.komentar;

CREATE POLICY "Komentar: Publik dapat membaca komentar yang disetujui"
  ON public.komentar FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' OR public.is_admin());

CREATE POLICY "Komentar: Pengguna dapat mengirim komentar baru"
  ON public.komentar FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Memastikan komentar baru selalu berstatus 'pending'
    status = 'pending'
  );

CREATE POLICY "Komentar: Admin memiliki akses penuh moderasi"
  ON public.komentar FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 10. KEBIJAKAN SUPABASE STORAGE BUCKETS
-- ==============================================================================

-- A. Bucket Public: berita-images, penghargaan-images, liputan-photos
-- Publik dapat melihat (GET), Admin dapat mengunggah dan menghapus
CREATE POLICY "Storage: Publik dapat melihat gambar berita"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('berita-images', 'penghargaan-images', 'liputan-photos'));

CREATE POLICY "Storage: Admin dapat mengelola gambar publik"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id IN ('berita-images', 'penghargaan-images', 'liputan-photos') AND
    public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('berita-images', 'penghargaan-images', 'liputan-photos') AND
    public.is_admin()
  );

-- B. Bucket Private: download-files & ekoran-files
-- Hanya pengguna terotentikasi dan Admin yang dapat mengakses
CREATE POLICY "Storage: Pengguna terotentikasi dapat mengunduh dokumen"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id IN ('download-files', 'ekoran-files'));

CREATE POLICY "Storage: Admin dapat mengelola file dokumen private"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id IN ('download-files', 'ekoran-files') AND
    public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('download-files', 'ekoran-files') AND
    public.is_admin()
  );
