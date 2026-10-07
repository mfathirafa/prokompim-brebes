 "use server"                                                                                                                                         
                                                                                                                                                         
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { revalidatePath } from "next/cache"                                                                                                          
    import { STORAGE_BUCKETS } from "@/lib/constants"                                                                                                    
                                                                                                                                                         
    const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB                                                                                                      
    const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip"]                                                               
                                                                                                                                                         
    /**                                                                                                                                                  
     * Toggle status aktif/nonaktif file unduhan                                                                                                         
     */                                                                                                                                                  
    export async function toggleDownloadStatus(id: string, currentStatus: boolean) {                                                                     
        const supabase = await createClient()                                                                                                            
        const nextStatus = !currentStatus                                                                                                                
                                                                                                                                                         
        const { error } = await supabase                                                                                                                 
            .from("files_download")                                                                                                                      
            .update({                                                                                                                                    
                is_active: nextStatus,                                                                                                                   
                updated_at: new Date().toISOString(),                                                                                                    
            })                                                                                                                                           
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (error) {                                                                                                                                     
            throw new Error(`Gagal mengubah status dokumen: ${error.message}`)                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/download")                                                                                                                
        revalidatePath("/download")                                                                                                                      
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true, is_active: nextStatus }                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Hapus dokumen beserta file fisiknya di Supabase Storage                                                                                           
     */                                                                                                                                                  
    export async function deleteDownload(id: string) {                                                                                                   
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // 1. Ambil path file storage terlebih dahulu                                                                                                    
        const { data: fileRecord, error: fetchError } = await supabase                                                                                   
            .from("files_download")                                                                                                                      
            .select("file_url")                                                                                                                          
            .eq("id", id)                                                                                                                                
            .single()                                                                                                                                    
                                                                                                                                                         
        if (fetchError || !fileRecord) {                                                                                                                 
            throw new Error("Dokumen tidak ditemukan.")                                                                                                  
        }                                                                                                                                                
                                                                                                                                                         
        // 2. Hapus file fisik dari Supabase Storage jika ada                                                                                            
        if (fileRecord.file_url) {                                                                                                                       
            await supabase.storage                                                                                                                       
                .from(STORAGE_BUCKETS.DOWNLOAD)                                                                                                          
                .remove([fileRecord.file_url])                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        // 3. Hapus baris dari tabel files_download                                                                                                      
        const { error: deleteError } = await supabase                                                                                                    
            .from("files_download")                                                                                                                      
            .delete()                                                                                                                                    
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (deleteError) {                                                                                                                               
            throw new Error(`Gagal menghapus rekaman dokumen: ${deleteError.message}`)                                                                   
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/download")                                                                                                                
        revalidatePath("/download")                                                                                                                      
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Buat Signed URL untuk pratinjau dokumen dari panel admin                                                                                          
     */                                                                                                                                                  
    export async function getAdminDownloadUrl(id: string) {                                                                                              
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const { data: file, error } = await supabase                                                                                                     
            .from("files_download")                                                                                                                      
            .select("file_url")                                                                                                                          
            .eq("id", id)                                                                                                                                
            .single()                                                                                                                                    
                                                                                                                                                         
        if (error || !file) {                                                                                                                            
            throw new Error("File dokumen tidak ditemukan.")                                                                                             
        }                                                                                                                                                
                                                                                                                                                         
        const { data: signedData, error: signedError } = await supabase.storage                                                                          
            .from(STORAGE_BUCKETS.DOWNLOAD)                                                                                                              
            .createSignedUrl(file.file_url, 60)                                                                                                          
                                                                                                                                                         
        if (signedError || !signedData?.signedUrl) {                                                                                                     
            throw new Error("Gagal membuat link unduhan sementara.")                                                                                     
        }                                                                                                                                                
                                                                                                                                                         
        return { url: signedData.signedUrl }                                                                                                             
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Tambah dokumen unduhan baru                                                                                                        
     */                                                                                                                                                  
    export async function createDownload(formData: FormData) {                                                                                           
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const kategori_id = formData.get("kategori_id") ? Number(formData.get("kategori_id")) : null                                                     
        const tanggal_kegiatan = (formData.get("tanggal_kegiatan") as string) || null                                                                    
        const deskripsi = (formData.get("deskripsi") as string)?.trim() || null                                                                          
        const is_active = formData.get("is_active") === "true"                                                                                           
        const file = formData.get("file") as File | null                                                                                                 
                                                                                                                                                         
        if (!judul) {                                                                                                                                    
            throw new Error("Judul dokumen wajib diisi.")                                                                                                
        }                                                                                                                                                
        if (!file || file.size === 0) {                                                                                                                  
            throw new Error("File dokumen wajib diunggah.")                                                                                              
        }                                                                                                                                                
        if (file.size > MAX_FILE_SIZE) {                                                                                                                 
            throw new Error("Ukuran file melebihi batas maksimal 25 MB.")                                                                                
        }                                                                                                                                                
                                                                                                                                                         
        const ext = file.name.split(".").pop()?.toLowerCase() || ""                                                                                      
        if (!ALLOWED_EXTENSIONS.includes(ext)) {                                                                                                         
            throw new Error(`Format file .${ext} tidak didukung. Format yang diizinkan: ${ALLOWED_EXTENSIONS.join(", ")}`)                               
        }                                                                                                                                                
                                                                                                                                                         
        // 1. Upload file ke storage bucket 'download-files'                                                                                             
        const cleanFileName = file.name.replace(/[^\w\d.-]/g, "_")                                                                                       
        const storagePath = `${Date.now()}-${cleanFileName}`                                                                                             
                                                                                                                                                         
        const { error: uploadError } = await supabase.storage                                                                                            
            .from(STORAGE_BUCKETS.DOWNLOAD)                                                                                                              
            .upload(storagePath, file, { cacheControl: "3600", upsert: false })                                                                          
                                                                                                                                                         
        if (uploadError) {                                                                                                                               
            throw new Error(`Gagal mengunggah file ke storage: ${uploadError.message}`)                                                                  
        }                                                                                                                                                
                                                                                                                                                         
        // 2. Ambil user saat ini untuk 'uploaded_by'                                                                                                    
        const { data: { user } } = await supabase.auth.getUser()                                                                                         
                                                                                                                                                         
        // 3. Simpan rekaman dokumen ke tabel database                                                                                                   
        const { error: insertError } = await supabase.from("files_download").insert({                                                                    
            judul,                                                                                                                                       
            deskripsi,                                                                                                                                   
            kategori_id,                                                                                                                                 
            tanggal_kegiatan,                                                                                                                            
            file_name: file.name,                                                                                                                        
            file_url: storagePath,                                                                                                                       
            file_size: file.size,                                                                                                                        
            file_type: ext,                                                                                                                              
            download_count: 0,                                                                                                                           
            is_active,                                                                                                                                   
            uploaded_by: user?.id || null,                                                                                                               
        })                                                                                                                                               
                                                                                                                                                         
        if (insertError) {                                                                                                                               
            // Rollback: hapus file yang sudah terunggah di storage jika query database gagal                                                            
            await supabase.storage.from(STORAGE_BUCKETS.DOWNLOAD).remove([storagePath])                                                                  
            throw new Error(`Gagal menyimpan data dokumen: ${insertError.message}`)                                                                      
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/download")                                                                                                                
        revalidatePath("/download")                                                                                                                      
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Update metadata dan/atau ganti file dokumen                                                                                        
     */                                                                                                                                                  
    export async function updateDownload(id: string, formData: FormData) {                                                                               
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const kategori_id = formData.get("kategori_id") ? Number(formData.get("kategori_id")) : null                                                     
        const tanggal_kegiatan = (formData.get("tanggal_kegiatan") as string) || null                                                                    
        const deskripsi = (formData.get("deskripsi") as string)?.trim() || null                                                                          
        const is_active = formData.get("is_active") === "true"                                                                                           
        const newFile = formData.get("file") as File | null                                                                                              
                                                                                                                                                         
        if (!judul) {                                                                                                                                    
            throw new Error("Judul dokumen wajib diisi.")                                                                                                
        }                                                                                                                                                
                                                                                                                                                         
        // Ambil data file eksisting                                                                                                                     
        const { data: existingRecord, error: fetchError } = await supabase                                                                               
            .from("files_download")                                                                                                                      
            .select("file_url")                                                                                                                          
            .eq("id", id)                                                                                                                                
            .single()                                                                                                                                    
                                                                                                                                                         
        if (fetchError || !existingRecord) {                                                                                                             
            throw new Error("Dokumen yang ingin diedit tidak ditemukan.")                                                                                
        }                                                                                                                                                
                                                                                                                                                         
        const updatePayload: {                                                                                                                       
                judul: string                                                                                                                            
                kategori_id: number | null                                                                                                               
                tanggal_kegiatan: string | null                                                                                                          
                deskripsi: string | null                                                                                                                 
                is_active: boolean                                                                                                                       
                updated_at: string                                                                                                                       
                file_url?: string                                                                                                                        
                file_name?: string                                                                                                                       
                file_size?: number                                                                                                                       
                file_type?: string                                                                                                                       
            } = {                                                                                                                                        
                judul,                                                                                                                                   
                kategori_id,                                                                                                                             
                tanggal_kegiatan,                                                                                                                        
                deskripsi,                                                                                                                               
                is_active,                                                                                                                               
                updated_at: new Date().toISOString(),                                                                                                    
            }                                                                                                                                                         
                                                                                                                                                         
        let newStoragePath: string | null = null                                                                                                         
                                                                                                                                                         
        // Jika pengguna mengunggah file baru untuk menggantikan file lama                                                                               
        if (newFile && newFile.size > 0) {                                                                                                               
            if (newFile.size > MAX_FILE_SIZE) {                                                                                                          
                throw new Error("Ukuran file baru melebihi batas maksimal 25 MB.")                                                                       
            }                                                                                                                                            
                                                                                                                                                         
            const ext = newFile.name.split(".").pop()?.toLowerCase() || ""                                                                               
            if (!ALLOWED_EXTENSIONS.includes(ext)) {                                                                                                     
                throw new Error(`Format file .${ext} tidak didukung.`)                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            const cleanFileName = newFile.name.replace(/[^\w\d.-]/g, "_")                                                                                
            newStoragePath = `${Date.now()}-${cleanFileName}`                                                                                            
                                                                                                                                                         
            const { error: uploadError } = await supabase.storage                                                                                        
                .from(STORAGE_BUCKETS.DOWNLOAD)                                                                                                          
                .upload(newStoragePath, newFile, { cacheControl: "3600", upsert: false })                                                                
                                                                                                                                                         
            if (uploadError) {                                                                                                                           
                throw new Error(`Gagal mengunggah file baru: ${uploadError.message}`)                                                                    
            }                                                                                                                                            
                                                                                                                                                         
            updatePayload.file_url = newStoragePath                                                                                                      
            updatePayload.file_name = newFile.name                                                                                                       
            updatePayload.file_size = newFile.size                                                                                                       
            updatePayload.file_type = ext                                                                                                                
        }                                                                                                                                                
                                                                                                                                                         
        const { error: updateError } = await supabase                                                                                                    
            .from("files_download")                                                                                                                      
            .update(updatePayload)                                                                                                                       
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (updateError) {                                                                                                                               
            if (newStoragePath) {                                                                                                                        
                await supabase.storage.from(STORAGE_BUCKETS.DOWNLOAD).remove([newStoragePath])                                                           
            }                                                                                                                                            
            throw new Error(`Gagal memperbarui dokumen: ${updateError.message}`)                                                                         
        }                                                                                                                                                
                                                                                                                                                         
        // Hapus file lama dari storage jika berhasil digantikan dengan file baru                                                                        
        if (newStoragePath && existingRecord.file_url) {                                                                                                 
            await supabase.storage.from(STORAGE_BUCKETS.DOWNLOAD).remove([existingRecord.file_url])                                                      
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/download")                                                                                                                
        revalidatePath("/download")                                                                                                                      
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                                  