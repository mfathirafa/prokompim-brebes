import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { formatDate } from "@/lib/utils"
import { ADMIN_ITEMS_PER_PAGE } from "@/lib/constants"
import { UserRowActions } from "./user-actions"
import {
    Users,
    Shield,
    User as UserIcon,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Phone,
} from "lucide-react"

export const metadata = {
    title: "Kelola Pengguna | Admin Prokompim",
}

interface AdminUsersPageProps {
    searchParams: Promise<{
        tab?: string
        page?: string
        q?: string
    }>
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    const { tab = "", page = "1", q = "" } = await searchParams
    const currentPage = Math.max(1, parseInt(page, 10) || 1)

    // 1. Verifikasi autentikasi sesi admin saat ini
    const supabaseUser = await createClient()
    const {
        data: { user: currentUser },
    } = await supabaseUser.auth.getUser()

    if (!currentUser) {
        redirect("/login?redirect=/admin/users")
    }

    const currentRole = currentUser.app_metadata?.role || currentUser.user_metadata?.role
    if (currentRole !== "admin") {
        redirect("/")
    }

    // 2. Gunakan admin client untuk query tabel profiles (bypass RLS)
    const adminClient = createAdminClient()

    // Hitung badge counter per kategori tab
    const [
        { count: countAll },
        { count: countAdmin },
        { count: countMember },
        { count: countInactive },
    ] = await Promise.all([
        adminClient.from("profiles").select("*", { count: "exact", head: true }),
        adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
        adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member"),
        adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", false),
    ])

    // 3. Query daftar pengguna dengan filter, pencarian, dan pagination
    const from = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE
    const to = from + ADMIN_ITEMS_PER_PAGE - 1

    let query = adminClient
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to)

    if (tab === "admin") {
        query = query.eq("role", "admin")
    } else if (tab === "member") {
        query = query.eq("role", "member")
    } else if (tab === "inactive") {
        query = query.eq("is_active", false)
    }

    const cleanQuery = q.trim()
    if (cleanQuery) {
        query = query.or(
            `nama.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%,no_hp.ilike.%${cleanQuery}%`
        )
    }

    const { data: rawUsers, count } = await query
    const totalFiltered = count ?? 0
    const userList = rawUsers || []
    const totalPages = Math.ceil(totalFiltered / ADMIN_ITEMS_PER_PAGE) || 1

    // Helper generator URL filter & paginasi
    const buildUrl = (targetPage: number, targetTab: string, search: string) => {
        const params = new URLSearchParams()
        if (targetTab) params.set("tab", targetTab)
        if (search) params.set("q", search)
        if (targetPage > 1) params.set("page", targetPage.toString())
        const qs = params.toString()
        return `/admin/users${qs ? `?${qs}` : ""}`
    }

    const tabs = [
        { label: "Semua", value: "", count: countAll ?? 0 },
        { label: "Admin", value: "admin", count: countAdmin ?? 0 },
        { label: "Member", value: "member", count: countMember ?? 0 },
        { label: "Nonaktif", value: "inactive", count: countInactive ?? 0 },
    ]

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Kelola Pengguna & Akses
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Pantau seluruh akun terdaftar, kelola hak akses administrator, dan atur status keaktifan pengguna.
                    </p>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tabs Kategori */}
                <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border self-start overflow-x-auto max-w-full">
                    {tabs.map((t) => {
                        const isActive = tab === t.value
                        return (
                            <Link
                                key={t.value}
                                href={buildUrl(1, t.value, cleanQuery)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? "bg-background text-foreground shadow-xs font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                            >
                                {t.label}
                                <span
                                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {t.count}
                                </span>
                            </Link>
                        )
                    })}
                </div>

                {/* Form Pencarian */}
                <form method="GET" action="/admin/users" className="relative w-full md:w-72">
                    {tab && <input type="hidden" name="tab" value={tab} />}
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        name="q"
                        defaultValue={cleanQuery}
                        placeholder="Cari nama, email, no hp..."
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </form>
            </div>

            {/* Tabel Daftar Pengguna */}
            <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">Pengguna</th>
                                <th scope="col" className="px-6 py-4">Role Akses</th>
                                <th scope="col" className="px-6 py-4">Kontak</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4">Bergabung</th>
                                <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {userList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                <Users className="w-6 h-6 text-muted-foreground/60" />
                                            </div>
                                            <p className="text-sm font-medium">Tidak ada data pengguna ditemukan.</p>
                                            {cleanQuery && (
                                                <Link
                                                    href={buildUrl(1, tab, "")}
                                                    className="text-xs text-primary hover:underline font-semibold"
                                                >
                                                    Hapus pencarian
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                userList.map((user) => {
                                    const isAdmin = user.role === "admin"
                                    const isCurrent = user.id === currentUser.id
                                    const initial = (user.nama?.[0] || user.email?.[0] || "U").toUpperCase()

                                    return (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                            {/* Pengguna: Avatar, Nama, Email */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                                            isAdmin
                                                                ? "bg-primary text-primary-foreground shadow-xs"
                                                                : "bg-muted text-foreground border border-border"
                                                        }`}
                                                    >
                                                        {initial}
                                                    </div>
                                                    <div className="min-w-0 max-w-[200px] sm:max-w-[240px]">
                                                        <div className="font-semibold text-foreground truncate flex items-center gap-1.5">
                                                            {user.nama || "Tanpa Nama"}
                                                            {isCurrent && (
                                                                <span className="text-[10px] font-medium px-1.5 py-0.2 bg-primary/10 text-primary rounded-full shrink-0">
                                                                    Anda
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role Akses Badge */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {isAdmin ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                                        <Shield className="w-3 h-3" />
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                                                        <UserIcon className="w-3 h-3" />
                                                        Member
                                                    </span>
                                                )}
                                            </td>

                                            {/* Kontak */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                                                {user.no_hp ? (
                                                    <div className="flex items-center gap-1.5 text-foreground">
                                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                                        {user.no_hp}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground/60">—</span>
                                                )}
                                            </td>

                                            {/* Status Keaktifan */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_active ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                                                        <XCircle className="w-3 h-3" />
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </td>

                                            {/* Tanggal Terdaftar */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                                                {user.created_at ? formatDate(user.created_at) : "—"}
                                            </td>

                                            {/* Aksi Baris */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <UserRowActions
                                                    id={user.id}
                                                    email={user.email}
                                                    nama={user.nama}
                                                    role={user.role}
                                                    isActive={user.is_active}
                                                    isCurrent={isCurrent}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Paginasi */}
                {totalFiltered > 0 && (
                    <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground">
                        <div>
                            Menampilkan <span className="font-semibold text-foreground">{from + 1}</span> sampai{" "}
                            <span className="font-semibold text-foreground">
                                {Math.min(to + 1, totalFiltered)}
                            </span>{" "}
                            dari <span className="font-semibold text-foreground">{totalFiltered}</span> total pengguna
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <Link
                                    href={buildUrl(currentPage - 1, tab, cleanQuery)}
                                    aria-disabled={currentPage <= 1}
                                    className={`p-1.5 rounded-lg border border-border transition-colors ${
                                        currentPage <= 1
                                            ? "pointer-events-none opacity-40 bg-muted/40"
                                            : "hover:bg-muted bg-background text-foreground cursor-pointer"
                                    }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Link>

                                <span className="px-2 font-medium text-foreground">
                                    {currentPage} / {totalPages}
                                </span>

                                <Link
                                    href={buildUrl(currentPage + 1, tab, cleanQuery)}
                                    aria-disabled={currentPage >= totalPages}
                                    className={`p-1.5 rounded-lg border border-border transition-colors ${
                                        currentPage >= totalPages
                                            ? "pointer-events-none opacity-40 bg-muted/40"
                                            : "hover:bg-muted bg-background text-foreground cursor-pointer"
                                    }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
