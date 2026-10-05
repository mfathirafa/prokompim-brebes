"use client"

import { useState, useTransition } from "react"
import { approveKomentar, rejectKomentar, deleteKomentar } from "./actions"
import { CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react"

interface KomentarRowActionsProps {
    id: string
    isApproved: boolean
}

export function KomentarRowActions({ id, isApproved }: KomentarRowActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [actionType, setActionType] = useState<"toggle" | "delete" | null>(null)

    const handleToggle = () => {
        setActionType("toggle")
        startTransition(async () => {
            try {
                if (isApproved) {
                    await rejectKomentar(id)
                } else {
                    await approveKomentar(id)
                }
            } catch (err) {
                alert(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses status komentar.")
            } finally {
                setActionType(null)
            }
        })
    }

    const handleDelete = () => {
        const confirmed = window.confirm(
            "Apakah anda yakin ingin menghapus komentar ini secara permanen? Tindakan ini tidak dapat dibatalkan."
        )
        if (!confirmed) return

        setActionType("delete")
        startTransition(async () => {
            try {
                await deleteKomentar(id)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus komentar.")
            } finally {
                setActionType(null)
            }
        })
    }

    return (
        <div className="flex items-center justify-end gap-1.5">
            {/* Tombol Setujui / Batalkan Persetujuan */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={isPending}
                title={isApproved ? "Batalkan Persetujuan (Sembunyikan)" : "Setujui Komentar (Tayangkan)"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                    isApproved
                        ? "text-amber-600 hover:bg-amber-500/10"
                        : "text-emerald-600 hover:bg-emerald-500/10"
                }`}
            >
                {isPending && actionType === "toggle" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ): isApproved ? (
                    <XCircle className="w-4 h-4" />
                ) : (
                    <CheckCircle2 className="w-4 h-4" />
                )}
            </button>

            {/* Tombol Hapus */}
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                title="Hapus Komentar"
                className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
            >
                {isPending && actionType === "delete" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-destructive"/>
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>
        </div>
    )
}