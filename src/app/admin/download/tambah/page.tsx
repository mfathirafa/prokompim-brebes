import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { DownloadForm } from "../download-form"                                                                                                      
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Tambah Dokumen Unduhan | Admin Prokompim",                                                                                               
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminTambahDownloadPage() {                                                                                            
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // Ambil daftar kategori download untuk opsi dropdown                                                                                            
        const { data: categories } = await supabase                                                                                                      
            .from("kategori_download")                                                                                                                   
            .select("id, nama")                                                                                                                          
            .order("urutan", { ascending: true })                                                                                                        
                                                                                                                                                         
        return <DownloadForm categories={categories || []} />                                                                                            
    }              