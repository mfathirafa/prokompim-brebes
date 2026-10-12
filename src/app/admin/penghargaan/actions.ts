"use server"                                                                                                                                         
                                                                                                                                                         
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { revalidatePath } from "next/cache"                                                                                                          
    import { STORAGE_BUCKETS } from "@/lib/constants"                                                                                                    
                                                                                                                                                         
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB                                                                                                       
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]                                                                                
                                                                                                                                                         
    /**                                                                                                                                                  
     * Upload gambar piagam/penghargaan ke Supabase Storage                                                                                              
     */                                                                                                                                                  
    async function uploadGambarPenghargaan(file: File): Promise<string> {                                                                                
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        if (file.size > MAX_IMAGE_SIZE) {                                                                                                                
            throw new Error("Ukuran foto penghargaan maksimal 5 MB.")                                                                                    
        }                                                                                                                                                
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {                                                                                                  
            throw new Error("Format foto harus JPG, PNG, atau WebP.")                                                                                    
        }                                                                                                                                                
                                                                                                                                                         
        const ext = file.name.split(".").pop() || "jpg"                                                                                                  
        const fileName = `penghargaan-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`                                                
                                                                                                                                                         
        const { error: uploadError } = await supabase.storage                                                                                            
            .from(STORAGE_BUCKETS.PENGHARGAAN)                                                                                                           
            .upload(fileName, file, { cacheControl: "3600", upsert: false })                                                                             
                                                                                                                                                         
        if (uploadError) {                                                                                                                               
            throw new Error(`Gagal mengunggah gambar penghargaan: ${uploadError.message}`)                                                               
        }                                                                                                                                                
                                                                                                                                                         
        const {                                                                                                                                          
            data: { publicUrl },                                                                                                                         
        } = supabase.storage.from(STORAGE_BUCKETS.PENGHARGAAN).getPublicUrl(fileName)                                                                    
                                                                                                                                                         
        return publicUrl                                                                                                                                 
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Toggle status aktif/nonaktif penghargaan                                                                                                          
     */                                                                                                                                                  
    export async function togglePenghargaanStatus(id: string, currentStatus: boolean) {                                                                  
        const supabase = await createClient()                                                                                                            
        const nextStatus = !currentStatus                                                                                                                
                                                                                                                                                         
        const { error } = await supabase                                                                                                                 
            .from("penghargaan")                                                                                                                         
            .update({                                                                                                                                    
                is_active: nextStatus,                                                                                                                   
                updated_at: new Date().toISOString(),                                                                                                    
            })                                                                                                                                           
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal mengubah status penghargaan: ${error.message}`)                                                                       
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/penghargaan")                                                                                                             
        revalidatePath("/penghargaan")                                                                                                                   
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true, is_active: nextStatus }                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Hapus data penghargaan beserta foto di storage jika ada                                                                                           
     */                                                                                                                                                  
    export async function deletePenghargaan(id: string) {                                                                                                
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // Ambil URL gambar eksisting                                                                                                                    
        const { data: record, error: fetchError } = await supabase                                                                                       
            .from("penghargaan")                                                                                                                         
            .select("gambar_url")                                                                                                                        
            .eq("id", id)                                                                                                                                
            .single()                                                                                                                                    
                                                                                                                                                         
        if (fetchError || !record) {                                                                                                                     
            throw new Error("Data penghargaan tidak ditemukan.")                                                                                         
        }                                                                                                                                                
                                                                                                                                                         
        // Hapus gambar dari Supabase Storage jika ada                                                                                                   
        if (record.gambar_url) {                                                                                                                         
            try {                                                                                                                                        
                const fileName = record.gambar_url.split("/").pop()                                                                                      
                if (fileName) {                                                                                                                          
                    await supabase.storage.from(STORAGE_BUCKETS.PENGHARGAAN).remove([fileName])                                                          
                }                                                                                                                                        
            } catch {                                                                                                                                    
                // Lanjutkan penghapusan database meskipun storage gagal                                                                                 
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const { error: deleteError } = await supabase                                                                                                    
            .from("penghargaan")                                                                                                                         
            .delete()                                                                                                                                    
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (deleteError) {                                                                                                                               
            throw new Error(`Gagal menghapus data penghargaan: ${deleteError.message}`)                                                                  
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/penghargaan")                                                                                                             
        revalidatePath("/penghargaan")                                                                                                                   
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Tambah data penghargaan baru                                                                                                       
     */                                                                                                                                                  
    export async function createPenghargaan(formData: FormData) {                                                                                        
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const instansi_pemberi = (formData.get("instansi_pemberi") as string)?.trim()                                                                    
        const penerima = (formData.get("penerima") as string)?.trim() || "Pemerintah Kabupaten Brebes"                                                   
        const tingkat = (formData.get("tingkat") as string) || "Nasional"                                                                                
        const tanggal = (formData.get("tanggal") as string) || new Date().toISOString().split("T")[0]                                                    
        const deskripsi = (formData.get("deskripsi") as string)?.trim() || null                                                                          
        const is_active = formData.get("is_active") === "true"                                                                                           
        const gambarFile = formData.get("gambar") as File | null                                                                                         
                                                                                                                                                         
        if (!judul) {                                                                                                                                    
            throw new Error("Nama/Judul penghargaan wajib diisi.")                                                                                       
        }                                                                                                                                                
        if (!instansi_pemberi) {                                                                                                                         
            throw new Error("Instansi pemberi penghargaan wajib diisi.")                                                                                 
        }                                                                                                                                                
                                                                                                                                                         
        let gambar_url: string | null = null                                                                                                             
        if (gambarFile && gambarFile.size > 0 && gambarFile.name) {                                                                                      
            gambar_url = await uploadGambarPenghargaan(gambarFile)                                                                                       
        }                                                                                                                                                
                                                                                                                                                         
        const { error } = await supabase.from("penghargaan").insert({                                                                                    
            judul,                                                                                                                                       
            instansi_pemberi,                                                                                                                            
            penerima,                                                                                                                                    
            tingkat,                                                                                                                                     
            tanggal,                                                                                                                                     
            deskripsi,                                                                                                                                   
            gambar_url,                                                                                                                                  
            is_active,                                                                                                                                   
        })                                                                                                                                               
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal menyimpan data penghargaan: ${error.message}`)                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/penghargaan")                                                                                                             
        revalidatePath("/penghargaan")                                                                                                                   
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Perbarui data penghargaan                                                                                                          
     */                                                                                                                                                  
    export async function updatePenghargaan(id: string, formData: FormData) {                                                                            
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const instansi_pemberi = (formData.get("instansi_pemberi") as string)?.trim()                                                                    
        const penerima = (formData.get("penerima") as string)?.trim() || "Pemerintah Kabupaten Brebes"                                                   
        const tingkat = (formData.get("tingkat") as string) || "Nasional"                                                                                
        const tanggal = (formData.get("tanggal") as string) || new Date().toISOString().split("T")[0]                                                    
        const deskripsi = (formData.get("deskripsi") as string)?.trim() || null                                                                          
        const is_active = formData.get("is_active") === "true"                                                                                           
        const gambarFile = formData.get("gambar") as File | null                                                                                         
                                                                                                                                                         
        if (!judul) {                                                                                                                                    
            throw new Error("Nama/Judul penghargaan wajib diisi.")                                                                                       
        }                                                                                                                                                
        if (!instansi_pemberi) {                                                                                                                         
            throw new Error("Instansi pemberi penghargaan wajib diisi.")                                                                                 
        }                                                                                                                                                
                                                                                                                                                         
        // Siapkan update payload dengan strict typing                                                                                                   
        const updatePayload: {                                                                                                                           
            judul: string                                                                                                                                
            instansi_pemberi: string                                                                                                                     
            penerima: string                                                                                                                             
            tingkat: string | null                                                                                                                       
            tanggal: string                                                                                                                              
            deskripsi: string | null                                                                                                                     
            is_active: boolean                                                                                                                           
            updated_at: string                                                                                                                           
            gambar_url?: string                                                                                                                          
        } = {                                                                                                                                            
            judul,                                                                                                                                       
            instansi_pemberi,                                                                                                                            
            penerima,                                                                                                                                    
            tingkat,                                                                                                                                     
            tanggal,                                                                                                                                     
            deskripsi,                                                                                                                                   
            is_active,                                                                                                                                   
            updated_at: new Date().toISOString(),                                                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        if (gambarFile && gambarFile.size > 0 && gambarFile.name) {                                                                                      
            updatePayload.gambar_url = await uploadGambarPenghargaan(gambarFile)                                                                         
        }                                                                                                                                                
                                                                                                                                                         
        const { error } = await supabase                                                                                                                 
            .from("penghargaan")                                                                                                                         
            .update(updatePayload)                                                                                                                       
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal memperbarui penghargaan: ${error.message}`)                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/penghargaan")                                                                                                             
        revalidatePath("/penghargaan")                                                                                                                   
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                 