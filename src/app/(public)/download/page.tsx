import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FileText, Download, Search, FolderOpen, FileDown } from "lucide-react";
import { DownloadCard } from "@/components/download/download-card";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Dokumen Unduhan | Prokompim Pemkab Brebes",
    description: 
    "Unduh dokumen resmi Prokompim Brebes: sambutan pimpinan, tata upacara, pedoman protokoler, dan majalah e-koran.",
};

interface DownloadPageProps {
    searchParams: Promise<{
        kategori?: string;
        q?: string;
    }>;
}

export default async function DownloadPage({ searchParams }: DownloadPageProps) {
    const { kategori = "", q = "" } = await searchParams;
    const supabase = await createClient();

    // 1. Fetch kategori download untuk tab filter
    const { data: kategoriList } = await supabase
        .from("kategori_download")
        .select("id, nama, slug, icon")
        .order("urutan", { ascending: true });

    // 2. Cocokkan ID Kategori dari slug
    let selectedKategoriId: number | null = null;
    if (kategori) {
        const matched = kategoriList?.find((k) => k.slug === kategori);
        if (matched) selectedKategoriId = matched.id;
    }

    // 3. Fetch file_download dengan filter 
    let query = supabase
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
            kategori_id,
            kategori_download (
                nama,
                slug,
                icon
            )
            `,
            { count: "exact" }
        )
        .eq("is_active", true);

    if (selectedKategoriId !== null) {
        query = query.eq("kategori_id", selectedKategoriId);
    }

    if (q.trim()) {
        query = query.ilike("judul", `%${q.trim()}%`);
    }

    const { data: fileList, count } = await query.order("tanggal_kegiatan", {
        ascending: false,
    });

    const totalFile = count || 0;

    // Helper URL filter
    const getFilterUrl = (newParams: { kategori?: string; q?: string }) => {
        const params = new URLSearchParams();
        const finalKategori = newParams.kategori !== undefined ? newParams.kategori : kategori;
        const finalQ = newParams.q !== undefined ? newParams.q : q;
        if (finalKategori) params.set("kategori", finalKategori);
        if (finalQ) params.set("q", finalQ);
        const qs = params.toString();
        return qs ? `/download?${qs}` : "/download"
    };

    return (
        <div className="flex flex-col flex-1 pb-20">
            {/* Header Banner */}
            <section className="bg-gradient-to-r from-primary via-primary/95 to-brand-sky text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-gold text-xs font-semibold uppercase tracking-wider">
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Dokumen Resmi Prokompim</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Dokumen Unduhan
                    </h1>
                    <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
                        Unduh dokumen resmi Prokompim Brebes. Sambutan pimpinan, tata upacara, 
                        pedoman protokoler, dan majalah e-koran tersedia untuk pengguna terdaftar.
                    </p>

                    {/* Form Pencarian */}
                    <form method="GET" action="/download" className="pt-4 max-w-xl">
                        {kategori && (
                            <input type="hidden" name="kategori" value={kategori} />
                        )}
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
                            <input 
                                type="text"
                                name="q"
                                defaultValue={q}
                                placeholder="Cari nama dokumen..."
                                className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-500 shadow-md border-0 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm" 
                            />
                            <button
                                type="submit"
                                className="absolute right-2 px-5 py-2 rounded-lg bg-brand-red hover:bg-brand-red/90 text-white font-medium text-xs shadow cursor-pointer transition-colors"
                            >
                                Cari
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Konten Utama */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10">
                {/* Tab Filter Kategori */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
                    <Link
                        href={getFilterUrl({ kategori: "", q })}
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                            !kategori
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                    >
                        Semua Dokumen
                    </Link>
                    {kategoriList?.map((cat) => (
                        <Link
                            key={cat.id}
                            href={getFilterUrl({ kategori: cat.slug, q })}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                kategori === cat.slug
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                        >
                            {cat.nama}
                        </Link>
                    ))}
                </div>

                {/* Info Hasil Filter */}
                {(q || kategori) && (
                    <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
                        <div>
                            Menampilkan hasil untuk:{" "}
                            {q && (
                                <span className="font-bold text-foreground">&ldquo;{q}&rdquo;</span>
                            )}
                            {q && kategori && " di kategori "}
                            {kategori && (
                                <span className="font-bold text-foreground">
                                    {kategoriList?.find((k) => k.slug === kategori)?.nama}
                                </span>
                            )}
                            {` (${totalFile} dokumen ditemukan)`}
                        </div>
                        <Link
                            href="/download"
                            className="text-xs font-semibold text-brand-red hover:underline"
                        >
                            Reset Filter
                        </Link>
                    </div>
                )}

                {/* Grid Dokumen */}
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
                        <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <h3 className="text-lg font-bold text-foreground mb-1">
                            Tidak Ada Dokumen Ditemukan
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                            Belum ada dokumen yang sesuai dengan kata kunci atau kategori yang anda pilih
                        </p>
                        <Button
                            render={<Link href="/download" />}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                        >
                            Tampilkan Semua Dokumen
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}