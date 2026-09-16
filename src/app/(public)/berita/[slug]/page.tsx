import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ViewIncrementer } from "@/components/berita/view-incrementer";
import {
    Calendar,
    Eye,
    User,
    ArrowLeft,
    ChevronRight,
    Share2
} from "lucide-react";

interface BeritaDetailPageProps {
    params: Promise<{ slug: string }>;
}

interface BeritaTerkaitItem {
    id: string;
    judul: string;
    slug: string;
    gambar_url: string | null;
    published_at: string | null;
    views: number;
}

// 1. generateMetadata untuk SEO
export async function generateMetadata({
    params,
}: BeritaDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: berita } = await supabase
        .from("berita")
        .select("judul, ringkasan, gambar_url")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
    
    if (!berita) {
        return {
            title: "Berita Tidak Ditemukan | Prokompim Brebes",
        };
    }

    return {
        title: `${berita.judul} | Prokompim Pemkab Brebes`,
        description:
            berita.ringkasan ||
            `Rilis berita resmi Bagian Protokol dan Komunikasi Pimpinan Setda Brebes: ${berita.judul}`,
        openGraph: {
            title: berita.judul,
            description: berita.ringkasan || undefined,
            images: berita.gambar_url ? [berita.gambar_url] : ["/logo.png"],
        },
    };
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // 2. Fetch Berita Utama
    const { data: berita } = await supabase
        .from("berita")
        .select(
            `
            id,
            judul,
            slug,
            ringkasan,
            isi,
            gambar_url,
            views,
            published_at,
            status,
            kategori_id,
            kategori_berita (
                id,
                nama,
                slug,
                warna
            ),
            profiles (
                nama
            )
            `
        )
        .eq("slug", slug)
        .eq("status", "published")
        .single();
    
    if (!berita) {
        notFound();
    }

    // 3. Fetch 5 Berita Terkait (Kategori sama, exclude current id)
    let beritaTerkait: BeritaTerkaitItem[] = [];
    if (berita.kategori_id) {
        const { data } = await supabase
            .from("berita")
            .select(
                `
                id,
                judul,
                slug,
                gambar_url,
                published_at,
                views
                `
            )
            .eq("status", "published")
            .eq("kategori_id", berita.kategori_id)
            .neq("id", berita.id)
            .order("published_at", { ascending: false })
            .limit(5);

        beritaTerkait = data || [];
    }

    return (
        <div className="flex flex-col flex-1 pb-20">
            {/* Client Component untuk trigger increment views via API */}
            <ViewIncrementer slug={berita.slug} />

            {/* Breadcrumb Navigation */}
            <div className="border-b border-border bg-muted/30 pt-28 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Beranda
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        <Link href="/berita" className="hover:text-primary transition-colors">
                            Rilis Berita
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
                            {berita.judul}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Content Layout (2/3 Kiri + 1/3 Kanan) */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Kolom Kiri: Konten Artikel (8 Kolom 2/3) */}
                    <article className="lg:col-span-8 flex flex-col">
                        {/* Header Artikel */}
                        <div className="space-y-4 mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                {berita.kategori_berita?.nama || "Berita"}
                            </span>

                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-snug">
                                {berita.judul}
                            </h1>

                            {/* Meta Info Bar */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-y border-border py-3">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-brand-sky" />
                                    {berita.published_at ? formatDate(berita.published_at) : "-"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {berita.profiles?.nama || "Prokompim Setda Brebes"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4" />
                                    {berita.views || 0} pembaca
                                </span>
                            </div>
                        </div>

                        {/* Gambar Utama Full-WIdth */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-8 shadow-md">
                            <Image 
                                src={berita.gambar_url || "/logo.png"}
                                alt={berita.judul}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 66vw"
                                className="object-cover"
                            />
                        </div>

                        {/* Isi Konten Berita */}
                        <div 
                            className="text-foreground leading-relaxed text-base sm:text-lg space-y-4 
                            [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl 
                            [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 
                            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_img]:rounded-xl [&_img]:my-4 [&_blockquote]:border-l-4 
                            [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic"
                            dangerouslySetInnerHTML={{ __html: berita.isi }}
                        />

                        {/* Footer Artikel: Back button */}
                        <div className="pt-10 mt-10 border-t border-border flex items-center justify-between">
                            <Link
                                href="/berita"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Daftar Berita
                            </Link>
                        </div>
                    </article>

                    {/* Kolom Kanan: Sidebar Berita Terkait (4 Kolom / 1/3) */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm sticky top-28">
                            <h2 className="text-base font-bold tracking-tight text-foreground pb-4 mb-5 border-b border-border flex items-center gap-2">
                                <Share2 className="w-4 h-4 text-brand-red" />
                                Berita Terkait
                            </h2>

                            {beritaTerkait.length > 0 ? (
                                <div className="space-y-4">
                                    {beritaTerkait.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/berita/${item.slug}`}
                                            className="group flex gap-3 items-center hover:bg-muted/50 p-2 rounded-xl transition-colors"
                                        >
                                            <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                                                <Image 
                                                    src={item.gambar_url || "/logo.png"}
                                                    alt={item.judul}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                                                    <Calendar className="w-3 h-3 text-brand-sky" />
                                                    {item.published_at ? formatDate(item.published_at) : "-"}
                                                </span>
                                                <h3 className="font-semibold text-xs leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                                                    {item.judul}
                                                </h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground py-4 text-center">
                                    Belum ada berita terkait lainnya
                                </p>
                            )}

                            {/* Info Widget Prokompim */}
                            <div className="mt-8 pt-6 border-t border-border/80 text-xs text-muted-foreground space-y-2">
                                <p className="font-semibold text-foreground">
                                    Bagian Protokol & Komunikasi Pimpinan
                                </p>
                                <p className="leading-relaxed">
                                    Kantor Pemerintahan Terpadu<br />
                                    Jl. Proklamasi No. 77 Brebes
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}