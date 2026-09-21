import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Trophy, Building2 } from "lucide-react";

export const metadata = {
    title: "Penghargaan | Prokompim Pemkab Brebes",
    description: 
        "Daftar penghargaan dan prestasi yang diraih oleh Pemerintah Kabupaten Brebes.",
};

export default async function PenghargaanPage() {
    const supabase = await createClient();

    const { data: penghargaanList } = await supabase
        .from("penghargaan")
        .select("id, judul, deskripsi, instansi_pemberi, penerima, tingkat, tanggal, gambar_url")
        .eq("is_active", true)
        .order("tanggal", { ascending: false });

    return (
        <div className="flex flex-col flex-1 pb-20">
            {/* Header Banner */}
            <section className="bg-gradient-to-r from-primary via-primary/95 to-brand-sky text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 backdrop-blur-md text-brand-gold text-xs font-semibold uppercase tracking-wider">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Prestasi &amp; Capaian</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                       Penghargaan Pimpinan &amp; Daerah 
                    </h1>
                    <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
                        Apresiasi dan pengakuan atas dedikasi penyelenggaraan pemerintahan
                        dan pembangunan Kabupaten Brebes.
                    </p>
                </div>
            </section>

            {/* Konten Utama */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10">
                {penghargaanList && penghargaanList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {penghargaanList.map((reward) => (
                            <div
                                key={reward.id}
                                className="bg-card rounded-2xl border border-border p-6 flex flex-col hover:border-brand-gold/50 transition-colors shadow-sm"
                            >
                                <div className="flex items-center justify-between gap-2 mb-4">
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-gold text-zinc-950">
                                        {reward.tingkat || "Nasional"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(reward.tanggal)}
                                    </span>
                                </div>

                                <h3 className="font-bold text-base leading-snug mb-2 text-foreground">
                                    {reward.judul}
                                </h3>

                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
                                    {reward.deskripsi ||
                                        "Penghargaan resmi yang dianugerahkan kepada Pemerintah Kabupaten Brebes."}
                                </p>

                                <div className="pt-3 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
                                    <Building2 className="w-3.5 h-3.5 text-brand-sky shrink-0" />
                                    <span className="truncate">
                                        {reward.instansi_pemberi}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                        <Trophy className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <h3 className="text-lg font-bold text-foreground mb-1">
                            Belum Ada Data Penghargaan
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Data penghargaan yang diraih Pemkab Brebes akan ditampilkan di sini.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}