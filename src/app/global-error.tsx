"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Root Layout Error:", error)
  }, [error])

  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-sans p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 text-center shadow-lg space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Kesalahan Sistem Kritis
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Portal mengalami kendala saat memuat tata letak aplikasi. Silakan tekan tombol di bawah untuk mencoba memuat ulang.
            </p>
          </div>

          {error?.message && (
            <div className="text-left bg-zinc-100 dark:bg-zinc-800/80 rounded-xl p-3 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 break-all">
              {error.message}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
