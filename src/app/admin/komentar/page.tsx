import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatDate, formatTime } from "@/lib/utils"
import { ADMIN_ITEMS_PER_PAGE } from "@/lib/constants"
import { KomentarRowActions } from "./komentar-actions"
import {
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    Search,
    ExternalLink,
    Clock,
    CheckCircle2,
} from "lucide-react"

export const metadata = {
    title: "Moderasi Komentar | Admin Prokompim",
}

interface AdminKomentarPageProps {
    searchParams: Promise<{
        status?: string
        page?: string
        q?: string
    }>
}

interface KomentarWithBerita {
    id: string
    nama: string
    email: string | null
    isi: string
    is_approved: boolean
    created_at: string
    berita: {
        id: string
        judul: string
        slug: string
    } | null
}

export default async function AdminKomentarPage({ searchParams }: AdminKomentarPageProps) {
    const { status = "", page = "1", q = "" } = await searchParams
    const currentPage = Math.max(1, parseInt(page, 10) || 1)
    const supabase = await createClient()

    // 1. Fetch total count per status untuk tab badge
    const [
        { count: countAll },
        { count: countPending },
        { count: countApproved },
    ] = await Promise.all([
        supabase.from("komentar").select("*", { count: "exact", head: true }),
        supabase.from("komentar").select("*", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("komentar").select("*", { count: "exact", head: true }).eq("is_approved", true),
    ])

    // 2. Query data komentar dengan pagination dan filter
    const from = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE
    const to = from + ADMIN_ITEMS_PER_PAGE - 1

    let query = supabase
        .from("komentar")
        .select(
            `
            id,
            nama,
            email,
            isi,
            is_approved,
            created_at,
            berita (
                id,
                judul,
                slug
            )
        `,
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to)

    if (status === "pending") {
        query = query.eq("is_approved", false)
    } else if (status === "approved") {
        query = query.eq("is_approved", true)
    }

    if (q.trim()) {
        query = query.or(`nama.ilike.%${q.trim()}%,isi.ilike.%${q.trim()}%`)
    }

    const { data: rawKomentarList, count: totalFiltered = 0 } = await query
    const komentarList = (rawKomentarList as unknown as KomentarWithBerita[]) || []
    const totalPages = Math.ceil((totalFiltered ?? 0) / ADMIN_ITEMS_PER_PAGE) || 1

    // Helper URL generator untuk paginasi & filter
    const buildUrl = (targetPage: number, targetStatus: string, search: string) => {
        const params = new URLSearchParams()
        if (targetStatus) params.set("status", targetStatus)
        if (search) params.set("q", search)
        if (targetPage > 1) params.set("page", targetPage.toString())
        const qs = params.toString()
        return `/admin/komentar${qs ? `?${qs}` : ""}`
    }

    const tabs = [
        { label: "Semua", value: "", count: countAll ?? 0 },
        { label: "Menunggu Moderasi", value: "pending", count: countPending ?? 0 },
        { label: "Disetujui", value: "approved", count: countApproved ?? 0 },
    ]

    return (
        <div className="space-y-6">
            {/* Header: Judul & Subtitle */}
            <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    Moderasi Komentar Pengunjung
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Setujui atau tolak komentar publik yang masuk pada rilis berita
                </p>
            </div>

            {/* Filter Tabs & Search Form */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
                {/* Tabs Filter */}
                <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/50 self-start">
                    {tabs.map((tab) => {
                        const active = status === tab.value
                        return (
                            <Link
                                key={tab.value}
                                href={buildUrl(1, tab.value, q)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    active
                                        ? "bg-background text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </Link>
                        )
                    })}
                </div>

                {/* Form Pencarian */}
                <form
                    action="/admin/komentar"
                    method="GET"
                    className="relative w-full md:w-72"
                >
                    {status && <input type="hidden" name="status" value={status} />}
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Cari pengirim atau isi komentar..."
                        className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                </form>
            </div>

            {/* Tabel Data Komentar */}
            <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-4 py-3.5">Pengirim</th>
                                <th className="px-4 py-3.5">Komentar</th>
                                <th className="px-4 py-3.5">Berita Terkait</th>
                                <th className="px-4 py-3.5">Waktu</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {komentarList.length > 0 ? (
                                komentarList.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        {/* Pengirim */}
                                        <td className="px-4 py-3.5 align-top">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                                                    {(item.nama || "T")[0].toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-foreground truncate max-w-[140px]">
                                                        {item.nama}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                                                        {item.email || "Tamu"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Isi Komentar */}
                                        <td className="px-4 py-3.5 align-top max-w-[280px]">
                                            <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                                                &ldquo;{item.isi}&rdquo;
                                            </p>
                                        </td>

                                        {/* Berita Terkait */}
                                        <td className="px-4 py-3.5 align-top max-w-[220px]">
                                            {item.berita ? (
                                                <Link
                                                    href={`/berita/${item.berita.slug}`}
                                                    target="_blank"
                                                    className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 inline-flex items-center gap-1 group"
                                                >
                                                    <span>{item.berita.judul}</span>
                                                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground italic">
                                                    Berita tidak ditemukan
                                                </span>
                                            )}
                                        </td>

                                        {/* Tanggal & Waktu */}
                                        <td className="px-4 py-3.5 align-top whitespace-nowrap text-muted-foreground">
                                            <div>{formatDate(item.created_at)}</div>
                                            <div className="text-[10px] text-muted-foreground/80">
                                                {formatTime(item.created_at)} WIB
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                                            {item.is_approved ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Disetujui
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                                                    <Clock className="w-3 h-3" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3.5 align-top text-right">
                                            <KomentarRowActions
                                                id={item.id}
                                                isApproved={item.is_approved}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <MessageSquare className="w-8 h-8 text-muted-foreground/40 stroke-1" />
                                            <p className="text-xs font-medium">
                                                {q
                                                    ? "Tidak ada komentar yang cocok dengan pencarian."
                                                    : "Belum ada komentar pengunjung."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                        <p>
                            Menampilkan halaman <span className="font-semibold text-foreground">{currentPage}</span> dari{" "}
                            <span className="font-semibold text-foreground">{totalPages}</span> (Total{" "}
                            <span className="font-semibold text-foreground">{totalFiltered}</span> komentar)
                        </p>
                        <div className="flex items-center gap-2">
                            {currentPage > 1 ? (
                                <Link
                                    href={buildUrl(currentPage - 1, status, q)}
                                    className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Sebelumnya</span>
                                </Link>
                            ) : (
                                <span className="px-2.5 py-1.5 rounded-lg border border-border/50 text-xs font-semibold text-muted-foreground/50 inline-flex items-center gap-1 cursor-not-allowed">
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Sebelumnya</span>
                                </span>
                            )}

                            {currentPage < totalPages ? (
                                <Link
                                    href={buildUrl(currentPage + 1, status, q)}
                                    className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1"
                                >
                                    <span>Selanjutnya</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <span className="px-2.5 py-1.5 rounded-lg border border-border/50 text-xs font-semibold text-muted-foreground/50 inline-flex items-center gap-1 cursor-not-allowed">
                                    <span>Selanjutnya</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}