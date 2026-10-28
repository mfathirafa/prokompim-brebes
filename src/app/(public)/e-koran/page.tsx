import { createClient } from "@/lib/supabase/server";
import { DownloadCard } from "@/components/download/download-card";
import { EkoranCard } from "@/components/ekoran/ekoran-card";
import { Newspaper } from "lucide-react";

export const metadata = {
    title: "E-Koran | Prokompim Pemkab Brebes",
    description: 
        "Katalog publikasi edisi e-koran dan majalah resmi Bagian Prokompim Setda Kabupaten Brebes.",
};

export default async function EKoranPage() {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    // 1. Coba ambil dari tabel khusus `ekoran`
    let ekoranItems: Array<{
        id: string;
        judul: string;
        edisi: string | null;
        deskripsi: string | null;
        tanggal_terbit: string | null;
        file_url: string;
        file_name: string | null;
        file_size: number | null;
        thumbnail_url: string | null;
    }> = [];

    try {
        const { data: ekoranData } = await sb
            .from("ekoran")
            .select("*")
            .eq("is_active", true)
            .order("tanggal_terbit", { ascending: false });
        if (ekoranData) {
            ekoranItems = ekoranData;
        }
    } catch {
        // Jika tabel ekoran belum dimigrasi di Supabase, lanjut ke files_download fallback
    }

    // 2. Fallback: ambil juga files_download dengan filter kategori e-koran jika ekoran kosong
    let legacyFiles: Array<{
        id: string;
        judul: string;
        deskripsi: string | null;
        file_name: string;
        file_size: number | null;
        file_type: string | null;
        download_count: number;
        tanggal_kegiatan: string | null;
        kategori_download: { nama: string; slug: string; icon: string | null } | { nama: string; slug: string; icon: string | null }[];
    }> = [];

    if (ekoranItems.length === 0) {
        const { data } = await supabase
            .from("files_download")
            .select(
                `
                id,
                judul,
                deskripsi,
                file_name,
                file_size,
                file_type,
                download_count,
                tanggal_kegiatan,
                kategori_download!inner (
                    nama,
                    slug,
                    icon
                )
                `
            )
            .eq("is_active", true)
            .eq("kategori_download.slug", "e-koran")
            .order("tanggal_kegiatan", { ascending: false });
        if (data) {
            legacyFiles = data as unknown as typeof legacyFiles;
        }
    }

    const hasContent = ekoranItems.length > 0 || legacyFiles.length > 0;

    return (
        <div className="flex flex-col flex-1 pb-20">
            {/* Header Banner */}
            <section className="bg-gradient-to-r from-primary via-primary/95 to-brand-sky text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-gold text-xs font-semibold uppercase tracking-wider">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>Publikasi &amp; E-Paper</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        E-Koran &amp; Majalah Daerah
                    </h1>
                    <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
                        Arsip digital rilis koran elektronik, buletin, dan majalah resmi
                        Pemerintah Kabupaten Brebes yang dapat diunduh.
                    </p>
                </div>
            </section>

            {/* Konten Utama */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10">
                {ekoranItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ekoranItems.map((item) => (
                            <EkoranCard
                                key={item.id}
                                id={item.id}
                                judul={item.judul}
                                edisi={item.edisi}
                                deskripsi={item.deskripsi}
                                tanggal_terbit={item.tanggal_terbit}
                                file_url={item.file_url}
                                file_name={item.file_name}
                                file_size={item.file_size}
                                thumbnail_url={item.thumbnail_url}
                            />
                        ))}
                    </div>
                ) : legacyFiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {legacyFiles.map((file) => (
                            <DownloadCard
                                key={file.id}
                                id={file.id}
                                judul={file.judul}
                                deskripsi={file.deskripsi}
                                file_name={file.file_name}
                                file_size={file.file_size}
                                file_type={file.file_type}
                                download_count={file.download_count}
                                tanggal_kegiatan={file.tanggal_kegiatan}
                                kategori={
                                    Array.isArray(file.kategori_download)
                                        ? file.kategori_download[0]
                                        : file.kategori_download
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                        <Newspaper className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <h3 className="text-lg font-bold text-foreground mb-1">
                            Belum Ada Edisi E-Koran
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Edisi publikasi e-koran dan majalah Prokompim Brebes akan ditampilkan di sini.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
