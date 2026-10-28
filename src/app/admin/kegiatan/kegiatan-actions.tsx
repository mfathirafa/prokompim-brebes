"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { toggleKegiatanStatus, deleteKegiatan, getKegiatanForExport } from "./actions"
import { exportToCsv } from "@/lib/export-csv"
import {
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2,
    Printer,
    FileSpreadsheet,
} from "lucide-react"

interface KegiatanRowActionsProps {
    id: string
    isActive: boolean
}

export function KegiatanRowActions({ id, isActive }: KegiatanRowActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [actionType, setActionType] = useState<"toggle" | "delete" | null>(null)

    const handleToggle = () => {
        setActionType("toggle")
        startTransition(async () => {
            try {
                await toggleKegiatanStatus(id, isActive)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengubah status.")
            } finally {
                setActionType(null)
            }
        })
    }

    const handleDelete = () => {
        const confirmed = window.confirm(
            "Apakah anda yakin ingin menghapus agenda kegiatan ini? Tindakan ini tidak dapat dibatalkan."
        )
        if (!confirmed) return

        setActionType("delete")
        startTransition(async () => {
            try {
                await deleteKegiatan(id)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus kegiatan.")
            } finally {
                setActionType(null)
            }
        })
    }

    return (
        <div className="flex items-center justify-end gap-1.5">
            {/* Toggle Status Aktif / Nonaktif */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={isPending}
                title={isActive ? "Nonaktifkan kegiatan" : "Aktifkan kegiatan"}
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
                href={`/admin/kegiatan/${id}/edit`}
                title="Edit kegiatan"
                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </Link>

            {/* Tombol Hapus */}
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                title="Hapus kegiatan"
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

export function PrintAgendaButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs shadow-xs transition-colors cursor-pointer print:hidden"
            title="Cetak Lembar Jadwal Agenda Pimpinan"
        >
            <Printer className="w-4 h-4 text-muted-foreground" />
            <span>Cetak Agenda</span>
        </button>
    )
}

export function ExportKegiatanButton() {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        try {
            setIsExporting(true)
            const data = await getKegiatanForExport()
            if (!data || data.length === 0) {
                alert("Tidak ada data kegiatan yang dapat diekspor.")
                return
            }

            const headers = [
                "No",
                "Judul Kegiatan",
                "Jenis",
                "Lokasi",
                "Pimpinan / Pejabat Terkait",
                "Tanggal Mulai",
                "Tanggal Selesai",
                "Status",
                "Deskripsi",
            ]

            const rows = data.map((item, index) => [
                index + 1,
                item.judul,
                item.jenis,
                item.lokasi || "-",
                item.pimpinan || "-",
                item.tanggal_mulai ? new Date(item.tanggal_mulai).toLocaleDateString("id-ID") : "-",
                item.tanggal_selesai ? new Date(item.tanggal_selesai).toLocaleDateString("id-ID") : "-",
                item.is_active ? "Aktif" : "Nonaktif",
                item.deskripsi || "-",
            ])

            const today = new Date().toISOString().slice(0, 10)
            exportToCsv(`rekap-agenda-kegiatan-${today}.csv`, headers, rows)
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
            title="Ekspor seluruh data agenda ke format Excel / CSV"
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
