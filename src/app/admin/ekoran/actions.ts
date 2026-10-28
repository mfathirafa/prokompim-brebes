"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/log-activity"

// ─── Types ───────────────────────────────────────────────
interface EkoranFormData {
  judul: string
  edisi: string
  tanggal_terbit: string
  deskripsi: string
  is_active: boolean
  file_url: string
  file_name: string
  file_size: number
  thumbnail_url?: string
}

// ─── CREATE ──────────────────────────────────────────────
export async function createEkoran(formData: EkoranFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Tidak terautentikasi" }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data, error } = await sb
    .from("ekoran")
    .insert({
      judul: formData.judul.trim(),
      edisi: formData.edisi.trim() || null,
      tanggal_terbit: formData.tanggal_terbit || null,
      deskripsi: formData.deskripsi.trim() || null,
      is_active: formData.is_active,
      file_url: formData.file_url,
      file_name: formData.file_name,
      file_size: formData.file_size || null,
      thumbnail_url: formData.thumbnail_url || null,
    })
    .select("id")
    .single()

  if (error) return { error: (error as { message: string }).message }

  await logActivity({
    supabase,
    actionType: "create",
    resourceType: "ekoran",
    resourceId: data.id,
    resourceTitle: formData.judul,
  })

  revalidatePath("/admin/ekoran")
  revalidatePath("/e-koran")
  return { success: true, id: data.id }
}

// ─── UPDATE ──────────────────────────────────────────────
export async function updateEkoran(id: string, formData: Partial<EkoranFormData>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Tidak terautentikasi" }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { error } = await sb
    .from("ekoran")
    .update({
      judul: formData.judul?.trim(),
      edisi: formData.edisi?.trim() || null,
      tanggal_terbit: formData.tanggal_terbit || null,
      deskripsi: formData.deskripsi?.trim() || null,
      is_active: formData.is_active,
      file_url: formData.file_url,
      file_name: formData.file_name,
      file_size: formData.file_size || null,
      thumbnail_url: formData.thumbnail_url || null,
    })
    .eq("id", id)

  if (error) return { error: (error as { message: string }).message }

  await logActivity({
    supabase,
    actionType: "update",
    resourceType: "ekoran",
    resourceId: id,
    resourceTitle: formData.judul,
  })

  revalidatePath("/admin/ekoran")
  revalidatePath("/e-koran")
  return { success: true }
}

// ─── DELETE ──────────────────────────────────────────────
export async function deleteEkoran(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Tidak terautentikasi" }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  // Get info dulu untuk log
  const { data: ekoran } = await sb
    .from("ekoran")
    .select("judul")
    .eq("id", id)
    .single()

  const { error } = await sb.from("ekoran").delete().eq("id", id)
  if (error) return { error: (error as { message: string }).message }

  await logActivity({
    supabase,
    actionType: "delete",
    resourceType: "ekoran",
    resourceId: id,
    resourceTitle: (ekoran as { judul?: string } | null)?.judul,
  })

  revalidatePath("/admin/ekoran")
  revalidatePath("/e-koran")
  return { success: true }
}

// ─── TOGGLE ACTIVE ───────────────────────────────────────
export async function toggleEkoranActive(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Tidak terautentikasi" }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { error } = await sb
    .from("ekoran")
    .update({ is_active })
    .eq("id", id)

  if (error) return { error: (error as { message: string }).message }

  await logActivity({
    supabase,
    actionType: "toggle",
    resourceType: "ekoran",
    resourceId: id,
  })

  revalidatePath("/admin/ekoran")
  revalidatePath("/e-koran")
  return { success: true }
}

// ─── GET UPLOAD SIGNED URL ───────────────────────────────
export async function getEkoranUploadUrl(fileName: string, contentType: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Tidak terautentikasi" }

  const path = `${Date.now()}-${fileName.replace(/\s+/g, "_")}`
  const { data, error } = await supabase.storage
    .from("ekoran-files")
    .createSignedUploadUrl(path)

  if (error) return { error: error.message }

  const publicUrl = supabase.storage.from("ekoran-files").getPublicUrl(path).data.publicUrl

  return { signedUrl: data.signedUrl, path, publicUrl }
}
