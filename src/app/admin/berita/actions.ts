"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Toggle status publikasi berita antara 'published' <-> 'draft'
 */
export async function toggleBeritaStatus(id: string, currentStatus: string) {
    const supabase = await createClient()
    const nextStatus = currentStatus === "published" ? "draft" : "published"

    const updatePayload: { status: string; published_at?: string | null } = {
        status: nextStatus,
    }

    if (nextStatus === "published") {
        updatePayload.published_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from("berita")
        .update(updatePayload)
        .eq("id", id)
    
    if (error) {
        throw new Error(`Gagal mengubah status berita: ${error.message}`)
    }

    revalidatePath("/admin/berita")
    revalidatePath("/admin")
    revalidatePath("/berita")
    revalidatePath("/")

    return { success: true, status: nextStatus }
}

/**
 * Hapus beria beserta relasi komentar terkait
 */
export async function deleteBerita(id: string) {
    const supabase = await createClient()

    // 1. Hapus komentar terkait terlebih dahulu untuk menjaga integritas data
    await supabase.from("komentar").delete().eq("berita_id", id)

    // 2. Hapus data berita utama
    const { error } = await supabase.from("berita").delete().eq("id", id)

    if (error) {
        throw new Error(`Gagal menghapus berita: ${error.message}`)
    }

    revalidatePath("/admin/berita")
    revalidatePath("/admin")
    revalidatePath("/berita")
    revalidatePath("/")

    return { success: true }
}

/**                                                                                                                                                  
     * Helper generator slug dari judul                                                                                                                  
     */                                                                                                                                                  
    function generateSlug(text: string): string {                                                                                                        
        return text                                                                                                                                      
            .toLowerCase()                                                                                                                               
            .trim()                                                                                                                                      
            .replace(/[^\w\s-]/g, "")                                                                                                                    
            .replace(/[\s_-]+/g, "-")                                                                                                                    
            .replace(/^-+|-+$/g, "")                                                                                                                     
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Helper upload cover berita ke Supabase Storage (bucket berita-images)                                                                             
     */                                                                                                                                                  
    async function uploadGambarBerita(file: File): Promise<string> {                                                                                     
        const supabase = await createClient()                                                                                                            
        const ext = file.name.split(".").pop() || "jpg"                                                                                                  
        const fileName = `berita-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`                                                     
                                                                                                                                                         
        const { error: uploadError } = await supabase.storage                                                                                            
            .from("berita-images")                                                                                                                       
            .upload(fileName, file, { cacheControl: "3600", upsert: false })                                                                             
                                                                                                                                                         
        if (uploadError) {                                                                                                                               
            throw new Error(`Gagal mengunggah gambar cover: ${uploadError.message}`)                                                                     
        }                                                                                                                                                
                                                                                                                                                         
        const { data: { publicUrl } } = supabase.storage                                                                                                 
            .from("berita-images")                                                                                                                       
            .getPublicUrl(fileName)                                                                                                                      
                                                                                                                                                         
        return publicUrl                                                                                                                                 
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Tambah berita baru                                                                                                                 
     */                                                                                                                                                  
    export async function createBerita(formData: FormData) {                                                                                             
        const supabase = await createClient()                                                                                                            
        const { data: { user } } = await supabase.auth.getUser()                                                                                         
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const slugCustom = (formData.get("slug") as string)?.trim()                                                                                      
        const ringkasan = (formData.get("ringkasan") as string)?.trim() || null                                                                          
        const isi = (formData.get("isi") as string)?.trim()                                                                                              
        const kategoriIdRaw = formData.get("kategori_id") as string                                                                                      
        const status = (formData.get("status") as string) || "draft"                                                                                     
        const gambarFile = formData.get("gambar") as File | null                                                                                         
                                                                                                                                                         
        if (!judul || !isi) {                                                                                                                            
            return { error: "Judul dan isi berita wajib diisi." }                                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        let slug = slugCustom ? generateSlug(slugCustom) : generateSlug(judul)                                                                           
                                                                                                                                                         
        // Pastikan keunikan slug                                                                                                                        
        const { data: existingSlug } = await supabase                                                                                                    
            .from("berita")                                                                                                                              
            .select("id")                                                                                                                                
            .eq("slug", slug)                                                                                                                            
            .maybeSingle()                                                                                                                               
                                                                                                                                                         
        if (existingSlug) {                                                                                                                              
            slug = `${slug}-${Date.now().toString().slice(-4)}`                                                                                          
        }                                                                                                                                                
                                                                                                                                                         
        let gambarUrl: string | null = null                                                                                                              
        if (gambarFile && gambarFile.size > 0 && gambarFile.name) {                                                                                      
            try {                                                                                                                                        
                gambarUrl = await uploadGambarBerita(gambarFile)                                                                                         
            } catch (err) {                                                                                                                              
                return { error: err instanceof Error ? err.message : "Gagal upload gambar" }                                                             
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const kategoriId = kategoriIdRaw ? parseInt(kategoriIdRaw, 10) : null                                                                            
                                                                                                                                                         
        const { data, error } = await supabase                                                                                                           
            .from("berita")                                                                                                                              
            .insert({                                                                                                                                    
                judul,                                                                                                                                   
                slug,                                                                                                                                    
                ringkasan,                                                                                                                               
                isi,                                                                                                                                     
                gambar_url: gambarUrl,                                                                                                                   
                kategori_id: isNaN(kategoriId as number) ? null : kategoriId,                                                                            
                penulis_id: user?.id || null,                                                                                                            
                status,                                                                                                                                  
                published_at: status === "published" ? new Date().toISOString() : null,                                                                  
            })                                                                                                                                           
            .select("id, slug")                                                                                                                          
            .single()                                                                                                                                    
                                                                                                                                                         
        if (error) {                                                                                                                                     
            return { error: `Gagal menyimpan berita: ${error.message}` }                                                                                 
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/berita")                                                                                                                  
        revalidatePath("/admin")                                                                                                                         
        revalidatePath("/berita")                                                                                                                        
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true, id: data.id, slug: data.slug }                                                                                           
    }                                                                                                                                                    
                                                                                                                                                         
    /**                                                                                                                                                  
     * Server action: Perbarui berita yang sudah ada                                                                                                     
     */                                                                                                                                                  
    export async function updateBerita(id: string, formData: FormData) {                                                                                 
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        const judul = (formData.get("judul") as string)?.trim()                                                                                          
        const slugCustom = (formData.get("slug") as string)?.trim()                                                                                      
        const ringkasan = (formData.get("ringkasan") as string)?.trim() || null                                                                          
        const isi = (formData.get("isi") as string)?.trim()                                                                                              
        const kategoriIdRaw = formData.get("kategori_id") as string                                                                                      
        const status = (formData.get("status") as string) || "draft"                                                                                     
        const gambarFile = formData.get("gambar") as File | null                                                                                         
        const existingGambarUrl = (formData.get("existing_gambar_url") as string) || null                                                                
                                                                                                                                                         
        if (!judul || !isi) {                                                                                                                            
            return { error: "Judul dan isi berita wajib diisi." }                                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        const slug = slugCustom ? generateSlug(slugCustom) : generateSlug(judul)                                                                         
                                                                                                                                                         
        let gambarUrl = existingGambarUrl                                                                                                                
        if (gambarFile && gambarFile.size > 0 && gambarFile.name) {                                                                                      
            try {                                                                                                                                        
                gambarUrl = await uploadGambarBerita(gambarFile)                                                                                         
            } catch (err) {                                                                                                                              
                return { error: err instanceof Error ? err.message : "Gagal upload gambar baru" }                                                        
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const kategoriId = kategoriIdRaw ? parseInt(kategoriIdRaw, 10) : null                                                                            
                                                                                                                                                         
        const payload: {                                                                                                                                 
            judul: string                                                                                                                                
            slug: string                                                                                                                                 
            ringkasan: string | null                                                                                                                     
            isi: string                                                                                                                                  
            gambar_url: string | null                                                                                                                    
            kategori_id: number | null                                                                                                                   
            status: string                                                                                                                               
            updated_at: string                                                                                                                           
            published_at?: string | null                                                                                                                 
        } = {                                                                                                                                            
            judul,                                                                                                                                       
            slug,                                                                                                                                        
            ringkasan,                                                                                                                                   
            isi,                                                                                                                                         
            gambar_url: gambarUrl,                                                                                                                       
            kategori_id: isNaN(kategoriId as number) ? null : kategoriId,                                                                                
            status,                                                                                                                                      
            updated_at: new Date().toISOString(),                                                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        if (status === "published") {                                                                                                                    
            const { data: current } = await supabase                                                                                                     
                .from("berita")                                                                                                                          
                .select("published_at")                                                                                                                  
                .eq("id", id)                                                                                                                            
                .single()                                                                                                                                
                                                                                                                                                         
            if (!current?.published_at) {                                                                                                                
                payload.published_at = new Date().toISOString()                                                                                          
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const { error } = await supabase                                                                                                                 
            .from("berita")                                                                                                                              
            .update(payload)                                                                                                                             
            .eq("id", id)                                                                                                                                
                                                                                                                                                         
        if (error) {                                                                                                                                     
            return { error: `Gagal memperbarui berita: ${error.message}` }                                                                               
        }                                                                                                                                                
                                                                                                                                                         
        revalidatePath("/admin/berita")                                                                                                                  
        revalidatePath("/admin")                                                                                                                         
        revalidatePath(`/berita/${slug}`)                                                                                                                
        revalidatePath("/berita")                                                                                                                        
        revalidatePath("/")                                                                                                                              
                                                                                                                                                         
        return { success: true }                                                                                                                         
    }                              