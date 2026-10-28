import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import Link from "next/link"
import { Newspaper, Plus, Pencil, Eye, EyeOff, Trash2 } from "lucide-react"
import { EkoranActions } from "./ekoran-actions"

export const metadata: Metadata = { title: "Manajemen E-Koran" }

interface Ekoran {
  id: string
  judul: string
  edisi: string | null
  tanggal_terbit: string | null
  file_name: string | null
  file_size: number | null
  is_active: boolean
  created_at: string | null
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "-"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(d: string | null) {
  if (!d) return "-"
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d))
}

export default async function AdminEkoranPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: list } = await sb
    .from("ekoran")
    .select("id, judul, edisi, tanggal_terbit, file_name, file_size, is_active, created_at")
    .order("tanggal_terbit", { ascending: false })

  const ekoran: Ekoran[] = list ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Manajemen E-Koran</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola publikasi koran digital dan majalah Prokompim Brebes.
          </p>
        </div>
        <Link
          href="/admin/ekoran/tambah"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Edisi
        </Link>
      </div>

      {/* Tabel */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {ekoran.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-center">
            <Newspaper className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">Belum ada edisi e-koran.</p>
            <p className="text-xs text-muted-foreground">
              Jalankan{" "}
              <code className="bg-muted px-1 rounded text-[11px]">supabase/migrations/20261028_ekoran.sql</code>{" "}
              di Supabase Dashboard terlebih dahulu.
            </p>
            <Link
              href="/admin/ekoran/tambah"
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Edisi Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Judul / Edisi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal Terbit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">File</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dibuat</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ekoran.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground text-sm truncate max-w-[220px]">{item.judul}</p>
                      {item.edisi && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.edisi}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(item.tanggal_terbit)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <p className="truncate max-w-[160px]">{item.file_name ?? "-"}</p>
                      <p className="text-[11px]">{formatBytes(item.file_size)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.is_active
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {item.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/ekoran/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <EkoranActions id={item.id} isActive={item.is_active} judul={item.judul} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
