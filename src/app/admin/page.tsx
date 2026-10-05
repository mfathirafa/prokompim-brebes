import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import {
    Newspaper,
    Download,
    Users,
    MessageSquare,
    ArrowRight,
    Eye,
} from "lucide-react"

export const metadata = {
    title: "Dashboard Admin | Prokompim Brebes",
}

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch 4 stats & data tabel secara paralel di server
    const [
        { count: totalBeritaPublished },
        { count: totalFileDownload },
        { count: totalMember },
        { count: totalKomentarPending },
        { data: latestBerita },
        { data: pendingKomentar },
    ] = await Promise.all([
        supabase
            .from("berita")
            .select("*", { count: "exact", head: true })
            .eq("status", "published"),
        supabase
            .from("files_download")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true),
        supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "member"),
        supabase
            .from("komentar")
            .select("*", { count: "exact", head: true })
            .eq("is_approved", false),            
        supabase
            .from("berita")
            .select(`
                id,
                judul,
                slug,
                views,
                status,
                created_at,
                published_at,
                kategori_berita (
                    nama
                )    
            `)
            .order("created_at", { ascending: false })
            .limit(5),
        supabase
            .from("komentar")
            .select(`
                id,
                nama,
                isi,
                created_at,
                berita (
                    judul,
                    slug
                )    
            `)
            .eq("is_approved", false)
            .order("created_at", { ascending: false })
            .limit(5)
    ])

    // Konfigurasi 4 Stats Card dengan warna brand
    const stats = [
        {
            label: "Total Berita Published",
            count: totalBeritaPublished ?? 0,
            icon: Newspaper,
            accentBorder: "border-l-primary",
            iconBg: "bg-primary/10 text-primary",
            href: "/admin/berita?status=published",
        },
        {
            label: "Total File Download",
            count: totalFileDownload ?? 0,
            icon: Download,
            accentBorder: "border-l-brand-sky",
            iconBg: "bg-brand-sky/15 text-brand-sky",
            href: "/admin/download",
        },
        {
            label: "Total Member",
            count: totalMember ?? 0,
            icon: Users,
            accentBorder: "border-l-brand-gold",
            iconBg: "bg-brand-gold/15 text-amber-600 dark:text-brand-gold",
            href: "/admin/users",
        },
        {
            label: "Komentar Pending",
            count: totalKomentarPending ?? 0,
            icon: MessageSquare,
            accentBorder: "border-l-brand-red",
            iconBg: "bg-brand-red/10 text-brand-red",
            href: "/admin/komentar",
        },
    ]

    return (
        <div className="space-y-8">
            {/* 4 Stats Cards (2x2 Grid di layar sedang/kecil, 4 Kolom di layar besar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                        <Link
                            key={idx}
                            href={stat.href}
                            className={`p-5 rounded-xl bg-card border border-border ${stat.accentBorder} border-l-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between group`}
                        >
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                                    {stat.count.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} group-hover:scale-105 transition-transform`}
                            >
                                <Icon className="w-6 h-6" />
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Grid 2 Kolom: Berita Terbaru & Komentar Pending */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section: Berita Terbaru */}
                <section className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-border flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-foreground">
                                Berita Terbaru
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                5 publikasi rilis berita paling mutakhir
                            </p>
                        </div>
                        <Link
                            href="/admin/berita"
                            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                            Lihat Semua
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold border-b border-border">
                                <tr>
                                    <th className="px-4 py-3">Judul</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Views</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {latestBerita && latestBerita.length > 0 ? (
                                    latestBerita.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-muted/40 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-medium text-foreground max-w-[180px] truncate">
                                                <Link
                                                    href={`/berita/${item.slug}`}
                                                    target="_blank"
                                                    className="hover:text-primary hover:underline"
                                                    title={item.judul}
                                                >
                                                    {item.judul}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {item.kategori_berita?.nama || "Umum"}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {item.views ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {item.created_at ? formatDate(item.created_at) : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                {item.status === "published" ? (
                                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border border-zinc-500/20">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            Belum ada berita yang ditambahkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Section: Komentar Pending */}
                <section className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-border flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-foreground">
                                Komentar Pending
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Komentar publik yang menunggu persetujuan
                            </p>
                        </div>
                        <Link
                            href="/admin/komentar"
                            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                            Moderasi
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold border-b border-border">
                                <tr>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Cuplikan Isi</th>
                                    <th className="px-4 py-3">Berita</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pendingKomentar && pendingKomentar.length > 0 ? (
                                    pendingKomentar.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-muted/40 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                                                {item.nama}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate" title={item.isi}>
                                                &ldquo;{item.isi}&rdquo;
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate" title={item.berita?.judul || "-"}>
                                                {item.berita?.judul || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {item.created_at ? formatDate(item.created_at) : "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            Tidak ada komentar pending. Semua sudah termoderasi!🎉
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}