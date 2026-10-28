"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { toggleBeritaStatus, deleteBerita, getBeritaForExport } from "./actions"
import { exportToCsv } from "@/lib/export-csv"
import {
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2,
    ExternalLink,
    Printer,
    FileSpreadsheet,
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
            "Apakah anda yakin ingin menghapus berita ini beserta seluruh komentar di dalamnya? Tindakan ini tidak dapat dibatalkan."
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
                    <XCircle className="w-4 h-4"/>
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

export function PrintButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs shadow-xs transition-colors cursor-pointer print:hidden"
            title="Cetak Laporan Rekapitulasi Berita"
        >
            <Printer className="w-4 h-4 text-muted-foreground" />
            <span>Cetak Rekap</span>
        </button>
    )
}

export function ExportBeritaButton() {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        try {
            setIsExporting(true)
            const data = await getBeritaForExport()
            if (!data || data.length === 0) {
                alert("Tidak ada data berita yang dapat diekspor.")
                return
            }

            const headers = [
                "No",
                "Judul Berita",
                "Kategori",
                "Status",
                "Total Pembaca",
                "Ringkasan",
                "Tanggal Terbit",
                "Tanggal Dibuat",
            ]

            const rows = data.map((item: any, index: number) => [
                index + 1,
                item.judul,
                item.kategori_berita?.nama || "Umum",
                item.status === "published" ? "Published" : "Draft",
                item.views ?? 0,
                item.ringkasan || "-",
                item.published_at ? new Date(item.published_at).toLocaleDateString("id-ID") : "-",
                item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-",
            ])

            const today = new Date().toISOString().slice(0, 10)
            exportToCsv(`rekap-rilis-berita-${today}.csv`, headers, rows)
        } catch (err) {
            console.error("Export error:", err)
            alert(err instanceof Error ? err.message : "Gagal mengekspor data berita.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 print:hidden"
            title="Ekspor seluruh data rilis berita ke format Excel / CSV"
        >
            {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <FileSpreadsheet className="w-4 h-4" />
            )}
            <span>{isExporting ? "Mengekspor..." : "Ekspor Excel / CSV"}</span>
        </button>
    )
}
