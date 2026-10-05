import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BeritaForm } from "../../berita-form";

export const metadata = {
    title: "Edit Berita | Admin Prokompim",
}

interface AdminEditBeritaPageProps {
    params: Promise<{ id: string }>
}

export default async function AdminEditBeritaPage({ params }: AdminEditBeritaPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Ambil data berita berdasarkan ID
    const { data: berita, error } = await supabase
        .from("berita")
        .select("id, judul, slug, ringkasan, isi, gambar_url, kategori_id, status")
        .eq("id", id)
        .single()
    
    if (error || !berita) {
        notFound()
    }

    // 2. Ambil daftar kategori berita untuk opsi dropdown
    const { data: categories = [] } = await supabase
        .from("kategori_berita")
        .select("id, nama")
        .order("nama", { ascending: true })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    Edit Berita
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Perbarui informasi konten, kategori, cover, atau status publikasi berita
                </p>
            </div>

            <BeritaForm
                initialData={berita}
                categories={categories || []}
            />
        </div>
    )
}