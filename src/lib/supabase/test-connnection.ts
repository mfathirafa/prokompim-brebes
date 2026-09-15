import { createClient } from "./client";

export async function testConnection() {
    const supabase = createClient()

    try {
        const { error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

        if (error) {
            console.log("❌ Koneksi gagal:", error.message)
            return false
        }

        console.log("✅ Koneksi berhasil!")
        return true
    } catch (err) {
        console.log("❌ Error:", err)
        return false
    }
}