import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

/**
 * Supabase Admin Client dengan Service Role Key.
 * Digunakan secara eksklusif di server-side untuk operasi administratif
 * yang membutuhkan bypass RLS (seperti manajemen pengguna & sinkronisasi metadata auth).
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
