import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Activity Log",
}

// Local type — tabel activity_log belum ada di generated Supabase types
interface ActivityLog {
  id: string
  created_at: string | null
  admin_id: string | null
  admin_email: string | null
  action_type: string
  resource_type: string
  resource_id: string | null
  resource_title: string | null
  metadata: Record<string, unknown> | null
}

const ACTION_LABELS: Record<string, string> = {
  create: "Buat",
  update: "Edit",
  delete: "Hapus",
  publish: "Terbitkan",
  unpublish: "Batalkan Terbit",
  approve: "Setujui",
  reject: "Tolak",
  upload: "Unggah",
  toggle: "Toggle Status",
}

const RESOURCE_LABELS: Record<string, string> = {
  berita: "Berita",
  komentar: "Komentar",
  kegiatan: "Kegiatan",
  download: "Download",
  liputan: "Liputan",
  penghargaan: "Penghargaan",
  users: "Pengguna",
  ekoran: "E-Koran",
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  update: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  delete: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  publish: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  unpublish: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  approve: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  reject: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  upload: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  toggle: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
}

interface PageProps {
  searchParams: Promise<{ action?: string; resource?: string; page?: string }>
}

export default async function ActivityLogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const actionFilter = params.action ?? ""
  const resourceFilter = params.resource ?? ""
  const page = Math.max(1, parseInt(params.page ?? "1", 10))
  const perPage = 20
  const offset = (page - 1) * perPage

  const supabase = await createClient()

  // Gunakan `any` cast karena tabel activity_log belum ada di Supabase generated types.
  // Setelah menjalankan migration SQL, tipe ini bisa di-generate ulang.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  let query = sb
    .from("activity_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1)

  if (actionFilter) query = query.eq("action_type", actionFilter)
  if (resourceFilter) query = query.eq("resource_type", resourceFilter)

  const {
    data: rawLogs,
    count,
    error,
  }: { data: ActivityLog[] | null; count: number | null; error: unknown } =
    await query

  const logs = rawLogs ?? []
  const totalPages = Math.ceil((count ?? 0) / perPage)

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—"
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(new Date(dateStr))
  }

  const buildUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams()
    if (actionFilter) p.set("action", actionFilter)
    if (resourceFilter) p.set("resource", resourceFilter)
    if (page > 1) p.set("page", String(page))
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) p.set(k, v)
      else p.delete(k)
    })
    const str = p.toString()
    return `/admin/activity-log${str ? `?${str}` : ""}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Activity Log</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Riwayat aksi yang dilakukan oleh administrator.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 border border-border rounded-xl">
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Jenis Aksi
          </label>
          <a
            href={buildUrl({ action: "", page: "1" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              !actionFilter
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua Aksi
          </a>
          {Object.entries(ACTION_LABELS).map(([key, label]) => (
            <a
              key={key}
              href={buildUrl({ action: key, page: "1" })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                actionFilter === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Modul
          </label>
          <a
            href={buildUrl({ resource: "", page: "1" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              !resourceFilter
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua Modul
          </a>
          {Object.entries(RESOURCE_LABELS).map(([key, label]) => (
            <a
              key={key}
              href={buildUrl({ resource: key, page: "1" })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                resourceFilter === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Tabel Log */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Tabel <code className="text-xs bg-muted px-1 py-0.5 rounded">activity_log</code> belum tersedia.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Jalankan SQL migration di{" "}
              <code className="bg-muted px-1 py-0.5 rounded">supabase/migrations/20261028_activity_log.sql</code>
              {" "}di Supabase Dashboard terlebih dahulu.
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Belum ada aktivitas yang tercatat.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Waktu
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Admin
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Aksi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Modul
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Resource
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground truncate max-w-[160px]">
                          {log.admin_email ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            ACTION_COLORS[log.action_type] ?? "bg-muted text-muted-foreground"
                          }`}
                        >
                          {ACTION_LABELS[log.action_type] ?? log.action_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-foreground">
                          {RESOURCE_LABELS[log.resource_type] ?? log.resource_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[240px]">
                        {log.resource_title ?? log.resource_id ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-border">
              {logs.map((log) => (
                <div key={log.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        ACTION_COLORS[log.action_type] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ACTION_LABELS[log.action_type] ?? log.action_type}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {RESOURCE_LABELS[log.resource_type] ?? log.resource_type}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">
                    {log.resource_title ?? log.resource_id ?? "—"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground truncate">{log.admin_email ?? "—"}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDate(log.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Halaman {page} dari {totalPages} ({count} entri)
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={buildUrl({ page: String(page - 1) })}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              >
                ← Sebelumnya
              </a>
            )}
            {page < totalPages && (
              <a
                href={buildUrl({ page: String(page + 1) })}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              >
                Berikutnya →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
