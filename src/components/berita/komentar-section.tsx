"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
    User,
    Clock,
} from "lucide-react";

export interface KomentarItem {
    id: string;
    nama: string;
    isi: string;
    created_at: string | null;
}

interface KomentarSectionProps {
    beritaId: string;
    komentarList: KomentarItem[];
}

export function KomentarSection({ beritaId, komentarList }: KomentarSectionProps) {
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [isi, setIsi] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validasi input sisi browser
        const trimmedNama = nama.trim();
        const trimmedIsi = isi.trim();
        const trimmedEmail = email.trim();

        if (!trimmedNama) {
            setError("Nama lengkap tidak boleh kosong.");
            return;
        }

        if (trimmedIsi.length < 10) {
            setError("Pesan komentar minimal 10 karakter.");
            return;
        }

        if (trimmedEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                setError("Format alamat email tidak valid.");
                return;
            }
        }

        setLoading(true);

        try {
            const supabase = createClient();
            const { error: insertError } = await supabase.from("komentar").insert({
                berita_id: beritaId,
                nama: trimmedNama,
                email: trimmedEmail || null,
                isi: trimmedIsi,
                is_approved: false,
            });

            if (insertError) {
                setError(
                    insertError.message ||
                        "Gagal mengirim komentar. Silahkan coba lagi nanti."
                );
                setLoading(false);
                return;
            }

            // Berhasil submit komentar
            setSuccessMessage(
                "Komentar berhasil dikirim dan menunggu moderasi admin."
            );
            setNama("");
            setEmail("");
            setIsi("");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat mengirim komentar. Silahkan coba lagi."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="space-y-8" aria-label="Bagian Komentar">
            {/* Header Komentar */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">
                        Komentar ({komentarList.length})
                    </h2>
                </div>
                <span className="text-xs text-muted-foreground">
                    Moderasi aktif
                </span>
            </div>

            {/* List Komentar Aprroved */}
            <div className="space-y-4">
                {komentarList.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-border bg-muted/20 text-muted-foreground text-xs sm:text-sm">
                        Belum ada komentar untuk rilis berita ini. Jadilah yang pertama memberikan komentar!
                    </div>
                ) : (
                    komentarList.map((item) => (
                        <div key={item.id} className="flex gap-3.5 items-start">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20 uppercase">
                                {item.nama ? item.nama.charAt(0) : <User className="w-4 h-4" />}
                            </div>

                            {/* Bubble Komentar */}
                            <div className="flex-1 min-w-0">
                                <div className="bg-muted/40 rounded-2xl rounded-tl-sm p-4 border border-border/60">
                                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                                        <h3 className="font-semibold text-sm text-foreground truncate">
                                            {item.nama}
                                        </h3>
                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {item.created_at
                                                    ? formatDate(item.created_at)
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line break-words">
                                        {item.isi}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Input Komentar */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">
                        Tinggalkan Komentar
                    </h3>
                    <p>
                        Komentar Anda akan ditinjau terlebih dahulu oleh tim admin Prokompim sebelum ditampilkan.
                    </p>
                </div>

                {/* Notifikasi Sukses */}
                {successMessage && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Notifikasi Error */}
                {error && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm leading-relaxed">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Input Nama */}
                        <div className="space-y-1.5">
                            <label 
                                htmlFor="komentar-nama"
                                className="block text-xs font-semibold text-foreground"
                            >
                                Nama Lengkap <span className="text-destructive">*</span>
                            </label>
                            <input 
                                id="komentar-nama"
                                type="text" 
                                placeholder="Nama Anda"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                disabled={loading}
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                            />
                        </div>

                        {/* Input Email */}
                        <div className="space-y-1.5">
                            <label 
                                htmlFor="komentar-email"
                                className="block text-xs font-semibold text-foreground"
                            >
                                Email <span className="text-muted-foreground font-normal">(opsional)</span>
                            </label>
                            <input 
                                id="komentar-email"
                                type="email" 
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Textarea Pesan */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label 
                                htmlFor="komentar-isi"
                                className="block text-xs font-semibold text-foreground"
                            >
                                Komentar <span className="text-destructive">*</span>
                            </label>
                            <span className="text-[11px] text-muted-foreground">
                                Minimal 10 karakter
                            </span>
                        </div>
                        <textarea 
                            id="komentar-isi"
                            rows={4}
                            placeholder="Tulis tanggapan atau komentar Anda mengenai berita ini (minimal 10 karakter)..."
                            value={isi}
                            onChange={(e) => setIsi(e.target.value)}
                            disabled={loading}
                            required
                            minLength={10}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 resize-y min-h-[100px]"
                        />
                    </div>

                    {/* Tombol Kirim */}
                    <div className="flex justify-end pt-1">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Mengirim...</span>
                                </>
                            ) : (
                                <>
                                    <span>Kirim Komentar</span>
                                    <Send className="w-3.5 h-3.5" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );

}