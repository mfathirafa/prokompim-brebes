"use server"                                                                                                                                         
                                                                                                                                                         
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { revalidatePath } from "next/cache"                                                                                                          
    import { STORAGE_BUCKETS } from "@/lib/constants"                                                                                                    
                                                                                                                                                         
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB per foto                                                                                              
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]                                                                                
                                                                                                                                                         
    /**                                                                                                                                                  
     * Helper upload foto liputan ke Supabase Storage                                                                                                    
     */                                                                                                                                                  
    async function uploadFoto(file: File, prefix = "liputan"): Promise<string> {                                                                         
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        if (file.size > MAX_IMAGE_SIZE) {                                                                                                                
            throw new Error("Ukuran foto maksimal 5 MB.")                                                                                                
        }                                                                                                                                                
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {                                                                                                  
            throw new Error("Format foto harus JPG, PNG, atau WebP.")                                                                                    
        }                                                                                                                                                
                                                                                                                                                         
        const ext = file.name.split(".").pop() || "jpg"                                                                                                  
        const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`                                                  
                                                                                                                                                         
        const { error: uploadError } = await supabase.storage                                                                                            
            .from(STORAGE_BUCKETS.LIPUTAN)                                                                                                               
            .upload(fileName, file, { cacheControl: "3600", upsert: false })                                                                             
                                                                                                                                                         
        if (uploadError) {                                                                                                                               
            throw new Error(`Gagal mengunggah foto: ${uploadError.message}`)                                                                             
        }                                                                                                                                                
                                                                                                                                                         
        const {                                                                                                                                          
            data: { publicUrl },                                                                                                                         
        } = supabase.storage.from(STORAGE_BUCKETS.LIPUTAN).getPublicUrl(fileName)                                                                        
                                                                                                                                                         
        return publicUrl                                                                                                                                 
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Toggle status aktif/nonaktif album liputan                                                                                                        
     */                                                                                                                                                  
    export async function toggleLiputanStatus(id: string, currentStatus: boolean) {                                                                      
        const supabase = await createClient()                                                                                                            
        const nextStatus = !currentStatus                                                                                                                
                                                                                                                                                         
        const { error } = await supabase                                                                                                                 
            .from("liputan")                                                                                                                             
            .update({                                                                                                                                    
                is_active: nextStatus,                                                                                                                   
                updated_at: new Date().toISOString(),                                                                                                    
            })                                                                                                                                           
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal mengubah status liputan: ${error.message}`)                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/liputan")                                                                                                                 
        revalidatePath("/liputan")                                                                                                                       
        revalidatePath(`/liputan/${id}`)                                                                                                                 
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true, is_active: nextStatus }                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Hapus album liputan beserta seluruh foto galeri di storage dan database                                                                           
     */                                                                                                                                                  
    export async function deleteLiputan(id: string) {                                                                                                    
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // 1. Ambil data cover album                                                                                                                     
        const { data: album } = await supabase                                                                                                           
            .from("liputan")                                                                                                                             
            .select("cover_url")                                                                                                                         
            .eq("id", id)                                                                                                                                
            .single()                                                                                                                                    
                                                                                                                                                         
        // 2. Ambil seluruh data foto galeri terkait                                                                                                     
        const { data: fotos } = await supabase                                                                                                           
            .from("foto_liputan")                                                                                                                        
            .select("gambar_url")                                                                                                                        
            .eq("liputan_id", id)                                                                                                                        
                                                                                                                                                         
        // 3. Hapus foto dari storage                                                                                                                    
        const filesToDelete: string[] = []                                                                                                               
        if (album?.cover_url) {                                                                                                                          
            const coverName = album.cover_url.split("/").pop()                                                                                           
            if (coverName) filesToDelete.push(coverName)                                                                                                 
        }                                                                                                                                                
        if (fotos && fotos.length > 0) {                                                                                                                 
            for (const item of fotos) {                                                                                                                  
                const fileName = item.gambar_url.split("/").pop()                                                                                        
                if (fileName) filesToDelete.push(fileName)                                                                                               
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        if (filesToDelete.length > 0) {                                                                                                                  
            try {                                                                                                                                        
                await supabase.storage.from(STORAGE_BUCKETS.LIPUTAN).remove(filesToDelete)                                                               
            } catch {                                                                                                                                    
                // Lanjutkan jika file storage sudah bersih                                                                                              
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        // 4. Hapus foto_liputan dari tabel DB                                                                                                           
        await supabase.from("foto_liputan").delete().eq("liputan_id", id)                                                                                
                                                                                                                                                         
        // 5. Hapus album liputan utama                                                                                                                  
        const { error: deleteError } = await supabase.from("liputan").delete().eq("id", id)                                                              
                                                                                                                                                         
        if (deleteError) {                                                                                                                               
            throw new Error(`Gagal menghapus album liputan: ${deleteError.message}`)                                                                     
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/liputan")                                                                                                                 
        revalidatePath("/liputan")                                                                                                                       
        revalidatePath(`/liputan/${id}`)                                                                                                                 
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Hapus satu foto galeri spesifik                                                                                                                   
     */                                                                                                                                                  
    export async function deleteFotoLiputan(fotoId: string, liputanId: string) {                                                                         
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const { data: foto } = await supabase                                                                                                            
            .from("foto_liputan")                                                                                                                        
            .select("gambar_url")                                                                                                                        
            .eq("id", fotoId)                                                                                                                            
            .single()                                                                                                                                    
                                                                                                                                                         
        if (foto?.gambar_url) {                                                                                                                          
            const fileName = foto.gambar_url.split("/").pop()                                                                                            
            if (fileName) {                                                                                                                              
                try {                                                                                                                                    
                    await supabase.storage.from(STORAGE_BUCKETS.LIPUTAN).remove([fileName])                                                              
                } catch {                                                                                                                                
                    // Abaikan jika tidak ada di storage                                                                                                 
                }                                                                                                                                        
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const { error } = await supabase.from("foto_liputan").delete().eq("id", fotoId)                                                                  
        if (error) {                                                                                                                                     
            throw new Error(`Gagal menghapus foto galeri: ${error.message}`)                                                                             
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath(`/admin/liputan/${liputanId}/edit`)                                                                                               
        revalidatePath(`/liputan/${liputanId}`)                                                                                                          
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Tambah album liputan baru                                                                                                          
     */                                                                                                                                                  
    export async function createLiputan(formData: FormData) {                                                                                            
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const tanggal = (formData.get("tanggal") as string) || new Date().toISOString().split("T")[0]                                                    
        const deskripsi = (formData.get("deskripsi") as string)?.trim() || null                                                                          
        const is_active = formData.get("is_active") === "true"                                                                                           
        const coverFile = formData.get("cover") as File | null                                                                                           
        const extraFiles = formData.getAll("galeri") as File[]                                                                                           
                                                                                                                                                         
        if (!judul) {                                                                                                                                    
            throw new Error("Judul liputan wajib diisi.")                                                                                                
        }                                                                                                                                                
                                                                                                                                                         
        // 1. Upload cover jika ada                                                                                                                      
        let cover_url: string | null = null                                                                                                              
        if (coverFile && coverFile.size > 0 && coverFile.name) {                                                                                         
            cover_url = await uploadFoto(coverFile, "cover")                                                                                             
        }                                                                                                                                                
                                                                                                                                                         
        // 2. Insert album ke tabel liputan                                                                                                              
        const { data: newLiputan, error: insertError } = await supabase                                                                                  
            .from("liputan")                                                                                                                             
            .insert({                                                                                                                                    
                judul,                                                                                                                                   
                tanggal,                                                                                                                                 
                deskripsi,                                                                                                                               
                cover_url,                                                                                                                               
                is_active,                                                                                                                               
            })                                                                                                                                           
            .select("id")                                                                                                                                
            .single()                                                                                                                                    
                                                                                                                                                         
        if (insertError || !newLiputan) {                                                                                                                
            throw new Error(`Gagal membuat album liputan: ${insertError?.message}`)                                                                      
        }                                                                                                                                                
                                                                                                                                                         
        // 3. Upload multiple foto galeri jika ada                                                                                                       
        if (extraFiles && extraFiles.length > 0) {                                                                                                       
            let order = 1                                                                                                                                
            for (const file of extraFiles) {                                                                                                             
                if (file && file.size > 0 && file.name) {                                                                                                
                    try {                                                                                                                                
                        const galeriUrl = await uploadFoto(file, "galeri")                                                                               
                        await supabase.from("foto_liputan").insert({                                                                                     
                            liputan_id: newLiputan.id,                                                                                                   
                            gambar_url: galeriUrl,                                                                                                       
                            urutan: order++,                                                                                                             
                        })                                                                                                                               
                    } catch {                                                                                                                            
                        // Lanjutkan upload file berikutnya                                                                                              
                    }                                                                                                                                    
                }                                                                                                                                        
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/liputan")                                                                                                                 
        revalidatePath("/liputan")                                                                                                                       
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true, id: newLiputan.id }                                                                                                      
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Perbarui album liputan                                                                                                             
     */                                                                                                                                                  
    export async function updateLiputan(id: string, formData: FormData) {                                                                                
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const tanggal = (formData.get("tanggal") as string) || new Date().toISOString().split("T")[0]                                                    
        const deskripsi = (formData.get("deskripsi") as string)?.trim() || null                                                                          
        const is_active = formData.get("is_active") === "true"                                                                                           
        const coverFile = formData.get("cover") as File | null                                                                                           
        const extraFiles = formData.getAll("galeri") as File[]                                                                                           
                                                                                                                                                         
        if (!judul) {                                                                                                                                    
            throw new Error("Judul liputan wajib diisi.")                                                                                                
        }                                                                                                                                                
                                                                                                                                                         
        const updatePayload: {                                                                                                                           
            judul: string                                                                                                                                
            tanggal: string                                                                                                                              
            deskripsi: string | null                                                                                                                     
            is_active: boolean                                                                                                                           
            updated_at: string                                                                                                                           
            cover_url?: string                                                                                                                           
        } = {                                                                                                                                            
            judul,                                                                                                                                       
            tanggal,                                                                                                                                     
            deskripsi,                                                                                                                                   
            is_active,                                                                                                                                   
            updated_at: new Date().toISOString(),                                                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        // Ganti cover jika ada upload baru                                                                                                              
        if (coverFile && coverFile.size > 0 && coverFile.name) {                                                                                         
            updatePayload.cover_url = await uploadFoto(coverFile, "cover")                                                                               
        }                                                                                                                                                
                                                                                                                                                         
        const { error: updateError } = await supabase                                                                                                    
            .from("liputan")                                                                                                                             
            .update(updatePayload)                                                                                                                       
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (updateError) {                                                                                                                               
            throw new Error(`Gagal memperbarui album liputan: ${updateError.message}`)                                                                   
        }                                                                                                                                                
                                                                                                                                                         
        // Tambah foto galeri baru jika diunggah                                                                                                         
        if (extraFiles && extraFiles.length > 0) {                                                                                                       
            const { count } = await supabase                                                                                                             
                .from("foto_liputan")                                                                                                                    
                .select("*", { count: "exact", head: true })                                                                                             
                .eq("liputan_id", id)                                                                                                                    
                                                                                                                                                         
            let order = (count || 0) + 1                                                                                                                 
            for (const file of extraFiles) {                                                                                                             
                if (file && file.size > 0 && file.name) {                                                                                                
                    try {                                                                                                                                
                        const galeriUrl = await uploadFoto(file, "galeri")                                                                               
                        await supabase.from("foto_liputan").insert({                                                                                     
                            liputan_id: id,                                                                                                              
                            gambar_url: galeriUrl,                                                                                                       
                            urutan: order++,                                                                                                             
                        })                                                                                                                               
                    } catch {                                                                                                                            
                        // Lanjutkan file berikutnya                                                                                                     
                    }                                                                                                                                    
                }                                                                                                                                        
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/liputan")                                                                                                                 
        revalidatePath("/liputan")                                                                                                                       
        revalidatePath(`/liputan/${id}`)                                                                                                                 
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }              