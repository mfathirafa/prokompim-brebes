 import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { BeritaForm } from "../berita-form"                                                                                                          
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Tambah Berita Baru | Admin Prokompim",                                                                                                   
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminTambahBeritaPage() {                                                                                              
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // Ambil daftar kategori berita untuk opsi dropdown                                                                                              
        const { data: categories = [] } = await supabase                                                                                                 
            .from("kategori_berita")                                                                                                                     
            .select("id, nama")                                                                                                                          
            .order("nama", { ascending: true })                                                                                                          
                                                                                                                                                         
        return (                                                                                                                                         
            <div className="space-y-6">                                                                                                                  
                <div>                                                                                                                                    
                    <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">                                                   
                        Tambah Berita Baru                                                                                                               
                    </h1>                                                                                                                                
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">                                                                      
                        Buat dan publikasikan siaran pers atau berita kegiatan protokol pimpinan                                                         
                    </p>                                                                                                                                 
                </div>                                                                                                                                   
                                                                                                                                                         
                <BeritaForm categories={categories || []} />                                                                                             
            </div>                                                                                                                                       
        )                                                                                                                                                
    }                                           