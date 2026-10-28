"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bell } from "lucide-react"
import Link from "next/link"

export function NotifBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()

    // Initial fetch
    supabase
      .from("komentar")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", false)
      .then(({ count: c }) => setCount(c ?? 0))

    // Realtime subscription ke tabel komentar
    const channel = supabase
      .channel("komentar-notif-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "komentar" },
        async () => {
          const { count: c } = await supabase
            .from("komentar")
            .select("*", { count: "exact", head: true })
            .eq("is_approved", false)
          setCount(c ?? 0)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <Link
      href="/admin/komentar"
      className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer group"
      title={count > 0 ? `${count} komentar pending butuh moderasi` : "Tidak ada komentar pending"}
      aria-label="Notifikasi Komentar"
    >
      <Bell className="w-5 h-5 transition-transform group-hover:scale-105" />
      {count > 0 && (
        <>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-red animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-xs">
            {count > 99 ? "99+" : count}
          </span>
        </>
      )}
    </Link>
  )
}
