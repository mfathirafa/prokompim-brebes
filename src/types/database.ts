export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      berita: {
        Row: {
          created_at: string | null
          gambar_url: string | null
          id: string
          isi: string
          judul: string
          kategori_id: number | null
          penulis_id: string | null
          published_at: string | null
          ringkasan: string | null
          slug: string
          status: string
          updated_at: string | null
          views: number
        }
        Insert: {
          created_at?: string | null
          gambar_url?: string | null
          id?: string
          isi: string
          judul: string
          kategori_id?: number | null
          penulis_id?: string | null
          published_at?: string | null
          ringkasan?: string | null
          slug: string
          status?: string
          updated_at?: string | null
          views?: number
        }
        Update: {
          created_at?: string | null
          gambar_url?: string | null
          id?: string
          isi?: string
          judul?: string
          kategori_id?: number | null
          penulis_id?: string | null
          published_at?: string | null
          ringkasan?: string | null
          slug?: string
          status?: string
          updated_at?: string | null
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "berita_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "kategori_berita"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "berita_penulis_id_fkey"
            columns: ["penulis_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      files_download: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          download_count: number
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_active: boolean
          judul: string
          kategori_id: number | null
          tanggal_kegiatan: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          download_count?: number
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_active?: boolean
          judul: string
          kategori_id?: number | null
          tanggal_kegiatan?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          download_count?: number
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_active?: boolean
          judul?: string
          kategori_id?: number | null
          tanggal_kegiatan?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_download_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "kategori_download"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_download_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      foto_liputan: {
        Row: {
          created_at: string | null
          gambar_url: string
          id: string
          keterangan: string | null
          liputan_id: string
          urutan: number | null
        }
        Insert: {
          created_at?: string | null
          gambar_url: string
          id?: string
          keterangan?: string | null
          liputan_id: string
          urutan?: number | null
        }
        Update: {
          created_at?: string | null
          gambar_url?: string
          id?: string
          keterangan?: string | null
          liputan_id?: string
          urutan?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "foto_liputan_liputan_id_fkey"
            columns: ["liputan_id"]
            isOneToOne: false
            referencedRelation: "liputan"
            referencedColumns: ["id"]
          },
        ]
      }
      kategori_berita: {
        Row: {
          created_at: string | null
          id: number
          nama: string
          slug: string
          warna: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nama: string
          slug: string
          warna?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nama?: string
          slug?: string
          warna?: string | null
        }
        Relationships: []
      }
      kategori_download: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          icon: string | null
          id: number
          nama: string
          slug: string
          urutan: number | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          icon?: string | null
          id?: number
          nama: string
          slug: string
          urutan?: number | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          icon?: string | null
          id?: number
          nama?: string
          slug?: string
          urutan?: number | null
        }
        Relationships: []
      }
      kegiatan: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          id: string
          is_active: boolean
          jenis: string
          judul: string
          lokasi: string | null
          pimpinan: string | null
          tanggal_mulai: string
          tanggal_selesai: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean
          jenis?: string
          judul: string
          lokasi?: string | null
          pimpinan?: string | null
          tanggal_mulai: string
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean
          jenis?: string
          judul?: string
          lokasi?: string | null
          pimpinan?: string | null
          tanggal_mulai?: string
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      komentar: {
        Row: {
          berita_id: string
          created_at: string | null
          email: string | null
          id: string
          is_approved: boolean
          isi: string
          nama: string
        }
        Insert: {
          berita_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean
          isi: string
          nama: string
        }
        Update: {
          berita_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean
          isi?: string
          nama?: string
        }
        Relationships: [
          {
            foreignKeyName: "komentar_berita_id_fkey"
            columns: ["berita_id"]
            isOneToOne: false
            referencedRelation: "berita"
            referencedColumns: ["id"]
          },
        ]
      }
      liputan: {
        Row: {
          cover_url: string | null
          created_at: string | null
          deskripsi: string | null
          id: string
          is_active: boolean
          judul: string
          kegiatan_id: string | null
          tanggal: string
          updated_at: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean
          judul: string
          kegiatan_id?: string | null
          tanggal: string
          updated_at?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean
          judul?: string
          kegiatan_id?: string | null
          tanggal?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liputan_kegiatan_id_fkey"
            columns: ["kegiatan_id"]
            isOneToOne: false
            referencedRelation: "kegiatan"
            referencedColumns: ["id"]
          },
        ]
      }
      penghargaan: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          gambar_url: string | null
          id: string
          instansi_pemberi: string
          is_active: boolean
          judul: string
          penerima: string
          tanggal: string
          tingkat: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          gambar_url?: string | null
          id?: string
          instansi_pemberi: string
          is_active?: boolean
          judul: string
          penerima?: string
          tanggal: string
          tingkat?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          gambar_url?: string | null
          id?: string
          instansi_pemberi?: string
          is_active?: boolean
          judul?: string
          penerima?: string
          tanggal?: string
          tingkat?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean
          nama: string
          no_hp: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_active?: boolean
          nama: string
          no_hp?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean
          nama?: string
          no_hp?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_berita_views: {
        Args: { berita_slug: string }
        Returns: undefined
      }
      increment_download_count: {
        Args: { target_file_id: string }
        Returns: undefined
      }
      is_active_member: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
