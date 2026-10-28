"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error ke konsol client
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo Kabupaten Brebes & Ikon Peringatan */}
        <div className="flex justify-center items-center gap-3">
          <div className="relative p-3 rounded-2xl bg-card border border-border shadow-xs">
            <Image
              src="/logo.png"
              alt="Logo Kabupaten Brebes"
              width={56}
              height={56}
              priority
              className="w-12 h-auto drop-shadow-xs"
            />
          </div>
          <div className="p-3.5 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-xs">
            <AlertTriangle className="w-7 h-7" />
          </div>
        </div>

        {/* Kode & Judul Error */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold tracking-wider uppercase">
            Terjadi Kendala Sistem
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Gagal Memuat Halaman
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Mohon maaf, sistem mengalami gangguan saat memproses data. Silakan muat ulang halaman atau kembali ke beranda portal.
          </p>
        </div>

        {/* Detail Pesan Error (Aman & Berguna untuk Debugging) */}
        {error?.message && (
          <div className="text-left bg-muted/60 border border-border/80 rounded-xl p-3 text-xs text-muted-foreground font-mono break-all">
            <p className="font-semibold text-foreground/80 mb-1 font-sans">Keterangan Teknis:</p>
            <p className="text-[11px] leading-relaxed line-clamp-3">{error.message}</p>
            {error.digest && (
              <p className="text-[10px] text-muted-foreground/70 mt-1">
                Kode Digest: <span className="text-primary">{error.digest}</span>
              </p>
            )}
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs gap-2 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/" />}
            variant="outline"
            className="w-full sm:w-auto border-border hover:bg-muted text-foreground font-semibold rounded-xl text-xs gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </Button>
        </div>

        {/* Tautan Tambahan */}
        <div className="pt-6 border-t border-border/60 text-xs text-muted-foreground">
          <p>
            Jika kendala berlanjut, silakan kembali ke{" "}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" /> Halaman Sebelumnya
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
