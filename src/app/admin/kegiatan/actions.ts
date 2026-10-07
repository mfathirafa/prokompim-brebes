"use server"                                                                                                                                         
                                                                                                                                                         
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { revalidatePath } from "next/cache"                                                                                                          
                                                                                                                                                         
    /**                                                                                                                                                  
     * Toggle status aktif/nonaktif kegiatan                                                                                                             
     */                                                                                                                                                  
    export async function toggleKegiatanStatus(id: string, currentStatus: boolean) {                                                                     
        const supabase = await createClient()                                                                                                            
        const nextStatus = !currentStatus                                                                                                                
                                                                                                                                                         
        const { error } = await supabase                                                                                                                 
            .from("kegiatan")                                                                                                                            
            .update({                                                                                                                                    
                is_active: nextStatus,                                                                                                                   
                updated_at: new Date().toISOString(),                                                                                                    
            })                                                                                                                                           
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal mengubah status kegiatan: ${error.message}`)                                                                          
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/kegiatan")                                                                                                                
        revalidatePath("/kegiatan")                                                                                                                      
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true, is_active: nextStatus }                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Hapus data kegiatan berdasarkan ID                                                                                                                
     */                                                                                                                                                  
    export async function deleteKegiatan(id: string) {                                                                                                   
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const { error } = await supabase                                                                                                                 
            .from("kegiatan")                                                                                                                            
            .delete()                                                                                                                                    
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal menghapus kegiatan: ${error.message}`)                                                                                
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/kegiatan")                                                                                                                
        revalidatePath("/kegiatan")                                                                                                                      
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Tambah kegiatan baru                                                                                                               
     */                                                                                                                                                  
    export async function createKegiatan(formData: FormData) {                                                                                           
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const jenis = (formData.get("jenis") as string) || "kegiatan"                                                                                    
        const lokasi = (formData.get("lokasi") as string)?.trim() || null                                                                                
        const pimpinan = (formData.get("pimpinan") as string)?.trim() || null                                                                            
        const tanggal_mulai = formData.get("tanggal_mulai") as string                                                                                    
        const tanggal_selesai = (formData.get("tanggal_selesai") as string) || null                                                                      
        const deskripsi = (formData.get("deskripsi") as string)?.trim() || null                                                                          
        const is_active = formData.get("is_active") === "true"                                                                                           
                                                                                                                                                         
        if (!judul) {                                                                                                                                    
            throw new Error("Judul kegiatan wajib diisi.")                                                                                               
        }                                                                                                                                                
        if (!tanggal_mulai) {                                                                                                                            
            throw new Error("Tanggal mulai kegiatan wajib diisi.")                                                                                       
        }                                                                                                                                                
                                                                                                                                                         
        const { error } = await supabase.from("kegiatan").insert({                                                                                       
            judul,                                                                                                                                       
            jenis,                                                                                                                                       
            lokasi,                                                                                                                                      
            pimpinan,                                                                                                                                    
            tanggal_mulai,                                                                                                                               
            tanggal_selesai: tanggal_selesai || null,                                                                                                    
            deskripsi,                                                                                                                                   
            is_active,                                                                                                                                   
        })                                                                                                                                               
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal menambahkan kegiatan: ${error.message}`)                                                                              
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/kegiatan")                                                                                                                
        revalidatePath("/kegiatan")                                                                                                                      
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Update kegiatan eksisting                                                                                                          
     */                                                                                                                                                  
    export async function updateKegiatan(id: string, formData: FormData) {                                                                               
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const jenis = (formData.get("jenis") as string) || "kegiatan"                                                                                    
        const lokasi = (formData.get("lokasi") as string)?.trim() || null                                                                                
        const pimpinan = (formData.get("pimpinan") as string)?.trim() || null                                                                            
        const tanggal_mulai = formData.get("tanggal_mulai") as string                                                                                    
        const tanggal_selesai = (formData.get("tanggal_selesai") as string) || null                                                                      
        const deskripsi = (formData.get("deskripsi") as string)?.trim() || null                                                                          
        const is_active = formData.get("is_active") === "true"                                                                                           
                                                                                                                                                         
        if (!judul) {                                                                                                                                    
            throw new Error("Judul kegiatan wajib diisi.")                                                                                               
        }                                                                                                                                                
        if (!tanggal_mulai) {                                                                                                                            
            throw new Error("Tanggal mulai kegiatan wajib diisi.")                                                                                       
        }                                                                                                                                                
                                                                                                                                                         
        const { error } = await supabase                                                                                                                 
            .from("kegiatan")                                                                                                                            
            .update({                                                                                                                                    
                judul,                                                                                                                                   
                jenis,                                                                                                                                   
                lokasi,                                                                                                                                  
                pimpinan,                                                                                                                                
                tanggal_mulai,                                                                                                                           
                tanggal_selesai: tanggal_selesai || null,                                                                                                
                deskripsi,                                                                                                                               
                is_active,                                                                                                                               
                updated_at: new Date().toISOString(),                                                                                                    
            })                                                                                                                                           
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal memperbarui kegiatan: ${error.message}`)                                                                              
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/kegiatan")                                                                                                                
        revalidatePath("/kegiatan")                                                                                                                      
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                     