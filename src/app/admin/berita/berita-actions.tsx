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
            "Apakah anda yakin ingin menghapus berita ini beserta seluruh komentar di dalamanya? Tindakan ini tidak dapat dibatalkan."
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