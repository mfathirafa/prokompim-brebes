"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { toggleDownloadStatus, deleteDownload, getAdminDownloadUrl, getDownloadsForExport } from "./actions"
import { exportToCsv } from "@/lib/export-csv"
import { formatFileSize } from "@/lib/utils"
import {
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2,
    FileDown,
    Printer,
    FileSpreadsheet,
} from "lucide-react"

interface DownloadRowActionsProps {
    id: string
    isActive: boolean
}

export function DownloadRowActions({ id, isActive }: DownloadRowActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [actionType, setActionType] = useState<"toggle" | "delete" | "preview" | null>(null)

    const handlePreviewDownload = async () => {
        setActionType("preview")
        try {
            const { url } = await getAdminDownloadUrl(id)
            window.open(url, "_blank", "noopener,noreferrer")
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal mengunduh file.")
        } finally {
            setActionType(null)
        }
    }

    const handleToggle = () => {
        setActionType("toggle")
        startTransition(async () => {
            try {
                await toggleDownloadStatus(id, isActive)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengubah status.")
            } finally {
                setActionType(null)
            }
        })
    }

    const handleDelete = () => {
        const confirmed = window.confirm(
            "Apakah Anda yakin ingin menghapus dokumen ini beserta file fisiknya di storage? Tindakan ini permanen."
        )
        if (!confirmed) return

        setActionType("delete")
        startTransition(async () => {
            try {
                await deleteDownload(id)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus dokumen.")
            } finally {
                setActionType(null)
            }
        })
    }

    return (
        <div className="flex items-center justify-end gap-1.5">
            {/* Pratinjau / Unduh File */}
            <button
                type="button"
                onClick={handlePreviewDownload}
                disabled={isPending || actionType === "preview"}
                title="Unduh / Pratinjau File"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
                {actionType === "preview" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                    <FileDown className="w-4 h-4" />
                )}
            </button>

            {/* Toggle Status Aktif / Nonaktif */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={isPending}
                title={isActive ? "Nonaktifkan Dokumen" : "Aktifkan Dokumen"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                    isActive
                        ? "text-emerald-600 hover:bg-emerald-500/10"
                        : "text-amber-600 hover:bg-amber-500/10"
                }`}
            >
                {isPending && actionType === "toggle" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : isActive ? (
                    <CheckCircle2 className="w-4 h-4" />
                ) : (
                    <XCircle className="w-4 h-4" />
                )}
            </button>

            {/* Tombol Edit */}
            <Link
                href={`/admin/download/${id}/edit`}
                title="Edit Dokumen"
                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </Link>

            {/* Tombol Hapus */}
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                title="Hapus Dokumen"
                className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
            >
                {isPending && actionType === "delete" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>
        </div>
    )
}

interface DownloadCategoryFilterProps {
    status?: string
    kategori?: string
    q?: string
    kategoriList?: { id: number; nama: string }[] | null
}

export function DownloadCategoryFilter({
    status = "",
    kategori = "",
    q = "",
    kategoriList = [],
}: DownloadCategoryFilterProps) {
    return (
        <form method="GET" action="/admin/download" className="w-full sm:w-auto">
            {status && <input type="hidden" name="status" value={status} />}
            {q && <input type="hidden" name="q" value={q} />}
            <select
                name="kategori"
                defaultValue={kategori}
                onChange={(e) => {
                    e.target.form?.submit()
                }}
                className="w-full sm:w-44 px-3 py-1.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            >
                <option value="">Semua Kategori</option>
                {kategoriList?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.nama}
                    </option>
                ))}
            </select>
        </form>
    )
}

export function PrintDownloadButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs shadow-xs transition-colors cursor-pointer print:hidden"
            title="Cetak Rekapitulasi Dokumen Unduhan"
        >
            <Printer className="w-4 h-4 text-muted-foreground" />
            <span>Cetak Rekap</span>
        </button>
    )
}

export function ExportDownloadButton() {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        try {
            setIsExporting(true)
            const data = await getDownloadsForExport()
            if (!data || data.length === 0) {
                alert("Tidak ada data dokumen yang dapat diekspor.")
                return
            }

            const headers = [
                "No",
                "Judul Dokumen",
                "Kategori",
                "Nama File",
                "Tipe File",
                "Ukuran File",
                "Jumlah Unduh",
                "Tanggal Kegiatan",
                "Status",
                "Tanggal Unggah",
            ]

            const rows = data.map((item: any, index: number) => [
                index + 1,
                item.judul,
                item.kategori_download?.nama || "-",
                item.file_name || "-",
                item.file_type ? item.file_type.toUpperCase() : "-",
                item.file_size ? formatFileSize(item.file_size) : "-",
                item.download_count ?? 0,
                item.tanggal_kegiatan ? new Date(item.tanggal_kegiatan).toLocaleDateString("id-ID") : "-",
                item.is_active ? "Aktif" : "Nonaktif",
                item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-",
            ])

            const today = new Date().toISOString().slice(0, 10)
            exportToCsv(`rekap-dokumen-unduhan-${today}.csv`, headers, rows)
        } catch (err) {
            console.error("Export error:", err)
            alert(err instanceof Error ? err.message : "Gagal mengekspor data.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 print:hidden"
            title="Ekspor seluruh data dokumen ke format Excel / CSV"
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
