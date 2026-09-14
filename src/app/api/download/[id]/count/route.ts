import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { error } from "console";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    // Cek otentikasi
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthotized" }, { status: 401 })
    }

    // Ambil detail file
    const { data: file, error: fileError } = await supabase
        .from("files_download")
        .select("id, file_url, file_type, kategori_id")
        .eq("id", id)
        .eq("is_active", true)
        .single()

    if (fileError || !file) {
        return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 })
    }

    const bucket = STORAGE_BUCKETS.DOWNLOAD

    // Buat signed URL (berlaku 60 detik)
    const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(file.file_url, 60) 

    if (signedError || !signedData) {
        return NextResponse.json(
            { error: "Gagal membuat URL download" },
            { status: 500 }
        )
    }

    // Increment download counter
    await supabase.rpc("increment_download_count", { target_file_id: id })

    return NextResponse.json({ url: signedData.signedUrl })
}