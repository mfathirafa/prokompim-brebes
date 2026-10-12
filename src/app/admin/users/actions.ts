"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Validasi hak akses admin sebelum menjalankan operasi
 */
async function verifyAdminAuth() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Sesi tidak valid. Silakan login kembali.")
    }

    const role = user.app_metadata?.role || user.user_metadata?.role
    if (role !== "admin") {
        throw new Error("Akses ditolak. Anda tidak memiliki izin administrator.")
    }

    return user
}

/**
 * Toggle status aktif / nonaktif akun pengguna
 */
export async function toggleUserStatus(userId: string, currentStatus: boolean) {
    const currentUser = await verifyAdminAuth()

    if (currentUser.id === userId) {
        throw new Error("Anda tidak dapat mengubah status akun Anda sendiri.")
    }

    const adminClient = createAdminClient()

    // Cek apakah target pengguna adalah superadmin utama
    const { data: targetProfile } = await adminClient
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single()

    if (targetProfile?.email === "admin@prokompim-brebes.go.id") {
        throw new Error("Status akun Super Administrator utama tidak dapat dinonaktifkan.")
    }

    const nextStatus = !currentStatus

    const { error } = await adminClient
        .from("profiles")
        .update({
            is_active: nextStatus,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

    if (error) {
        throw new Error(`Gagal mengubah status pengguna: ${error.message}`)
    }

    revalidatePath("/admin/users")
    revalidatePath("/admin")

    return { success: true, is_active: nextStatus }
}

/**
 * Ubah peran (role) pengguna antara 'admin' atau 'member'
 */
export async function updateUserRole(userId: string, newRole: "admin" | "member") {
    const currentUser = await verifyAdminAuth()

    if (currentUser.id === userId) {
        throw new Error("Anda tidak dapat mengubah role akun Anda sendiri.")
    }

    const adminClient = createAdminClient()

    const { data: targetProfile } = await adminClient
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single()

    if (targetProfile?.email === "admin@prokompim-brebes.go.id" && newRole !== "admin") {
        throw new Error("Role Super Administrator utama tidak dapat diubah menjadi member.")
    }

    // 1. Update tabel public.profiles
    const { error: profileError } = await adminClient
        .from("profiles")
        .update({
            role: newRole,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

    if (profileError) {
        throw new Error(`Gagal memperbarui role di database: ${profileError.message}`)
    }

    // 2. Sinkronkan ke Supabase Auth app_metadata (agar instan dikenali middleware & JWT)
    try {
        await adminClient.auth.admin.updateUserById(userId, {
            app_metadata: { role: newRole },
        })
    } catch (authError) {
        console.warn("Peringatan sinkronisasi auth metadata:", authError)
    }

    revalidatePath("/admin/users")
    revalidatePath("/admin")
    revalidatePath("/")

    return { success: true, role: newRole }
}

/**
 * Hapus pengguna secara permanen
 */
export async function deleteUser(userId: string) {
    const currentUser = await verifyAdminAuth()

    if (currentUser.id === userId) {
        throw new Error("Anda tidak dapat menghapus akun Anda sendiri.")
    }

    const adminClient = createAdminClient()

    const { data: targetProfile } = await adminClient
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single()

    if (targetProfile?.email === "admin@prokompim-brebes.go.id") {
        throw new Error("Akun Super Administrator utama tidak dapat dihapus.")
    }

    // 1. Hapus dari tabel public.profiles
    const { error: profileError } = await adminClient
        .from("profiles")
        .delete()
        .eq("id", userId)

    if (profileError) {
        throw new Error(`Gagal menghapus profil pengguna: ${profileError.message}`)
    }

    // 2. Hapus dari auth.users via Supabase Admin API
    try {
        await adminClient.auth.admin.deleteUser(userId)
    } catch (authError) {
        console.warn("Peringatan penghapusan user auth:", authError)
    }

    revalidatePath("/admin/users")
    revalidatePath("/admin")

    return { success: true }
}
