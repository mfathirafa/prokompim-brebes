import type { SupabaseClient } from "@supabase/supabase-js"

export type ActionType =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "unpublish"
  | "approve"
  | "reject"
  | "upload"
  | "toggle"

export type ResourceType =
  | "berita"
  | "komentar"
  | "kegiatan"
  | "download"
  | "liputan"
  | "penghargaan"
  | "users"
  | "ekoran"

export interface LogActivityParams {
  supabase: SupabaseClient
  actionType: ActionType
  resourceType: ResourceType
  resourceId?: string | number
  resourceTitle?: string
  detail?: Record<string, unknown>
}

/**
 * Catat aksi admin ke tabel activity_log.
 * Dipanggil di server actions setelah operasi berhasil.
 * Tidak melempar error — failure di log tidak boleh mengganggu aksi utama.
 */
export async function logActivity({
  supabase,
  actionType,
  resourceType,
  resourceId,
  resourceTitle,
  detail,
}: LogActivityParams): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("activity_log").insert({
      admin_id: user.id,
      admin_email: user.email ?? null,
      action_type: actionType,
      resource_type: resourceType,
      resource_id: resourceId != null ? String(resourceId) : null,
      resource_title: resourceTitle ?? null,
      detail: detail ?? null,
    })
  } catch {
    // Sengaja diabaikan — log failure tidak boleh merusak alur utama
    console.warn("[logActivity] Gagal menyimpan activity log")
  }
}
