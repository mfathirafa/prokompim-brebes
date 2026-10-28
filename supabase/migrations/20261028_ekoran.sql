-- Migration: Tabel ekoran
-- Jalankan di Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS public.ekoran (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul        text NOT NULL,
  edisi        text,                         -- misal: "Vol. 12, No. 3"
  tanggal_terbit date,
  file_url     text NOT NULL,
  file_name    text,
  file_size    bigint,                       -- bytes
  thumbnail_url text,
  deskripsi    text,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.ekoran ENABLE ROW LEVEL SECURITY;

-- Publik bisa baca yang aktif
CREATE POLICY "ekoran_select_public" ON public.ekoran
  FOR SELECT USING (is_active = true);

-- Admin bisa semua
CREATE POLICY "ekoran_all_admin" ON public.ekoran
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ekoran_updated_at ON public.ekoran;
CREATE TRIGGER ekoran_updated_at
  BEFORE UPDATE ON public.ekoran
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket ekoran-files (jika belum ada)
-- Buat di: Storage > New bucket > "ekoran-files" > Public: OFF
-- Lalu tambahkan policy berikut via Dashboard:
--   SELECT: (bucket_id = 'ekoran-files') — untuk download signed URL
--   INSERT/UPDATE/DELETE: role = 'admin' only
