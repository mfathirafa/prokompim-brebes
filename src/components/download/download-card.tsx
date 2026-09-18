"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Loader2, Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface DownloadCardProps {
    id: string;
    judul: string;
    deskripsi?: string | null;
    file_name: string;
    file_size?: number | null;
    file_type?: string | null;
    download_count: number;
    tanggal_kegiatan?: string | null;
    kategori?: {
        nama?: string | null;
        slug?: string | null;
        icon?: string | null;
    } | null;
}

function formatFileSize(bytes?: number | null): string {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DownloadCard({
    id,
    judul,
    deskripsi,
    file_name,
    file_size,
    file_type,
    download_count,
    tanggal_kegiatan,
    kategori,
}: DownloadCardProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownload = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/download/${id}/count`, {
                method: "POST",
            });
            if (res.status === 401) {
                setError("Silahkan login terlebih dahulu untuk mengunduh dokumen.");
                setLoading(false);
                return;
            }
            if (!res.ok) {
                const json = await res.json();
                setError(json?.error || "Gagal membuat link unduhan.");
                setLoading(false);
                return;
            }
            const { url } = await res.json();
            // Buka signed URL di tab baru agar browser trigger download
            window.open(url, "_blank", "noopener,noreferrer");
        } catch {
            setError("Terjadi kesalahan. Coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    const ext = file_type?.toUpperCase() ?? file_name.split(".").pop()?.toUpperCase() ?? "FILE";

    return (
        <div className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header warna */}
            <div className="flex items-center gap-3 px-5 py-4 bg-primary/5 border-b border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                        {kategori?.nama ?? "Dokumen"}
                    </span>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                        {file_name}
                    </p>
                </div>
                <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase">
                    {ext}
                </span>
            </div>

            {/* Konten */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {judul}
                </h3>
                {deskripsi && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {deskripsi}
                    </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2">
                    {tanggal_kegiatan && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-sky" />
                            {formatDate(tanggal_kegiatan)}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {download_count} unduhan
                    </span>
                    <span className="ml-auto font-medium text-muted-foreground">
                        {formatFileSize(file_size)}
                    </span>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Tombol Download */}
                <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-semibold text-sm transition-colors cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Menyiapkan...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            <span>Unduh Dokumen</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}