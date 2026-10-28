import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { STORAGE_BUCKETS } from "@/lib/constants"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: item, error } = await sb
    .from("ekoran")
    .select("id, file_url, file_name")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !item) {
    return NextResponse.json({ error: "E-Koran tidak ditemukan" }, { status: 404 })
  }

  // Jika file_url adalah path internal storage (bukan full http url)
  let downloadUrl = item.file_url

  if (!item.file_url.startsWith("http://") && !item.file_url.startsWith("https://")) {
    const { data: signedData } = await supabase.storage
      .from(STORAGE_BUCKETS.EKORAN)
      .createSignedUrl(item.file_url, 120)

    if (signedData?.signedUrl) {
      downloadUrl = signedData.signedUrl
    }
  }

  return NextResponse.redirect(downloadUrl)
}
