import { notFound } from "next/navigation"                                                                                                           
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { KegiatanForm } from "../../kegiatan-form"                                                                                                   
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Edit Kegiatan | Admin Prokompim",                                                                                                        
    }                                                                                                                                                    
                                                                                                                                                         
    interface AdminEditKegiatanPageProps {                                                                                                               
        params: Promise<{ id: string }>                                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminEditKegiatanPage({ params }: AdminEditKegiatanPageProps) {                                                        
        const { id } = await params                                                                                                                      
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const { data: kegiatan, error } = await supabase                                                                                                 
            .from("kegiatan")                                                                                                                            
            .select("id, judul, jenis, lokasi, pimpinan, tanggal_mulai, tanggal_selesai, deskripsi, is_active")                                          
            .eq("id", id)                                                                                                                                
            .single()                                                                                                                                    
                                                                                                                                                         
        if (error || !kegiatan) {                                                                                                                        
            notFound()                                                                                                                                   
        }                                                                                                                                                
                                                                                                                                                         
        return <KegiatanForm initialData={kegiatan} />                                                                                                   
    }  