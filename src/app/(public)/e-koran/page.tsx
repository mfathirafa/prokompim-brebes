import { createClient } from "@/lib/supabase/server";
import { DownloadCard } from "@/components/download/download-card";
import { Newspaper } from "lucide-react";

export const metadata = {
    title: "E-Koran | Prokompim Pemkab Brebes",
    description: 
        "Katalog publikasi edisi e-koran dan majalah resmi Bagian Prokompim Setda Kabupaten Brebes.",
};

export default async function EKoranPage() {
    const supabase = await createClient();

    // Fetch files_download dengan JOIN kategori_download filter slug 'e-koran'
    const { data: fileList } = await supabase
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
                {fileList && fileList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fileList.map((file) => (
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