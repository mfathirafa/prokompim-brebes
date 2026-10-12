import { notFound } from "next/navigation"                                                                                                           
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { LiputanForm } from "../../liputan-form"                                                                                                     
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Edit Album Liputan | Admin Prokompim",                                                                                                   
    }                                                                                                                                                    
                                                                                                                                                         
    interface AdminEditLiputanPageProps {                                                                                                                
        params: Promise<{ id: string }>                                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminEditLiputanPage({ params }: AdminEditLiputanPageProps) {                                                          
        const { id } = await params                                                                                                                      
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const [albumRes, fotoRes] = await Promise.all([                                                                                                  
            supabase                                                                                                                                     
                .from("liputan")                                                                                                                         
                .select("id, judul, deskripsi, tanggal, cover_url, is_active")                                                                           
                .eq("id", id)                                                                                                                            
                .single(),                                                                                                                               
            supabase                                                                                                                                     
                .from("foto_liputan")                                                                                                                    
                .select("id, gambar_url, keterangan, urutan")                                                                                            
                .eq("liputan_id", id)                                                                                                                    
                .order("urutan", { ascending: true }),                                                                                                   
        ])                                                                                                                                               
                                                                                                                                                         
        if (albumRes.error || !albumRes.data) {                                                                                                          
            notFound()                                                                                                                                   
        }                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <LiputanForm                                                                                                                                 
                initialData={albumRes.data}                                                                                                              
                existingPhotos={fotoRes.data || []}                                                                                                      
            />                                                                                                                                           
        )                                                                                                                                                
    }               

    