-- ============================================================
-- Migration: Buat tabel activity_log untuk audit trail admin
-- Jalankan di Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Buat tabel activity_log
CREATE TABLE IF NOT EXISTS public.activity_log (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email  TEXT,
  action_type  TEXT        NOT NULL CHECK (action_type IN ('create','update','delete','publish','unpublish','approve','reject','upload','toggle')),
  resource_type TEXT       NOT NULL CHECK (resource_type IN ('berita','komentar','kegiatan','download','liputan','penghargaan','users','ekoran')),
  resource_id  TEXT,
  resource_title TEXT,
  detail       JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Index untuk query cepat (filter by tanggal, tipe, admin)
CREATE INDEX IF NOT EXISTS activity_log_created_at_idx    ON public.activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS activity_log_action_type_idx   ON public.activity_log (action_type);
CREATE INDEX IF NOT EXISTS activity_log_resource_type_idx ON public.activity_log (resource_type);
CREATE INDEX IF NOT EXISTS activity_log_admin_id_idx      ON public.activity_log (admin_id);

-- 3. Aktifkan RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- 4. Policy: hanya admin yang bisa membaca log
-- (Menggunakan fungsi is_admin() dari migration RLS sebelumnya)
-- Jika is_admin() belum ada, buat dulu dengan perintah di bawah:
-- CREATE OR REPLACE FUNCTION public.is_admin()
-- RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
--   SELECT COALESCE((auth.jwt() ->> 'app_metadata')::jsonb ->> 'role', '') = 'admin';
-- $$;

CREATE POLICY "ActivityLog: Admin dapat membaca semua log"
  ON public.activity_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 5. Policy: authenticated user bisa insert (server action dari admin session)
CREATE POLICY "ActivityLog: Sistem dapat insert log"
  ON public.activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. Tidak ada UPDATE / DELETE log dari aplikasi (immutable audit trail)
-- Admin hanya bisa melihat, tidak bisa mengubah atau menghapus log
