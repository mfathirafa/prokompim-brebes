"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function TestDbPage() {
    const [status, setStatus] = useState<string>("Belum test")
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<unknown[] | null>(null)

    const testConnection = async () => {
        setStatus("Testing koneksi...")
        setError(null)
        setData(null)

        try {
            const supabase = createClient()

            // Test 1: Cek apakah bisa connect ke Supabase
            const { error: authError } = await supabase.auth.getUser()

            if (authError && authError.message !== "Auth session missing!") {
                throw new Error(`Auth error: ${authError.message}`)
            }

            // Test 2: Cek apakah tabel profiles ada
            const { data: profiles, error: tableError } = await supabase
                .from("profiles")
                .select("*")
                .limit(5)
            
            if (tableError) {
                if (tableError.message.includes('relation "public.profiles" does not exist')) {
                    setStatus("Koneksi berhasil, tapi tabel belum dibuat")
                    setError("Jalankan SQL Migration dari Planning/erd.md di Supabase SQL Editor")
                } else {
                    throw new Error(`Table error: ${tableError.message}`)
                }
            } else {
                setStatus("Koneksi berhasil & tabel sudah ada")
                setData(profiles)
            }
        } catch (err) {
            setStatus("Koneksi gagal")
            setError(err instanceof Error ? err.message : String(err))
        }
    }

    return (
        <div className="min-h-screen p-8 bg-background">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Test Koneksi Supabase</h1>

                <div className="p-4 border rounded-lg space-y-2">
                    <p><strong>Status:</strong> {status}</p>
                    {error && (
                        <p className="text-red-500 text-sm whitespace-pre-wrap">{error}</p>
                    )}
                </div>

                <button
                    onClick={testConnection}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Test Koneksi
                </button>

                {data && (
                    <div className="p-4 border rounded-lg">
                        <p className="font-semibold mb-2">Data profiles:</p>
                        <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="p-4 border rounded-lg bg-muted">
                    <h2 className="font-semibold mb-2">Langkah selanjutnya</h2>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Buka Supabase Dashboard → SQL Editor</li>
                        <li>Copy SQL dari <code className="bg-background px-1 rounded">Planning/erd.md</code></li>
                        <li>Jalankan SQL untuk membuat tabel</li>
                        <li>Refresh halaman ini dan test ulang</li>
                    </ol>

                </div>
            </div>
        </div>
    )
}