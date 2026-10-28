import { FileText, Calendar, Download, ExternalLink, BookOpen } from "lucide-react"
import { formatDate } from "@/lib/utils"

export interface EkoranCardProps {
  id: string
  judul: string
  edisi?: string | null
  deskripsi?: string | null
  tanggal_terbit?: string | null
  file_url: string
  file_name?: string | null
  file_size?: number | null
  thumbnail_url?: string | null
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "-"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function EkoranCard({
  id,
  judul,
  edisi,
  deskripsi,
  tanggal_terbit,
  file_url,
  file_name,
  file_size,
  thumbnail_url,
}: EkoranCardProps) {
  // Gunakan API route redirect agar file terlindungi jika storage bersifat private
  const downloadHref = `/api/ekoran/${id}/download`

  return (
    <div className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Cover / Header */}
      <div className="relative h-44 sm:h-48 bg-gradient-to-br from-primary/15 via-primary/5 to-brand-sky/10 flex items-center justify-center p-6 border-b border-border overflow-hidden">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={judul}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">
              E-Paper Resmi
            </span>
          </div>
        )}

        {edisi && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-background/90 backdrop-blur-md text-foreground border border-border shadow-xs">
            {edisi}
          </span>
        )}
      </div>

      {/* Konten */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {tanggal_terbit && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{formatDate(tanggal_terbit)}</span>
            </div>
          )}

          <h3 className="font-bold text-foreground text-base line-clamp-2 group-hover:text-primary transition-colors">
            {judul}
          </h3>

          {deskripsi && (
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {deskripsi}
            </p>
          )}
        </div>

        {/* Footer Card */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <FileText className="w-3.5 h-3.5" />
            <span>PDF • {formatFileSize(file_size)}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/90 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
