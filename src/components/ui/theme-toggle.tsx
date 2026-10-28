"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  /** Variant tampilan: 'icon' (hanya ikon), 'pill' (label + ikon) */
  variant?: "icon" | "pill"
}

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hindari hydration mismatch — render hanya setelah mount di client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Placeholder dengan ukuran sama agar tidak ada layout shift
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-lg animate-pulse bg-white/10",
          className
        )}
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  const toggle = () => setTheme(isDark ? "light" : "dark")

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          "bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer",
          className
        )}
        aria-label={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
        title={isDark ? "Mode Terang" : "Mode Gelap"}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5" />
            <span>Terang</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5" />
            <span>Gelap</span>
          </>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
        "text-muted-foreground hover:text-foreground hover:bg-muted",
        className
      )}
      aria-label={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  )
}
