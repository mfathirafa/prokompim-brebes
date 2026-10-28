"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/log-activity"

/**
 * Toggle status aktif/nonaktif kegiatan
 */
export async function toggleKegiatanStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient()
    const nextStatus = !currentStatus

    const { data: kegiatanData } = await supabase
        .from("kegiatan")
        .select("judul")
        .eq("id", id)
        .single()

    const { error } = await supabase
        .from("kegiatan")
        .update({
            is_active: nextStatus,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)

    if (error) {
        throw new Error(`Gagal mengubah status kegiatan: ${error.message}`)
    }

    await logActivity({
        supabase,
        actionType: "toggle",
        resourceType: "kegiatan",
        resourceId: id,
        resourceTitle: kegiatanData?.judul,
        detail: { is_active: nextStatus },
    })

    revalidatePath("/admin/kegiatan")
    revalidatePath("/kegiatan")
    revalidatePath("/")

    return { success: true, is_active: nextStatus }
}

/**
 * Hapus data kegiatan berdasarkan ID
 */
export async function deleteKegiatan(id: string) {
    const supabase = await createClient()

    const { data: kegiatanData } = await supabase
        .from("kegiatan")
        .select("judul")
        .eq("id", id)
        .single()

    const { error } = await supabase
        .from("kegiatan")
        .delete()
        .eq("id", id)

    if (error) {
        throw new Error(`Gagal menghapus kegiatan: ${error.message}`)
    }

    await logActivity({
        supabase,
        actionType: "delete",
        resourceType: "kegiatan",
        resourceId: id,
        resourceTitle: kegiatanData?.judul,
    })

    revalidatePath("/admin/kegiatan")
    revalidatePath("/kegiatan")
    revalidatePath("/")

    return { success: true }
}

/**
 * Server action: Tambah kegiatan baru
 */
export async function createKegiatan(formData: FormData) {
    const supabase = await createClient()

    const judul = (formData.get("judul") as string)?.trim()
    const jenis = (formData.get("jenis") as string) || "kegiatan"
    const lokasi = (formData.get("lokasi") as string)?.trim() || null
    const pimpinan = (formData.get("pimpinan") as string)?.trim() || null
    const tanggal_mulai = formData.get("tanggal_mulai") as string
    const tanggal_selesai = (formData.get("tanggal_selesai") as string) || null
    const deskripsi = (formData.get("deskripsi") as string)?.trim() || null
    const is_active = formData.get("is_active") === "true"

    if (!judul) {
        throw new Error("Judul kegiatan wajib diisi.")
    }
    if (!tanggal_mulai) {
        throw new Error("Tanggal mulai kegiatan wajib diisi.")
    }

    const { error } = await supabase.from("kegiatan").insert({
        judul,
        jenis,
        lokasi,
        pimpinan,
        tanggal_mulai,
        tanggal_selesai: tanggal_selesai || null,
        deskripsi,
        is_active,
    })

    if (error) {
        throw new Error(`Gagal menambahkan kegiatan: ${error.message}`)
    }

    await logActivity({
        supabase,
        actionType: "create",
        resourceType: "kegiatan",
        resourceTitle: judul,
        detail: { jenis, tanggal_mulai },
    })

    revalidatePath("/admin/kegiatan")
    revalidatePath("/kegiatan")
    revalidatePath("/")

    return { success: true }
}

/**
 * Server action: Update kegiatan eksisting
 */
export async function updateKegiatan(id: string, formData: FormData) {
    const supabase = await createClient()

    const judul = (formData.get("judul") as string)?.trim()
    const jenis = (formData.get("jenis") as string) || "kegiatan"
    const lokasi = (formData.get("lokasi") as string)?.trim() || null
    const pimpinan = (formData.get("pimpinan") as string)?.trim() || null
    const tanggal_mulai = formData.get("tanggal_mulai") as string
    const tanggal_selesai = (formData.get("tanggal_selesai") as string) || null
    const deskripsi = (formData.get("deskripsi") as string)?.trim() || null
    const is_active = formData.get("is_active") === "true"

    if (!judul) {
        throw new Error("Judul kegiatan wajib diisi.")
    }
    if (!tanggal_mulai) {
        throw new Error("Tanggal mulai kegiatan wajib diisi.")
    }

    const { error } = await supabase
        .from("kegiatan")
        .update({
            judul,
            jenis,
            lokasi,
            pimpinan,
            tanggal_mulai,
            tanggal_selesai: tanggal_selesai || null,
            deskripsi,
            is_active,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)

    if (error) {
        throw new Error(`Gagal memperbarui kegiatan: ${error.message}`)
    }

    await logActivity({
        supabase,
        actionType: "update",
        resourceType: "kegiatan",
        resourceId: id,
        resourceTitle: judul,
    })

    revalidatePath("/admin/kegiatan")
    revalidatePath("/kegiatan")
    revalidatePath("/")

    return { success: true }
}


/**
 * Server action: Ambil seluruh data kegiatan untuk ekspor Excel / CSV
 */
export async function getKegiatanForExport() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("kegiatan")
        .select("judul, jenis, lokasi, pimpinan, tanggal_mulai, tanggal_selesai, deskripsi, is_active, created_at")
        .order("tanggal_mulai", { ascending: false })

    if (error) {
        throw new Error(`Gagal memuat data ekspor: ${error.message}`)
    }

    return data || []
}
