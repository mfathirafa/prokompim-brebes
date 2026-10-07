import { notFound } from "next/navigation"                                                                                                           
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { PenghargaanForm } from "../../penghargaan-form"                                                                                             
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Edit Penghargaan | Admin Prokompim",                                                                                                     
    }                                                                                                                                                    
                                                                                                                                                         
    interface AdminEditPenghargaanPageProps {                                                                                                            
        params: Promise<{ id: string }>                                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminEditPenghargaanPage({ params }: AdminEditPenghargaanPageProps) {                                                  
        const { id } = await params                                                                                                                      
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const { data: penghargaan, error } = await supabase                                                                                              
            .from("penghargaan")                                                                                                                         
            .select("id, judul, deskripsi, instansi_pemberi, penerima, tingkat, tanggal, gambar_url, is_active")                                         
            .eq("id", id)                                                                                                                                
            .single()                                                                                                                                    
                                                                                                                                                         
        if (error || !penghargaan) {                                                                                                                     
            notFound()                                                                                                                                   
        }                                                                                                                                                
                                                                                                                                                         
        return <PenghargaanForm initialData={penghargaan} />                                                                                             
    }          