# Laporan Progres Harian — 25 September 2026

**Nama:** Muhammad Fathi Rafa (Magang)  
**Proyek:** Portal Web Bagian Protokol dan Komunikasi Pimpinan (Prokompim) Setda Brebes  
**Tech Stack:** Next.js 16 + Supabase + Tailwind CSS + Vercel  
**Live URL:** [https://prokompim-brebeskab.vercel.app](https://prokompim-brebeskab.vercel.app)

---

## 1. Ringkasan Pekerjaan Hari Ini

Hari ini fokus pada kelanjutan **Modul Kelola Berita (`/admin/berita`)** pada Panel Admin:
1. Menyiapkan **Server Actions Berita** (`actions.ts`) untuk mutasi status (`published` ↔ `draft`) dan penghapusan berita (cascade hapus komentar).
2. Merancang **Client Component Aksi Baris Berita** (`berita-actions.tsx`) dengan `useTransition`, konfirmasi hapus, preview publik, dan edit.
3. Merancang **Halaman Utama Kelola Berita** (`page.tsx`) dengan filter tab status (`Semua`, `Published`, `Draft`), input pencarian judul, tabel responsif dengan thumbnail gambar, dan paginasi 10 item per halaman.

---

## 2. Rincian Kode & Implementasi Berita Admin

### A. File 1: Server Actions Berita
* **Path:** `D:\Rafa\Projek\Release_Berita_Prokompim\web\src\app\admin\berita\actions.ts`
* Dibuat manual oleh developer untuk menangani mutasi data sisi server.

---

### B. File 2: Client Component Aksi Baris (`berita-actions.tsx`)
* **Path Lengkap:** `D:\Rafa\Projek\Release_Berita_Prokompim\web\src\app\admin\berita\berita-actions.tsx`
* **Status:** File Baru
* **Fungsi:**
  * Tombol Pratinjau (link tab baru ke `/berita/[slug]`).
  * Tombol Toggle Status Berita (`published` / `draft`) dengan ikon dinamis dan indikator loading (`Loader2`).
  * Tombol Sunting (link ke form edit `/admin/berita/[id]/edit`).
  * Tombol Hapus dengan konfirmasi `window.confirm` dan indikator proses.

```tsx
"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { toggleBeritaStatus, deleteBerita } from "./actions"
import {
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2,
    ExternalLink,
} from "lucide-react"

interface BeritaRowActionsProps {
    id: string
    slug: string
    status: string
}

export function BeritaRowActions({ id, slug, status }: BeritaRowActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [actionType, setActionType] = useState<"toggle" | "delete" | null>(null)

    const handleToggle = () => {
        setActionType("toggle")
        startTransition(async () => {
            try {
                await toggleBeritaStatus(id, status)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengubah status.")
            } finally {
                setActionType(null)
            }
        })
    }

    const handleDelete = () => {
        const confirmed = window.confirm(
            "Apakah Anda yakin ingin menghapus berita ini beserta seluruh komentar di dalamnya? Tindakan ini tidak dapat dibatalkan."
        )
        if (!confirmed) return

        setActionType("delete")
        startTransition(async () => {
            try {
                await deleteBerita(id)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus berita.")
            } finally {
                setActionType(null)
            }
        })
    }

    return (
        <div className="flex items-center justify-end gap-1.5">
            {/* Pratinjau Berita Publik */}
            <Link
                href={`/berita/${slug}`}
                target="_blank"
                title="Lihat Pratinjau Berita di Website"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
                <ExternalLink className="w-4 h-4" />
            </Link>

            {/* Toggle Status (Draft <-> Published) */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={isPending}
                title={status === "published" ? "Ubah ke Draft" : "Publikasikan Berita"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                    status === "published"
                        ? "text-emerald-600 hover:bg-emerald-500/10"
                        : "text-amber-600 hover:bg-amber-500/10"
                }`}
            >
                {isPending && actionType === "toggle" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === "published" ? (
                    <CheckCircle2 className="w-4 h-4" />
                ) : (
                    <XCircle className="w-4 h-4" />
                )}
            </button>

            {/* Edit Berita */}
            <Link
                href={`/admin/berita/${id}/edit`}
                title="Edit Berita"
                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </Link>

            {/* Hapus Berita */}
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                title="Hapus Berita"
                className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
            >
                {isPending && actionType === "delete" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>
        </div>
    )
}
```

---

### C. File 3: Halaman Kelola Berita (`page.tsx`)
* **Path Lengkap:** `D:\Rafa\Projek\Release_Berita_Prokompim\web\src\app\admin\berita\page.tsx`
* **Status:** File Baru
* **Fitur:**
  * Server Component terintegrasi Supabase Server Client.
  * Tab filter status: `Semua`, `Published`, dan `Draft` dengan counter exact.
  * Form pencarian judul berita.
  * Tabel data berita responsif (Cover, Judul, Kategori, Views, Tanggal, Badge Status, Aksi).
  * Kontrol paginasi 10 item per halaman (`ADMIN_ITEMS_PER_PAGE = 10`).

```tsx
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import { ADMIN_ITEMS_PER_PAGE } from "@/lib/constants"
import { BeritaRowActions } from "./berita-actions"
import {
    Plus,
    Newspaper,
    Eye,
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react"

export const metadata = {
    title: "Kelola Berita | Admin Prokompim",
}

interface AdminBeritaPageProps {
    searchParams: Promise<{
        status?: string
        page?: string
        q?: string
    }>
}

export default async function AdminBeritaPage({ searchParams }: AdminBeritaPageProps) {
    const { status = "", page = "1", q = "" } = await searchParams
    const currentPage = Math.max(1, parseInt(page, 10) || 1)
    const supabase = await createClient()

    // 1. Fetch total count per status untuk tab badge
    const [
        { count: countAll },
        { count: countPublished },
        { count: countDraft },
    ] = await Promise.all([
        supabase.from("berita").select("*", { count: "exact", head: true }),
        supabase.from("berita").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("berita").select("*", { count: "exact", head: true }).eq("status", "draft"),
    ])

    // 2. Query data berita dengan pagination dan filter
    const from = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE
    const to = from + ADMIN_ITEMS_PER_PAGE - 1

    let query = supabase
        .from("berita")
        .select(
            `
            id,
            judul,
            slug,
            gambar_url,
            views,
            status,
            created_at,
            published_at,
            kategori_berita (
                nama
            )
        `,
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to)

    if (status === "published" || status === "draft") {
        query = query.eq("status", status)
    }

    if (q.trim()) {
        query = query.ilike("judul", `%${q.trim()}%`)
    }

    const { data: beritaList, count: totalFiltered = 0 } = await query
    const totalPages = Math.ceil((totalFiltered ?? 0) / ADMIN_ITEMS_PER_PAGE) || 1

    // Helper URL generator untuk paginasi & filter
    const buildUrl = (targetPage: number, targetStatus: string, search: string) => {
        const params = new URLSearchParams()
        if (targetStatus) params.set("status", targetStatus)
        if (search) params.set("q", search)
        if (targetPage > 1) params.set("page", targetPage.toString())
        const qs = params.toString()
        return `/admin/berita${qs ? `?${qs}` : ""}`
    }

    const tabs = [
        { label: "Semua", value: "", count: countAll ?? 0 },
        { label: "Published", value: "published", count: countPublished ?? 0 },
        { label: "Draft", value: "draft", count: countDraft ?? 0 },
    ]

    return (
        <div className="space-y-6">
            {/* Header: Judul & Tombol Tambah */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                        Kelola Rilis Berita
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Publikasikan, sunting, dan atur berita protokol pimpinan daerah
                    </p>
                </div>
                <Link
                    href="/admin/berita/tambah"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Berita</span>
                </Link>
            </div>

            {/* Filter Tabs & Search Form */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
                {/* Tabs Filter */}
                <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border self-start">
                    {tabs.map((tab) => {
                        const isActive = status === tab.value
                        return (
                            <Link
                                key={tab.value}
                                href={buildUrl(1, tab.value, q)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                                    isActive
                                        ? "bg-card text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                        isActive
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
                    action="/admin/berita"
                    method="GET"
                    className="relative flex items-center max-w-xs w-full"
                >
                    {status && <input type="hidden" name="status" value={status} />}
                    <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Cari judul berita..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    />
                </form>
            </div>

            {/* Tabel Daftar Berita */}
            <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold border-b border-border">
                            <tr>
                                <th className="px-4 py-3.5">Berita</th>
                                <th className="px-4 py-3.5">Kategori</th>
                                <th className="px-4 py-3.5">Views</th>
                                <th className="px-4 py-3.5">Tanggal</th>
                                <th className="px-4 py-3.5 text-center">Status</th>
                                <th className="px-4 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {beritaList && beritaList.length > 0 ? (
                                beritaList.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-muted/40 transition-colors group"
                                    >
                                        {/* Cover & Judul */}
                                        <td className="px-4 py-3 max-w-[280px]">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                                                    {item.gambar_url ? (
                                                        <Image
                                                            src={item.gambar_url}
                                                            alt={item.judul}
                                                            fill
                                                            sizes="44px"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            <Newspaper className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p
                                                        className="font-semibold text-foreground truncate group-hover:text-primary transition-colors"
                                                        title={item.judul}
                                                    >
                                                        {item.judul}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground truncate">
                                                        /{item.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kategori */}
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                            <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium border border-border">
                                                {item.kategori_berita?.nama || "Umum"}
                                            </span>
                                        </td>

                                        {/* Views */}
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                {(item.views ?? 0).toLocaleString("id-ID")}
                                            </span>
                                        </td>

                                        {/* Tanggal */}
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                            {item.published_at
                                                ? formatDate(item.published_at)
                                                : item.created_at
                                                  ? formatDate(item.created_at)
                                                  : "-"}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            {item.status === "published" ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border border-zinc-500/20">
                                                    Draft
                                                </span>
                                            )}
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <BeritaRowActions
                                                id={item.id}
                                                slug={item.slug}
                                                status={item.status}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        Tidak ada berita yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Paginasi */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                            Menampilkan halaman <span className="font-semibold text-foreground">{currentPage}</span> dari{" "}
                            <span className="font-semibold text-foreground">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-1.5">
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
```

---

## 3. Status Milestone Proyek

| Milestone | Target | Status Realisasi | Keterangan |
|---|---|---|---|
| M1: Requirement & Setup | 19 Sep 2026 | ✅ Selesai (14 Sep) | Setup Next.js, Supabase, branding |
| M2: Desain & Database Ready | 26 Sep 2026 | ✅ Selesai (16 Sep) | Skema database, seed data, storage |
| M3: Prototype V1 Siap Demo | 10 Okt 2026 | ✅ Selesai (22 Sep) | Tuntas 18 hari lebih cepat dari jadwal |
| M4: Evaluasi Pasca Demo | 17 Okt 2026 | ⏳ Menunggu Demo | Menampung masukan stakeholder |
| **M5: Modul Panel Admin** | **31 Okt 2026** | 🔄 **Dalam Pengerjaan** | **Layout, Dashboard & Modul Berita (`/admin/berita`)** |
| M6: Finalisasi & Serah Terima | 12 Nov 2026 | ⏳ Dijadwalkan | Deployment akhir & dokumentasi |

---

## 4. Rencana Kerja Selanjutnya

1. Pembuatan form **Tambah / Edit Berita** (`/admin/berita/tambah` dan `/admin/berita/[id]/edit`) dengan upload gambar ke Supabase Storage.
2. **Halaman Moderasi Komentar** (`/admin/komentar`): approve / reject komentar publik.
3. Proteksi middleware / role-based route guard untuk seluruh endpoint `/admin/*`.
