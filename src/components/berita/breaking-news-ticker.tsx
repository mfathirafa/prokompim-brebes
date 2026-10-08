"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface TickerNewsItem {
    id: string
    judul: string
    slug: string
    published_at: string | null
    kategori?: {
        nama: string
    } | null
}

interface BreakingNewsTickerProps {
    items: TickerNewsItem[]
    intervalMs?: number
}

export function BreakingNewsTicker({
    items,
    intervalMs = 5000,
}: BreakingNewsTickerProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isFading, setIsFading] = useState(false)

    const total = items.length

    const handleNext = useCallback(() => {
        if (total <= 1) return
        setIsFading(true)
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % total)
            setIsFading(false)
        }, 200)
    }, [total])

    const handlePrev = useCallback(() => {
        if (total <= 1) return
        setIsFading(true)
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + total) % total)
            setIsFading(false)
        }, 200)
    }, [total])

    // Auto-advance carousel
    useEffect(() => {
        if (total <= 1 || isPaused) return

        const timer = setInterval(() => {
            handleNext()
        }, intervalMs)

        return () => clearInterval(timer)
    }, [total, isPaused, intervalMs, handleNext])

    if (!items || items.length === 0) {
        return null
    }

    const currentItem = items[currentIndex]

    return (
        <aside
            aria-label="Warta Berita Terkini"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="border-y border-border bg-card/90 backdrop-blur-md shadow-xs transition-colors"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
                {/* Badge Indikator Terkini */}
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-red text-white text-xs font-bold uppercase rounded-full shrink-0 shadow-xs tracking-wider">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    <span className="hidden xs:inline">Berita Terkini</span>
                    <span className="xs:hidden">Terkini</span>
                </div>

                {/* Konten Judul Berita yang Bergerak/Berganti */}
                <div className="flex-1 min-w-0 overflow-hidden flex items-center gap-2">
                    {currentItem.kategori?.nama && (
                        <span className="hidden md:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground shrink-0 border border-border">
                            {currentItem.kategori.nama}
                        </span>
                    )}

                    <Link
                        href={`/berita/${currentItem.slug}`}
                        className={`text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-all duration-200 truncate block cursor-pointer ${
                            isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                        }`}
                        title={currentItem.judul}
                    >
                        {currentItem.judul}
                    </Link>
                </div>

                {/* Navigasi & Counter */}
                <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                    <span className="text-[11px] font-medium hidden sm:inline px-1">
                        {currentIndex + 1} / {total}
                    </span>

                    {total > 1 && (
                        <div className="flex items-center gap-0.5">
                            <button
                                type="button"
                                onClick={handlePrev}
                                aria-label="Berita sebelumnya"
                                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                aria-label="Berita selanjutnya"
                                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}
