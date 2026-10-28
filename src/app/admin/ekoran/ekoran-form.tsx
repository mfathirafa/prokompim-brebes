"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createEkoran, updateEkoran, getEkoranUploadUrl } from "./actions"
import { FileText, Upload, X, Loader2 } from "lucide-react"

interface EkoranData {
  id: string
  judul: string
  edisi: string | null
  tanggal_terbit: string | null
  deskripsi: string | null
  file_url: string
  file_name: string | null
  file_size: number | null
  is_active: boolean
}

interface EkoranFormProps {
  mode: "create" | "edit"
  initialData?: EkoranData
}

export function EkoranForm({ mode, initialData }: EkoranFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [judul, setJudul] = useState(initialData?.judul ?? "")
  const [edisi, setEdisi] = useState(initialData?.edisi ?? "")
  const [tanggalTerbit, setTanggalTerbit] = useState(initialData?.tanggal_terbit ?? "")
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi ?? "")
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [fileUrl, setFileUrl] = useState(initialData?.file_url ?? "")
  const [fileName, setFileName] = useState(initialData?.file_name ?? "")
  const [fileSize, setFileSize] = useState(initialData?.file_size ?? 0)

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith(".pdf") && file.type !== "application/pdf") {
      setError("Hanya file PDF yang diperbolehkan.")
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("Ukuran file maksimal 50 MB.")
      return
    }

    setUploading(true)
    setError("")
    setUploadProgress(10)

    const result = await getEkoranUploadUrl(file.name, file.type)
    if (result.error) {
      setError(result.error)
      setUploading(false)
      return
    }

    try {
      setUploadProgress(40)
      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          setUploadProgress(40 + Math.round((ev.loaded / ev.total) * 50))
        }
      }
      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)))
        xhr.onerror = () => reject(new Error("Network error"))
        xhr.open("PUT", result.signedUrl!)
        xhr.setRequestHeader("Content-Type", file.type)
        xhr.send(file)
      })

      setUploadProgress(100)
      setFileUrl(result.publicUrl!)
      setFileName(file.name)
      setFileSize(file.size)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!judul.trim()) { setError("Judul wajib diisi."); return }
    if (!fileUrl) { setError("File PDF wajib diupload."); return }

    setSaving(true)
    setError("")

    const payload = {
      judul,
      edisi,
      tanggal_terbit: tanggalTerbit,
      deskripsi,
      is_active: isActive,
      file_url: fileUrl,
      file_name: fileName,
      file_size: fileSize,
    }

    const result = mode === "create"
      ? await createEkoran(payload)
      : await updateEkoran(initialData!.id, payload)

    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }

    router.push("/admin/ekoran")
    router.refresh()
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Judul */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Judul *</label>
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="misal: Buletin Prokompim Brebes Edisi Oktober 2026"
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      {/* Edisi & Tanggal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Edisi</label>
          <input
            type="text"
            value={edisi}
            onChange={(e) => setEdisi(e.target.value)}
            placeholder="misal: Vol. 5, No. 10"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Tanggal Terbit</label>
          <input
            type="date"
            value={tanggalTerbit}
            onChange={(e) => setTanggalTerbit(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Deskripsi */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Deskripsi</label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={3}
          placeholder="Deskripsi singkat isi edisi ini..."
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* Upload PDF */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">File PDF *</label>
        {fileUrl ? (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
            <FileText className="w-8 h-8 text-brand-red shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
              {fileSize > 0 && <p className="text-xs text-muted-foreground">{formatBytes(fileSize)}</p>}
            </div>
            <button
              type="button"
              onClick={() => { setFileUrl(""); setFileName(""); setFileSize(0) }}
              className="p-1 rounded text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
          >
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Mengupload... {uploadProgress}%</p>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium text-foreground">Klik untuk upload PDF</p>
                <p className="text-xs text-muted-foreground mt-1">PDF saja, maks. 50 MB</p>
              </>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="w-4 h-4 rounded accent-primary"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-foreground">
          Tampilkan di halaman publik
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow hover:bg-primary/90 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === "create" ? "Simpan Edisi" : "Perbarui Edisi"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
