"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { toggleKegiatanStatus, deleteKegiatan } from "./actions"
import {
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2,
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
        const confirmed= window.confirm(
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
