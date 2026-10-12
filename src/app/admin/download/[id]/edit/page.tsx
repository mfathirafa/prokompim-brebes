import { notFound } from "next/navigation"                                                                                                           
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { DownloadForm } from "../../download-form"                                                                                                   
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Edit Dokumen Unduhan | Admin Prokompim",                                                                                                 
    }                                                                                                                                                    
                                                                                                                                                         
    interface AdminEditDownloadPageProps {                                                                                                               
        params: Promise<{ id: string }>                                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminEditDownloadPage({ params }: AdminEditDownloadPageProps) {                                                        
        const { id } = await params                                                                                                                      
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // Fetch data kategori dan data dokumen eksisting secara paralel                                                                                 
        const [kategoriRes, fileRes] = await Promise.all([                                                                                               
            supabase                                                                                                                                     
                .from("kategori_download")                                                                                                               
                .select("id, nama")                                                                                                                      
                .order("urutan", { ascending: true }),                                                                                                   
            supabase                                                                                                                                     
                .from("files_download")                                                                                                                  
                .select("id, judul, deskripsi, kategori_id, tanggal_kegiatan, file_name, file_size, file_type, is_active")                               
                .eq("id", id)                                                                                                                            
                .single(),                                                                                                                               
        ])                                                                                                                                               
                                                                                                                                                         
        // Jika dokumen tidak ditemukan atau ID tidak valid                                                                                              
        if (fileRes.error || !fileRes.data) {                                                                                                            
            notFound()                                                                                                                                   
        }                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <DownloadForm                                                                                                                                
                categories={kategoriRes.data || []}                                                                                                      
                initialData={fileRes.data}                                                                                                               
            />                                                                                                                                           
        )                                                                                                                                                
    }                