"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Setujui komentar pengunjung agar tayang di website publik
 */
export async function approveKomentar(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("komentar")
        .update({ is_approved: true })
        .eq("id", id)
    
    if (error) {
        throw new Error(`Gagal menyetujui komentar: ${error.message}`)
    }

    revalidatePath("/admin/komentar")
    revalidatePath("/admin")
    revalidatePath("/berita")

    return { success: true }
}

/**
 * Batalkan persetujuan / sembunyikan komentar dari website publik
 */
export async function rejectKomentar(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("komentar")
        .update({ is_approved: false })
        .eq("id", id)

    if (error) {
        throw new Error(`Gagal membatalkan persetujuan komentar: ${error.message}`)
    }

    revalidatePath("/admin/komentar")
    revalidatePath("/admin")
    revalidatePath("/berita")

    return { success: true }
}

/**
 * Hapus komentar secara permanen
 */
export async function deleteKomentar(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("komentar")
        .delete()
        .eq("id", id)

    if (error) {
        throw new Error(`Gagal menghapus komentar: ${error.message}`)
    }

    revalidatePath("/admin/komentar")
    revalidatePath("/admin")
    revalidatePath("/berita")

    return { success: true }
}