import Link from "next/link";                                                                                                                        
    import { Button } from "@/components/ui/button";                                                                                                     
    import {                                                                                                                                             
      Building2,                                                                                                                                         
      UserCheck,                                                                                                                                         
      CalendarDays,                                                                                                                                      
      Camera,                                                                                                                                            
      FileText,                                                                                                                                          
      ArrowRight,                                                                                                                                        
      ShieldCheck,                                                                                                                                       
      CheckCircle2,                                                                                                                                      
      Sparkles                                                                                                                                           
    } from "lucide-react";                                                                                                                               
                                                                                                                                                         
    export const metadata = {                                                                                                                            
      title: "Profil Pimpinan Daerah | Prokompim Pemkab Brebes",                                                                                         
      description: "Profil Pimpinan Daerah Pemerintah Kabupaten Brebes dan Tugas Pokok Bagian Protokol dan Komunikasi Pimpinan (Prokompim) Setda Brebes.",
    };                                                                                                                                                   
                                                                                                                                                         
    const PIMPINAN_DATA = [                                                                                                                              
      {                                                                                                                                                  
        jabatan: "Penjabat (Pj.) Bupati Brebes",                                                                                                         
        nama: "Ir. Djoko Gunawan, M.T.",                                                                                                                 
        periode: "Kepala Daerah",                                                                                                                        
        peran: "Pimpinan Pemerintah Daerah Kabupaten Brebes",                                                                                            
        deskripsi:                                                                                                                                       
          "Memimpin penyelenggaraan pemerintahan daerah Kabupaten Brebes, menetapkan kebijakan strategis bersama DPRD, memelihara ketenteraman dan ketertiban masyarakat, serta mengoordinasikan percepatan penanganan kemiskinan dan pertumbuhan ekonomi daerah.",                                       
        fokus: [                                                                                                                                         
          "Pelayanan publik inklusif dan responsif",                                                                                                     
          "Percepatan pengentasan kemiskinan ekstrem",                                                                                                   
          "Peningkatan infrastruktur pertanian & perekonomian rakyat",                                                                                   
        ],                                                                                                                                               
        avatarGradient: "from-brand-gold to-amber-600",                                                                                                  
      },                                                                                                                                                 
      {                                                                                                                                                  
        jabatan: "Sekretaris Daerah Kabupaten Brebes",                                                                                                   
        nama: "Drs. Tahroni, M.Pd.",                                                                                                                     
        periode: "Sekretariat Daerah",                                                                                                                   
        peran: "Koordinator Perangkat Daerah & Administrasi",                                                                                            
        deskripsi:                                                                                                                                       
          "Membantu Bupati dalam penyusunan kebijakan serta pengoordinasian administratif pelaksanaan tugas seluruh Perangkat Daerah dan pelayanan administratif di lingkungan Pemerintah Kabupaten Brebes.",                                                                                             
        fokus: [                                                                                                                                         
          "Reformasi birokrasi dan tata kelola pemerintahan berbasis digital",                                                                           
          "Harmonisasi koordinasi antar-OPD di lingkungan Pemkab Brebes",                                                                                
          "Akuntabilitas kinerja dan pengelolaan anggaran daerah",                                                                                       
        ],                                                                                                                                               
        avatarGradient: "from-primary to-brand-sky",                                                                                                     
      },                                                                                                                                                 
    ];                                                                                                                                                   
                                                                                                                                                         
    const TUPOKSI_PROKOMPIM = [                                                                                                                          
      {                                                                                                                                                  
        judul: "Subbagian Protokol",                                                                                                                     
        deskripsi:                                                                                                                                       
          "Melaksanakan tata tempat, tata upacara, dan tata penghormatan dalam rangka penyelenggaraan kegiatan resmi pimpinan daerah, penerimaan kunjungan kerja kenegaraan, serta upacara hari besar nasional.",                                                                                       
        icon: ShieldCheck,                                                                                                                               
      },                                                                                                                                                 
      {                                                                                                                                                  
        judul: "Subbagian Komunikasi Pimpinan",                                                                                                          
        deskripsi:                                                                                                                                       
          "Mempersiapkan rilis pers, peliputan jurnalistik, publikasi media massa, dan penyebarluasan informasi kebijakan pimpinan daerah kepada masyarakat luas.",                                                                                                                                     
        icon: Sparkles,                                                                                                                                  
      },                                                                                                                                                 
      {                                                                                                                                                  
        judul: "Subbagian Dokumentasi & Naskah",                                                                                                         
        deskripsi:                                                                                                                                       
          "Menyusun konsep sambutan, pidato, materi presentasi pimpinan daerah, serta mengelola dokumentasi audio-visual sejarah pelaksanaan tugas protokoler pimpinan.",                                                                                                                                 
        icon: FileText,                                                                                                                                  
      },                                                                                                                                                 
    ];                                                                                                                                                   
                                                                                                                                                         
    export default function ProfilPimpinanPage() {                                                                                                       
      return (                                                                                                                                           
        <div className="flex flex-col flex-1 pb-20">                                                                                                     
          {/* Header Banner */}                                                                                                                          
          <section className="bg-gradient-to-r from-primary via-primary/95 to-brand-sky text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8">                    
            <div className="max-w-7xl mx-auto space-y-4">                                                                                                
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 backdrop-blur-md text-brand-gold text-xs font-      
  semibold uppercase tracking-wider">                                                                                                                    
                <UserCheck className="w-3.5 h-3.5" />                                                                                                    
                <span>Pemerintah Kabupaten Brebes</span>                                                                                                 
              </div>                                                                                                                                     
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">                                                                        
                Profil Pimpinan Daerah                                                                                                                   
              </h1>                                                                                                                                      
              <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">                                                               
                Mengenal pimpinan Pemerintah Kabupaten Brebes serta jajaran Bagian Protokol dan Komunikasi Pimpinan (Prokompim) Sekretariat Daerah       
  Kabupaten Brebes.                                                                                                                                      
              </p>                                                                                                                                       
            </div>                                                                                                                                       
          </section>                                                                                                                                     
                                                                                                                                                         
          {/* Konten Utama */}                                                                                                                           
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 space-y-16">                                                              
            {/* Section 1: Kartu Pimpinan Daerah */}                                                                                                     
            <section className="space-y-6">                                                                                                              
              <div className="flex flex-col gap-1 border-b border-border pb-4">                                                                          
                <span className="text-xs font-bold uppercase tracking-wider text-primary">                                                               
                  Kepemimpinan Daerah                                                                                                                    
                </span>                                                                                                                                  
                <h2 className="text-2xl font-bold tracking-tight text-foreground">                                                                       
                  Jajaran Pimpinan Daerah Kabupaten Brebes                                                                                               
                </h2>                                                                                                                                    
              </div>                                                                                                                                     
                                                                                                                                                         
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">                                                                                    
                {PIMPINAN_DATA.map((item, idx) => (                                                                                                      
                  <div                                                                                                                                   
                    key={idx}                                                                                                                            
                    className="bg-card rounded-2xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-primary/40       
  transition-colors"                                                                                                                                     
                  >                                                                                                                                      
                    <div className="space-y-6">                                                                                                          
                      {/* Header Pimpinan */}                                                                                                            
                      <div className="flex items-start gap-4">                                                                                           
                        <div                                                                                                                             
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${item.avatarGradient} flex items-center justify-center    
  text-white text-2xl font-black shadow-md shrink-0`}                                                                                                    
                        >                                                                                                                                
                          {item.nama                                                                                                                     
                            .split(" ")                                                                                                                  
                            .filter((w) => !w.includes(".") && !w.includes(","))                                                                         
                            .slice(0, 2)                                                                                                                 
                            .map((n) => n[0])                                                                                                            
                            .join("") || "PB"}                                                                                                           
                        </div>                                                                                                                           
                        <div>                                                                                                                            
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary mb-1">               
                            {item.periode}                                                                                                               
                          </span>                                                                                                                        
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">                                                    
                            {item.nama}                                                                                                                  
                          </h3>                                                                                                                          
                          <p className="text-sm font-semibold text-brand-gold dark:text-brand-gold/90">                                                  
                            {item.jabatan}                                                                                                               
                          </p>                                                                                                                           
                          <p className="text-xs text-muted-foreground mt-0.5">                                                                           
                            {item.peran}                                                                                                                 
                          </p>                                                                                                                           
                        </div>                                                                                                                           
                      </div>                                                                                                                             
                                                                                                                                                         
                      {/* Deskripsi Tupoksi Pimpinan */}                                                                                                 
                      <div className="text-sm text-muted-foreground leading-relaxed">                                                                    
                        {item.deskripsi}                                                                                                                 
                      </div>                                                                                                                             
                                                                                                                                                         
                      {/* Fokus Kebijakan */}                                                                                                            
                      <div className="space-y-2 pt-4 border-t border-border/60">                                                                         
                        <p className="text-xs font-bold uppercase tracking-wider text-foreground">                                                       
                          Fokus & Prioritas:                                                                                                             
                        </p>                                                                                                                             
                        <ul className="space-y-1.5">                                                                                                     
                          {item.fokus.map((fok, fIdx) => (                                                                                               
                            <li                                                                                                                          
                              key={fIdx}                                                                                                                 
                              className="flex items-start gap-2 text-xs sm:text-sm text-foreground/80"                                                   
                            >                                                                                                                            
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />                                                      
                              <span>{fok}</span>                                                                                                         
                            </li>                                                                                                                        
                          ))}                                                                                                                            
                        </ul>                                                                                                                            
                      </div>                                                                                                                             
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Tautan Cepat */}                                                                                                                 
                    <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">                                                 
                      <span className="text-xs text-muted-foreground">                                                                                   
                        Kabupaten Brebes                                                                                                                 
                      </span>                                                                                                                            
                      <Button                                                                                                                            
                        nativeButton={false}                                                                                                             
                        render={<Link href="/kegiatan" />}                                                                                               
                        variant="ghost"                                                                                                                  
                        className="text-primary hover:text-primary/80 font-medium text-xs gap-1.5 p-0 hover:bg-transparent"                              
                      >                                                                                                                                  
                        Lihat Agenda Kegiatan <ArrowRight className="w-3.5 h-3.5" />                                                                     
                      </Button>                                                                                                                          
                    </div>                                                                                                                               
                  </div>                                                                                                                                 
                ))}                                                                                                                                      
              </div>                                                                                                                                     
            </section>                                                                                                                                   
                                                                                                                                                         
            {/* Section 2: Tupoksi Bagian Prokompim */}                                                                                                  
            <section className="bg-muted/40 rounded-3xl border border-border p-6 sm:p-10 space-y-8">                                                     
              <div className="max-w-2xl space-y-2">                                                                                                      
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">                                        
                  <Building2 className="w-4 h-4" />                                                                                                      
                  <span>Sekretariat Daerah</span>                                                                                                        
                </div>                                                                                                                                   
                <h2 className="text-2xl font-bold tracking-tight text-foreground">                                                                       
                  Bagian Protokol & Komunikasi Pimpinan (Prokompim)                                                                                      
                </h2>                                                                                                                                    
                <p className="text-sm text-muted-foreground leading-relaxed">                                                                            
                  Bertugas menyiapkan pelaksanaan kebijakan, pengoordinasian penyelenggaraan tugas Perangkat Daerah, fasilitasi keprotokolan, komunikasi 
  publik pimpinan, serta dokumentasi materi pimpinan daerah.                                                                                             
                </p>                                                                                                                                     
              </div>                                                                                                                                     
                                                                                                                                                         
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">                                                                                    
                {TUPOKSI_PROKOMPIM.map((tupoksi, tIdx) => {                                                                                              
                  const Icon = tupoksi.icon;                                                                                                             
                  return (                                                                                                                               
                    <div                                                                                                                                 
                      key={tIdx}                                                                                                                         
                      className="bg-background rounded-2xl border border-border p-6 space-y-3 shadow-xs hover:border-primary/30 transition-colors"       
                    >                                                                                                                                    
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">                                 
                        <Icon className="w-5 h-5" />                                                                                                     
                      </div>                                                                                                                             
                      <h3 className="font-bold text-base text-foreground">                                                                               
                        {tupoksi.judul}                                                                                                                  
                      </h3>                                                                                                                              
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">                                                           
                        {tupoksi.deskripsi}                                                                                                              
                      </p>                                                                                                                               
                    </div>                                                                                                                               
                  );                                                                                                                                     
                })}                                                                                                                                      
              </div>                                                                                                                                     
            </section>                                                                                                                                   
                                                                                                                                                         
            {/* Section 3: Layanan Cepat Terintegrasi */}                                                                                                
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">                                                                                  
              <Link                                                                                                                                      
                href="/kegiatan"                                                                                                                         
                className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all flex items-center justify-between"  
              >                                                                                                                                          
                <div className="flex items-center gap-3">                                                                                                
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">                               
                    <CalendarDays className="w-5 h-5" />                                                                                                 
                  </div>                                                                                                                                 
                  <div>                                                                                                                                  
                    <p className="text-sm font-bold text-foreground">Agenda Kegiatan</p>                                                                 
                    <p className="text-xs text-muted-foreground">Jadwal resmi pimpinan</p>                                                               
                  </div>                                                                                                                                 
                </div>                                                                                                                                   
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />               
              </Link>                                                                                                                                    
                                                                                                                                                         
              <Link                                                                                                                                      
                href="/liputan"                                                                                                                          
                className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all flex items-center justify-between"  
              >                                                                                                                                          
                <div className="flex items-center gap-3">                                                                                                
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">                               
                    <Camera className="w-5 h-5" />                                                                                                       
                  </div>                                                                                                                                 
                  <div>                                                                                                                                  
                    <p className="text-sm font-bold text-foreground">Galeri Liputan</p>                                                                  
                    <p className="text-xs text-muted-foreground">Dokumentasi pimpinan</p>                                                                
                  </div>                                                                                                                                 
                </div>                                                                                                                                   
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />               
              </Link>                                                                                                                                    
                                                                                                                                                         
              <Link                                                                                                                                      
                href="/download"                                                                                                                         
                className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all flex items-center justify-between"  
              >                                                                                                                                          
                <div className="flex items-center gap-3">                                                                                                
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">                               
                    <FileText className="w-5 h-5" />                                                                                                     
                  </div>                                                                                                                                 
                  <div>                                                                                                                                  
                    <p className="text-sm font-bold text-foreground">Naskah Sambutan</p>                                                                 
                    <p className="text-xs text-muted-foreground">Unduh naskah & pidato</p>                                                               
                  </div>                                                                                                                                 
                </div>                                                                                                                                   
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />               
              </Link>                                                                                                                                    
            </section>                                                                                                                                   
          </main>                                                                                                                                        
        </div>                                                                                                                                           
      );                                                                                                                                                 
    }           