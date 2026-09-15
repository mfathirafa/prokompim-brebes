import { SupabaseClient } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Gabungkan class Tailwind (standar shadcn)
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format tanggal -> "17 Agustus 2026"
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date))
}

// Format tanggal pendek -> "17 Agt 2026"
export function formatDateShort(date: string | Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date))
}

// Format jam -> "09.30"
export function formatTime(date: string | Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date))
}

// Format ukuran file -> "1.2 MB"
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Format jumlah views -> "1.2k" atau "987"
export function formatViews(count: number): string {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
    return count.toString()
}

// Generate slug dari teks
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

// Truncate teks dengan ellipsis
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
}

// Signed URL untuk download file dari Supabase Storage (private bucket)
export async function getSignedDownloadUrl(
    supabase: SupabaseClient,
    bucket: string,
    filePath: string,
    expiresIn = 60
): Promise<string | null> {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn)

    if ( error || !data ) return null
    return data.signedUrl
}