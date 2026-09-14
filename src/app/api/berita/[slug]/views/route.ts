import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const supabase = await createClient()

    const { error } = await supabase.rpc("increment_berita_views", {
        berita_slug: slug,
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}