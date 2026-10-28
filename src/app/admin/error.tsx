"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin Panel Error:", error)
  }, [error])

  return (
    <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Gagal Memuat Modul Admin
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Terjadi kesalahan saat memuat data modul panel administrasi. Silakan muat ulang atau kembali ke dashboard.
          </p>
        </div>

        {error?.message && (
          <div className="text-left bg-muted/60 border border-border/80 rounded-xl p-3 text-[11px] font-mono text-muted-foreground break-all">
            <span className="font-semibold text-foreground/80 font-sans block mb-1">Pesan Kesalahan:</span>
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted text-foreground font-semibold text-xs transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
