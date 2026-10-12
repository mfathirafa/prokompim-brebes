"use client"

import { useState, useTransition } from "react"
import { toggleUserStatus, updateUserRole, deleteUser } from "./actions"
import {
    CheckCircle2,
    XCircle,
    Shield,
    User as UserIcon,
    Trash2,
    Loader2,
} from "lucide-react"

interface UserRowActionsProps {
    id: string
    email: string
    nama: string
    role: string
    isActive: boolean
    isCurrent: boolean
}

export function UserRowActions({
    id,
    email,
    nama,
    role,
    isActive,
    isCurrent,
}: UserRowActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [actionType, setActionType] = useState<"toggle" | "role" | "delete" | null>(null)

    const isPrimaryAdmin = email === "admin@prokompim-brebes.go.id"
    const isProtected = isCurrent || isPrimaryAdmin

    // Handler toggle status aktif/nonaktif
    const handleToggleStatus = () => {
        if (isProtected) {
            alert(
                isPrimaryAdmin
                    ? "Status Super Administrator utama tidak dapat diubah."
                    : "Anda tidak dapat menonaktifkan akun yang sedang digunakan."
            )
            return
        }

        const confirmMsg = isActive
            ? `Apakah Anda yakin ingin MENONAKTIFKAN akun pengguna "${nama}" (${email})? Pengguna ini tidak akan bisa login.`
            : `Apakah Anda yakin ingin MENGAKTIFKAN kembali akun pengguna "${nama}" (${email})?`

        if (!window.confirm(confirmMsg)) return

        setActionType("toggle")
        startTransition(async () => {
            try {
                await toggleUserStatus(id, isActive)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Gagal memperbarui status pengguna.")
            } finally {
                setActionType(null)
            }
        })
    }

    // Handler ubah role (Admin <-> Member)
    const handleRoleChange = () => {
        if (isProtected) {
            alert(
                isPrimaryAdmin
                    ? "Role Super Administrator utama tidak dapat diubah."
                    : "Anda tidak dapat mengubah role akun yang sedang digunakan."
            )
            return
        }

        const nextRole = role === "admin" ? "member" : "admin"
        const confirmMsg =
            nextRole === "admin"
                ? `Angkat "${nama}" (${email}) menjadi ADMINISTRATOR? Pengguna ini akan memiliki akses penuh ke Dashboard & Panel Admin.`
                : `Turunkan "${nama}" (${email}) menjadi MEMBER? Akses ke Panel Admin akan dicabut.`

        if (!window.confirm(confirmMsg)) return

        setActionType("role")
        startTransition(async () => {
            try {
                await updateUserRole(id, nextRole)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Gagal mengubah role pengguna.")
            } finally {
                setActionType(null)
            }
        })
    }

    // Handler hapus user permanen
    const handleDelete = () => {
        if (isProtected) {
            alert(
                isPrimaryAdmin
                    ? "Akun Super Administrator utama tidak dapat dihapus."
                    : "Anda tidak dapat menghapus akun Anda sendiri."
            )
            return
        }

        const confirmMsg = `PERINGATAN: Apakah Anda yakin ingin MENGHAPUS PERMANEN akun pengguna "${nama}" (${email})? Tindakan ini tidak dapat dibatalkan.`
        if (!window.confirm(confirmMsg)) return

        setActionType("delete")
        startTransition(async () => {
            try {
                await deleteUser(id)
            } catch (err) {
                alert(err instanceof Error ? err.message : "Gagal menghapus pengguna.")
            } finally {
                setActionType(null)
            }
        })
    }

    if (isProtected) {
        return (
            <div className="flex items-center justify-end">
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {isPrimaryAdmin ? "Super Admin" : "Akun Anda"}
                </span>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-end gap-1.5">
            {/* Tombol Ubah Role */}
            <button
                type="button"
                onClick={handleRoleChange}
                disabled={isPending}
                title={
                    role === "admin"
                        ? "Ubah peran menjadi Member biasa"
                        : "Promosikan menjadi Administrator"
                }
                className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                    role === "admin"
                        ? "text-blue-600 hover:bg-blue-500/10"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-500/10"
                }`}
            >
                {isPending && actionType === "role" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : role === "admin" ? (
                    <Shield className="w-4 h-4" />
                ) : (
                    <UserIcon className="w-4 h-4" />
                )}
            </button>

            {/* Tombol Toggle Status Aktif / Nonaktif */}
            <button
                type="button"
                onClick={handleToggleStatus}
                disabled={isPending}
                title={isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                    isActive
                        ? "text-amber-600 hover:bg-amber-500/10"
                        : "text-emerald-600 hover:bg-emerald-500/10"
                }`}
            >
                {isPending && actionType === "toggle" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : isActive ? (
                    <XCircle className="w-4 h-4" />
                ) : (
                    <CheckCircle2 className="w-4 h-4" />
                )}
            </button>

            {/* Tombol Hapus Akun */}
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                title="Hapus Akun Pengguna"
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
