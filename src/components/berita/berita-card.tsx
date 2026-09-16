import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface BeritaCardProps {
    id: string;
    judul: string;
    slug: string;
    ringkasan?: string | null;
    gambar_url?:string | null;
    views?: number;
    published_at?: string | null;
    kategori?: {
        nama?: string | null;
        warna?: string | null;
    } | null;
}

export function BeritaCard({
    judul,
    slug,
    ringkasan,
    gambar_url,
    views = 0,
    published_at,
    kategori,
}: BeritaCardProps) {
    return(
    <article className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Gambar Thumbnail */}
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
            <Image 
                src={gambar_url || "/logo.png"}
                alt={judul}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow">
                {kategori?.nama || "Berita"}
            </span>
        </div>

        {/* Konten Card */}
        <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-sky" />
                    {published_at ? formatDate(published_at) : "-"}
                </span>
                <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {views || 0} views
                </span>
            </div>

            <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
                <Link href={`/berita/${slug}`}>{judul}</Link>
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                {ringkasan || "Klik untuk membaca berita selengkapnya..."}
            </p>

            <Link
                href={`/berita/${slug}`}
                className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1 mt-auto"
            >
                Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    </article>
    );
}