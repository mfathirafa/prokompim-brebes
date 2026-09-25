"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Toggle status publikasi berita antara 'published' <-> 'draft'
 */
export async function toggleBeritaStatus(id: string, currentStatus: string) {
    const supabase = await createClient()
    const nextStatus = currentStatus === "published" ? "draft" : "published"

    const updatePayload: { status: string; published_at?: string | null } = {
        status: nextStatus,
    }

    if (nextStatus === "published") {
        updatePayload.published_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from("berita")
        .update(updatePayload)
        .eq("id", id)
    
    if (error) {
        throw new Error(`Gagal mengubah status berita: ${error.message}`)
    }

    revalidatePath("/admin/berita")
    revalidatePath("/admin")
    revalidatePath("/berita")
    revalidatePath("/")

    return { success: true, status: nextStatus }
}

/**
 * Hapus beria beserta relasi komentar terkait
 */
export async function deleteBerita(id: string) {
    const supabase = await createClient()

    // 1. Hapus komentar terkait terlebih dahulu untuk menjaga integritas data
    await supabase.from("komentar").delete().eq("berita_id", id)

    // 2. Hapus data berita utama
    const { error } = await supabase.from("berita").delete().eq("id", id)

    if (error) {
        throw new Error(`Gagal menghapus berita: ${error.message}`)
    }

    revalidatePath("/admin/berita")
    revalidatePath("/admin")
    revalidatePath("/berita")
    revalidatePath("/")

    return { success: true }
}