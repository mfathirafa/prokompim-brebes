import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { BeritaCard } from "@/components/berita/berita-card";
import { BreakingNewsTicker } from "@/components/berita/breaking-news-ticker";
import {                                         
      Newspaper,                                     
      Camera,                                        
      ArrowRight,                                    
      Trophy,                                        
      Calendar,                                      
      Building2,                                     
      FileText,                                      
      Eye,                                           
} from "lucide-react";   

export const revalidate = 60; // Cache ISR 60 detik

export default async function HomePage() {
  const supabase = await createClient();

    // 1. Fetch data publik & statistik portal secara paralel
  const [
    { data: beritaList },
    { data: penghargaanList },
    { data: liputanList },
    { count: totalBeritaCount },
    { count: totalDownloadCount },
    { count: totalKegiatanCount },
    { data: beritaViewsData },
  ] = await Promise.all([
    supabase
      .from("berita")
      .select(`
        id,
        judul,
        slug,
        ringkasan,
        gambar_url,
        views,
        published_at,
        kategori_berita (
          nama,
          warna
        )  
      `)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6),

    supabase
      .from("penghargaan")
      .select("id, judul, deskripsi, instansi_pemberi, penerima, tingkat, tanggal, gambar_url")
      .eq("is_active", true)
      .order("tanggal", { ascending: false })
      .limit(6),

    supabase
      .from("liputan")
      .select("id, judul, deskripsi, tanggal, cover_url")
      .eq("is_active", true)
      .order("tanggal", { ascending: false })
      .limit(6),

    supabase
      .from("berita")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),

    supabase
      .from("files_download")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),

    supabase
      .from("kegiatan")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),

    supabase
      .from("berita")
      .select("views")
      .eq("status", "published"),
  ]);

  const totalPembacaViews = beritaViewsData?.reduce((acc, curr) => acc + (curr.views || 0), 0) ?? 0;

  return (
    <div className="flex flex-col flex-1">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-brand-sky text-white px-4 pt-28 pb-20 overflow-hidden">
        {/* Ornamen Latar Belakang */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <Image  
              src="/logo.png"
              alt="Logo Kabupaten Brebes"
              width={100}
              height={100}
              priority
              className="w-24 h-auto drop-shadow-2xl animate-in fade-in zoom-in duration-700"
            />
          </div>

          <div className="space-y-3">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold tracking-wide uppercase text-brand-gold">
              Pemerintah Kabupaten Brebes
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Bagian Protokol & Komunikasi Pimpinan
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
              Portal informasi rilis berita resmi, dokumentasi protokoler, dan publikasi kegiatan pimpinan daerah Kabupaten Brebes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              nativeButton={false}
              render={<Link href="/berita" />}
              size="lg"
              className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold rounded-full px-6 shadow-lg shadow-brand-red/30 gap-2 cursor-pointer"
            >
              <Newspaper className="w-4 h-4" />
              Baca Berita Rilis
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/liputan" />}
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white hover:text-primary font-semibold rounded-full px-6 backdrop-blur-sm gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Galeri Liputan
            </Button>
          </div>
        </div>
      </section>

            {/* --- BREAKING NEWS TICKER --- */}
      {beritaList && beritaList.length > 0 && (
        <BreakingNewsTicker
          items={beritaList.map((b) => ({
            id: b.id,
            judul: b.judul,
            slug: b.slug,
            published_at: b.published_at,
            kategori: b.kategori_berita,
          }))}
        />
      )}

      {/* --- SECTION STATISTIK & RINGKASAN PORTAL (C04) --- */}
      <section className="bg-background border-b border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card border border-border shadow-xs">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {totalBeritaCount ?? 0}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Rilis Berita Terbit</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card border border-border shadow-xs">
            <div className="p-3 rounded-xl bg-brand-sky/15 text-brand-sky">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {totalPembacaViews.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Total Pembaca Artikel</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card border border-border shadow-xs">
            <div className="p-3 rounded-xl bg-brand-gold/15 text-brand-gold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {totalDownloadCount ?? 0}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Naskah Sambutan & Dokumen</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card border border-border shadow-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {totalKegiatanCount ?? 0}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Agenda & Kegiatan Pimpinan</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 1: RILIS BERITA TERBARU --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-sky font-semibold text-sm uppercase tracking-wider mb-1">
              <Newspaper className="w-4 h-4" />
              <span>Publikasi Humas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Rilis Berita Terkini
            </h2>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/berita" />}
            variant="ghost"
            className="text-primary hover:text-primary/80 font-medium self-start md:self-auto gap-1.5 p-0 hover:bg-transparent"
          >
            Lihat Semua Berita <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {beritaList && beritaList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {beritaList.map((item) => (
              <BeritaCard 
                key={item.id}
                id={item.id}
                judul={item.judul}
                slug={item.slug}
                ringkasan={item.ringkasan}
                gambar_url={item.gambar_url}
                views={item.views}
                published_at={item.published_at}
                kategori={item.kategori_berita}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl ">
            Belum ada berita yang dipublikasikan.
          </div>
        )}
      </section>

      {/* --- SECTION 2: PENGHARGAAN KABUPATEN BREBES --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" /> Prestasi & Capaian
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Penghargaan Pimpinan & Daerah
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Apresiasi dan pengakuan atas dedikasi penyelenggaraan pemerintahan dan pembangunan Kabupaten Brebes.
            </p>
          </div>

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
                    {reward.deskripsi || "Penghargaan resmi yang dianugerahkan kepada Pemerintah Kabupaten Brebes."}
                  </p>

                  <div className="pt-3 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 text-brand-sky shrink-0" />
                    <span className="truncate">{reward.instansi_pemberi}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-2xl">
              Belum ada data penghargaan aktif.
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION 3: LIPUTAN TERBARU KEGIATAN PIMPINAN --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand-sky font-semibold text-sm uppercase tracking-wider mb-1">
                <Camera className="w-4 h-4" />
                <span>Dokumentasi Visual</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Galeri Liputan Protokoler
              </h2>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/liputan" />}
              variant="ghost"
              className="text-primary hover:text-primary/80 font-medium self-start md:self-auto gap-1.5 p-0 hover:bg-transparent"
            >
              Buka Semua Galeri <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {liputanList && liputanList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liputanList.map((album) => (
                <Link
                  key={album.id}
                  href={`/liputan/${album.id}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 shadow-md"
                >
                  <Image
                    src={album.cover_url || "/logo.png"}
                    alt={album.judul}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[11px] font-medium text-white/80 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-brand-sky" />
                      {formatDate(album.tanggal)}
                    </span>
                    <h3 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors">
                      {album.judul}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl">
              Belum ada dokumentasi liputan.
            </div>
          )}
      </section>
    </div>
  )
}