import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Camera, Calendar } from "lucide-react";

export const metadata = {
    title: "Galeri Liputan | Prokompim Pemkab Brebes",
    description:
        "Galeri dokumentasi visual kegiatan protokoler dan liputan resmi pimpinan Pemerintah Kabupaten Brebes.",
};

export default async function LiputanPage() {
    const supabase = await createClient();

    const { data: liputanList } = await supabase
        .from("liputan")
        .select("id, judul, deskripsi, tanggal, cover_url")
        .eq("is_active", true)
        .order("tanggal", { ascending: false });

    return (
        <div className="flex flex-col flex-1 pb-20">
            {/* Header Banner */}
            <section className="bg-gradient-to-r from-primary via-primary/95 to-brand-sky text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-gold text-xs font-semibold uppercase tracking-wider">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Dokumentasi Visual</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Galeri Liputan Protokoler
                    </h1>
                    <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
                        Dokumentasi visual kegiatan resmi pimpinan dan protokoler
                        Pemerintah Kabupaten Brebes.
                    </p>
                </div>
            </section>

            {/* Konten Utama */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10">
                {liputanList && liputanList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {liputanList.map((album) => (
                            <Link
                                key={album.id}
                                href={`/liputan/${album.id}`}
                                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 shadow-md"
                            >
                                <Image 
                                    src={album.cover_url || "/logo.png"}
                                    alt={album.judul}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-95"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                                    <span className="text-[11px] font-medium text-white/80 mb-1.5 flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3 text-brand-sky" />
                                        {formatDate(album.tanggal)}
                                    </span>
                                    <h3 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors">
                                        {album.judul}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                        <Camera className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3 "/>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                            Belum Ada Liputan
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Dokumentasi liputan kegiatan protokoler akan ditampilkan di sini.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}