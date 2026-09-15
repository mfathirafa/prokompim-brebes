import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Newspaper, Camera } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      {/* HERO SECTION - Banner Biru Gradien dengan Logo Brebes */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-brand-sky text-white px-4 pt-28 pb-20 overflow-hidden">
      
        {/*Ornamen Latar Belakang */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_11px, transparent_1px)] [background-size:16px_16px] pointer-events-none" />

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
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm  
  font-semibold tracking-wide uppercase text-brand-gold">                                                               
                  Pemerintah Kabupaten Brebes                                                                           
                </span>                                                                                                 
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">           
                  Bagian Protokol & Komunikasi Pimpinan                                                                 
                </h1>                                                                                                   
                <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">                    
                  Portal informasi rilis berita resmi, dokumentasi protokoler, dan publikasi kegiatan pimpinan daerah   
  Kabupaten Brebes.                                                                                                     
                </p>                                                                                                    
              </div>                                                                                                    
                                                                                                                        
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">                                   
                <Button                                                                                                 
                  render={<Link href="/berita" />}                                                                                               
                  size="lg"                                                                                             
                  className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold rounded-full px-6 shadow-lg shadow-brand-red/30 gap-2"                                                                                            
                >                                                                                                       
                    <Newspaper className="w-4 h-4" />                                                                   
                    Baca Berita Rilis                                                                                   
                </Button>                                                                                               
                <Button             
                  render={<Link href="/liputan" />}                                                                                    
                  size="lg"                                                                                             
                  variant="outline"                                                                                     
                  className="border-white/30 text-white bg-white/10 hover:bg-white hover:text-primary font-semibold rounded-full px-6 backdrop-blur-sm gap-2"                                                                             
                >                                                                                
                    <Camera className="w-4 h-4" />                                                                      
                    Galeri Liputan                                                                                                                                                                           
                </Button>                                                                                               
              </div>                                                                                                    
            </div>                                                                                                      
          </section>                                                                                                    
                                                                                                                        
          {/* Konten Dummy untuk Menguji Efek Scroll Navbar */}                                                         
          <section className="py-24 px-4 bg-muted/40">                                                                  
            <div className="max-w-4xl mx-auto text-center space-y-4">                                                   
              <h2 className="text-2xl font-bold text-foreground">                                                       
                Fondasi Layout Berhasil Dipasang!                                                                       
              </h2>                                                                                                     
              <p className="text-muted-foreground max-w-lg mx-auto">                                                    
                Scroll ke bawah untuk melihat navbar berubah dari transparan menjadi solid navy (<code className="text- 
  xs bg-muted px-1 py-0.5 rounded">bg-primary</code>).                                                                  
              </p>                                                                                                      
              <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-2xl text-muted-      
  foreground text-sm">                                                                                                  
                Area Berita Terbaru & Penghargaan (Akan dikerjakan di tahap berikutnya)                                 
              </div>                                                                                                    
            </div>                                                                                                      
          </section>                                                                                                    
        </div>                                                                                                          
      )                                                                                                                 
    }                                