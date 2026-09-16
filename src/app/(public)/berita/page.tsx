import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BeritaCard } from "@/components/berita/berita-card";
import { Newspaper, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Rilis Berita | Prokompim Pemkab Brebes",
    description: 
        "Portal rilis berita resmi, publikasi kebijakan, dan informasi kegiatan pimpinan Pemerintah Kabupaten Brebes.",
};

interface BeritaPageProps {
    searchParams: Promise<{
        page?: string;
        kategori?: string;
        q?: string;
    }>;
}

const ITEMS_PER_PAGE = 9;

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
    const { page= "1", kategori = "", q = "" } = await searchParams;
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const supabase = await createClient();

    // 1. Fetch data kategori untuk tab filter
    const { data: kategoriList } = await supabase
        .from("kategori_berita")
        .select("id, nama, slug")
        .order("nama", { ascending: true });
    
    // 2. Cocokkan ID Kategori bila slug kategori dipilih
    let selectedKategoriId: number | null =  null;
    if (kategori) {
        const matched = kategoriList?.find((k) => k.slug === kategori);
        if (matched) selectedKategoriId = matched.id;
    }

    // 3. Setup Pagination & Query
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
        .from("berita")
        .select(
            `
            id,
            judul,
            slug,
            ringkasan,
            gambar_url,
            views,
            published_at,
            kategori_berita (
                nama,
                warna
            )
            `,
            { count: "exact" }
        )
        .eq("status", "published");
    
        if (selectedKategoriId !== null) {
            query = query.eq("kategori_id", selectedKategoriId);
        }

        if (q.trim()) {
            query = query.ilike("judul", `%${q.trim()}%`);
        }

        const { data: beritaList, count } = await query
            .order("published_at", { ascending: false })
            .range(from, to);
        
        const totalBerita = count || 0;
        const totalPages = Math.ceil(totalBerita / ITEMS_PER_PAGE) || 1;

        // Helper pembuat query string agar filter lain tidak hilang saat ganti halaman / filter
        const getFilterUrl = (newParams: { kategori?: string; page?: string; q?: string }) => {
            const params = new URLSearchParams();
            const finalKategori = newParams.kategori !== undefined ? newParams.kategori : kategori;
            const finalQ = newParams.q !== undefined ? newParams.q : q;
            const finalPage = newParams.page !== undefined ? newParams.page : "1";

            if (finalKategori) params.set("kategori", finalKategori);
            if (finalQ) params.set("q", finalQ);
            if (finalPage && finalPage !== "1") params.set("page", finalPage);

            const qs = params.toString();
            return qs ? `/berita?${qs}` : "/berita";
        };

        return (
            <div className="flex flex-col flex-1 pb-20">
                {/* Header Banner */}
                <section className="bg-gradient-to-r from-primary via-primary/95 to-brand-sky text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-gold text-xs font-semibold uppercase tracking-wider">
                            <Newspaper className="w-3.5 h-3.5" />
                            <span>Publikasi Humas & Protokol</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                            Rilis Berita Pemkab Brebes
                        </h1>
                        <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
                            Menyajikan berita resmi terkini mengenai kebijakan daerah, kegiatan pimpinan, dan program strategis Pemerintah Kabupaten Brebes.
                        </p>

                        {/* Form Pencarian */}
                        <form method="GET" action="/berita" className="pt-4 max-w-xl">
                            {kategori && <input type="hidden" name="kategori" value={kategori} />}
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
                                <input 
                                    type="text"
                                    name="q"
                                    defaultValue={q}
                                    placeholder="Cari judul berita atau topik..."
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
                    {/* Filtr Kategori (Pill Tabs) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
                        <Link
                            href={getFilterUrl({ kategori: "", page: "1" })}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                !kategori
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                        >
                            Semua Berita
                        </Link>
                        {kategoriList?.map((cat) => (
                            <Link
                                key={cat.id}
                                href={getFilterUrl({ kategori: cat.slug, page: "1" })}
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

                    {/* Info Pencarian jika ada filter aktif */}
                    {(q || kategori) && (
                        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
                            <div>
                                Menampilkan hasil untuk:{" "}
                                {q && <span className="font-bold text-foreground">&ldquo;{q}&rdquo;</span>}
                                {q && kategori && " di kategori "}
                                {kategori && (
                                    <span className="font-bold text-foreground">
                                        {kategoriList?.find((k) => k.slug === kategori)?.nama}
                                    </span>
                                )}
                                {` (${totalBerita} berita ditemukan)`}
                            </div>
                            <Link
                                href="/berita"
                                className="text-xs font-semibold text-brand-red hover:underline"
                            >
                                Reset Filter
                            </Link>
                        </div>
                    )}

                    {/* Grid 3 Kolom Card Berita */}
                    {beritaList && beritaList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {beritaList.map((item) => (
                                <BeritaCard 
                                    key={item.id}
                                    id={item.id}
                                    judul={item.judul}
                                    slug={item.slug}
                                    ringkasan={item.ringkasan}
                                    gambar_url={item.gambar_url}
                                    views={item.views}
                                    published_at={item.published_at}
                                    kategori={item.kategori_berita}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                            <Newspaper className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                            <h3 className="text-lg font-bold text-foreground mb-1">
                                Tidak Ada Berita Ditemukan
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                                Belum ada rilis berita yang sesuai dengan kata kunci atau kategori yang anda pilih.
                            </p>
                            <Button
                                render={<Link href="/berita" />}
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                            >
                                Tampilkan Semua Berita
                            </Button>
                        </div>  
                    )}

                    {/* Pagination Nav */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-12">
                            <Button
                                render={
                                    currentPage > 1 ? (
                                        <Link href={getFilterUrl({ page: (currentPage - 1).toString() })} />
                                    ) : (
                                        <button disabled />
                                    )
                                }
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                className="gap-1 rounded-lg"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Sebelumnya
                            </Button>

                            <span className="text-xs font-medium text-muted-foreground px-4">
                                Halaman <span className="font-bold text-foreground">{currentPage}</span> dari {totalPages}
                            </span>

                            <Button
                                render={
                                    currentPage < totalPages ? (
                                        <Link href={getFilterUrl({ page: (currentPage + 1).toString() })}/>
                                    ) : (
                                        <button disabled />
                                    )
                                }
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                className="gap-1 rounded-lg"
                            >
                                Selanjutnya
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        );
}