import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Newspaper, Building2 } from "lucide-react";

export const metadata = {
  title: "404 - Halaman Tidak Ditemukan",
  description: "Halaman yang Anda tuju tidak ditemukan pada Portal Web Prokompim Brebes.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo Kabupaten Brebes */}
        <div className="flex justify-center">
          <div className="relative p-3 rounded-2xl bg-card border border-border shadow-sm">
            <Image
              src="/logo.png"
              alt="Logo Kabupaten Brebes"
              width={72}
              height={72}
              priority
              className="w-16 h-auto drop-shadow-md"
            />
          </div>
        </div>

        {/* Kode & Judul Error */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
            Kesalahan 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Maaf, halaman atau dokumen yang Anda cari tidak dapat ditemukan, telah dipindahkan, atau alamat URL tidak valid.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/berita" />}
            variant="outline"
            className="w-full sm:w-auto border-border hover:bg-muted text-foreground font-semibold rounded-xl text-xs gap-2"
          >
            <Newspaper className="w-4 h-4" />
            <span>Rilis Berita</span>
          </Button>
        </div>

        {/* Tautan Alternatif */}
        <div className="pt-6 border-t border-border/60 text-xs text-muted-foreground">
          <p>
            Perlu bantuan keprotokolan? Kunjungi halaman{" "}
            <Link href="/profil" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
              Profil Prokompim <Building2 className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
