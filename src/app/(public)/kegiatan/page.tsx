import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { CalendarDays, MapPin, User, Layers } from "lucide-react";

export const metadata = {
    title: "Kegiatan Pimpinan | Prokompim Pemkab Brebes",
    description:
        "Jadwal dan daftar kegiatan resmi pimpinan Pemerintah Kabupaten Brebes.",
};

const JENIS_BADGE: Record<string, string> = {
    upacara: "bg-brand-red text-white",
    hari_nasional: "bg-brand-gold text-zinc-950",
    kegiatan_pimpinan: "bg-primary text-primary-foreground",
    kegiatan: "bg-muted text-muted-foreground",
};

const JENIS_LABEL: Record<string, string> = {
    upacara: "Upacara",
    hari_nasional: "Hari Nasional",
    kegiatan_pimpinan: "Kegiatan Pimpinan",
    kegiatan: "Kegiatan",
};

export default async function KegitanPage() {
    const supabase = await createClient();

    const { data: KegiatanList } = await supabase
        .from("kegiatan")
        .select("id, judul, jenis, lokasi, pimpinan, tanggal_mulai, tanggal_selesai, deskripsi")
        .eq("is_active", true)
        .order("tanggal_mulai", { ascending: false });

    return (
        <div className="flex flex-col flex-1 pb-20">
            {/* Header Banner */}
            <section className="bg-gradient-to-r from-primary via-primary/95 to-brand-sky text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-gold text-xs font-semibold uppercase tracking-wider">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Agenda Pimpinan</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Kegiatan Pimpinan
                    </h1>
                    <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
                        Daftar kegiatan resmi, upacara, dan agenda pimpinan
                        Pemerintah Kabupaten Brebes.
                    </p>
                </div>
            </section>

            {/* Konten Utama */}
            <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10">
                {KegiatanList && KegiatanList.length > 0 ? (
                    <div className="flex flex-col gap-0">
                        {KegiatanList.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex gap-4 sm:gap-6 group"
                            >
                                {/* Kolom Kiri: Badge Tanggal + Garis */}
                                <div className="flex flex-col items-center">
                                    <div className="shrink-0 w-16 sm:w-20 bg-primary/10 text-primary rounded-xl p-2.5 text-center">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                            {new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
                                                new Date(item.tanggal_mulai)
                                            )}
                                        </p>
                                        <p className="text-2xl font-extrabold leading-none">
                                            {new Date(item.tanggal_mulai).getDate()}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {new Date(item.tanggal_mulai).getFullYear()}
                                        </p>
                                    </div>
                                    {index < KegiatanList.length - 1 && (
                                        <div className="w-px flex-1 bg-border my-2" />
                                    )}
                                </div>

                                {/* Kolom Kanan: Detail */}
                                <div className="flex-1 pb-8">
                                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-colors">
                                        <span 
                                            className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md mb-3 ${
                                                JENIS_BADGE[item.jenis] || JENIS_BADGE["kegiatan"]
                                            }`}
                                        >
                                            {JENIS_LABEL[item.jenis]}
                                        </span>

                                        <h3 className="font-bold text-base text-foreground leading-snug mb-3">
                                            {item.judul}
                                        </h3>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                                            {item.lokasi && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                                                    {item.lokasi}
                                                </span>
                                            )}
                                            {item.pimpinan && (
                                                <span className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-brand-sky shrink-0" />
                                                    {item.pimpinan}
                                                </span>
                                            )}
                                            {item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_mulai && (
                                                <span className="flex items-center gap-1.5">
                                                    <Layers className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                                                    s.d. {formatDate(item.tanggal_selesai)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                        <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <h3 className="text-lg font-bold text-foreground mb-1">
                            Belum Ada Kegiatan
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Jadwal kegiatan pimpinan akan ditampilkan di sini.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}