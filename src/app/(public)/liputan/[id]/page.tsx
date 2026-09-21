import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, Camera } from "lucide-react";

interface LiputanDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: LiputanDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: liputan } = await supabase
        .from("liputan")
        .select("judul, deskripsi, cover_url")
        .eq("id", id)
        .eq("is_active", true)
        .single();

    if (!liputan) {
        return { title: "Liputan Tidak Ditemukan | Prokompim Brebes" };
    }

    return {
        title: `${liputan.judul} | Prokompim Pemkab Brebes`,
        description:
            liputan.deskripsi ||
            `Dokumentasi liputan kegiatan protokoler Brebes: ${liputan.judul}`,
        openGraph: {
            title: liputan.judul,
            description: liputan.deskripsi || undefined,
            images: liputan.cover_url ? [liputan.cover_url] : ["/logo.png"],
        },
    };
}

export default async function LiputanDetailPage({
    params,
}: LiputanDetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fetch liputan utama
    const { data: liputan } = await supabase
        .from("liputan")
        .select("id, judul, deskripsi, tanggal, cover_url")
        .eq("id", id)
        .eq("is_active", true)
        .single();
    
    if (!liputan) {
        notFound();
    }

    // 2. Fetch foto liputan (urutan ASC)
    const { data: fotoList } = await supabase
        .from("foto_liputan")
        .select("id, gambar_url, keterangan, urutan")
        .eq("liputan_id", id)
        .order("urutan", { ascending: true });

    return (
        <div className="flex flex-col flex-1 pb-20">
            {/* Header */}
            <section className="bg-gradient-to-r from-primary via-primary/95 to-brand-sky text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-gold text-xs font-semibold uppercase tracking-wider">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Dokumentasi Visual</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug max-w-3xl">
                       {liputan.judul} 
                    </h1>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Calendar className="w-4 h-4 text-brand-sky" />
                        <span>{formatDate(liputan.tanggal)}</span>
                    </div>
                    {liputan.deskripsi && (
                        <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
                            {liputan.deskripsi}
                        </p>
                    )}
                </div>
            </section>

            {/* Grid Foto */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10">
                {fotoList && fotoList.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {fotoList.map((foto) => (
                            <div
                                key={foto.id}
                                className="group relative aspect-square rounded-xl overflow-hidden bg-muted shadow-sm"
                            >
                                <Image
                                    src={foto.gambar_url}
                                    alt={foto.keterangan || liputan.judul}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {foto.keterangan && (
                                    <div
                                        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        <p className="text-white text-[11px] leading-snug line-clamp-2">
                                            {foto.keterangan}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                        <Camera className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">
                            Belum ada foto untuk liputan ini.
                        </p>
                    </div>
                )}

                {/* Tombol Kembali */}
                <div className="pt-10 mt-10 border-t border-border">
                    <Link
                        href="/liputan"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Galeri Liputan
                    </Link>
                </div>
            </main>
        </div>
    );
}