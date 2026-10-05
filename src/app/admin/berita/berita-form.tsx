"use client"                                                                                                                                         
                                                                                                                                                         
    import { useState, useTransition } from "react"                                                                                                      
    import { useRouter } from "next/navigation"                                                                                                          
    import Image from "next/image"                                                                                                                       
    import Link from "next/link"                                                                                                                         
    import { createBerita, updateBerita } from "./actions"                                                                                               
    import {                                                                                                                                             
        ArrowLeft,                                                                                                                                       
        UploadCloud,                                                                                                                                     
        Loader2,                                                                                                                                         
        X,                                                                                                                                               
        AlertCircle,                                                                                                                                     
        CheckCircle2,                                                                                                                                    
    } from "lucide-react"                                                                                                                                
                                                                                                                                                         
    interface KategoriItem {                                                                                                                             
        id: number                                                                                                                                       
        nama: string                                                                                                                                     
    }                                                                                                                                                    
                                                                                                                                                         
    interface BeritaFormProps {                                                                                                                          
        initialData?: {                                                                                                                                  
            id?: string                                                                                                                                  
            judul: string                                                                                                                                
            slug: string                                                                                                                                 
            ringkasan: string | null                                                                                                                     
            isi: string                                                                                                                                  
            gambar_url: string | null                                                                                                                    
            kategori_id: number | null                                                                                                                   
            status: string                                                                                                                               
        }                                                                                                                                                
        categories: KategoriItem[]                                                                                                                       
    }                                                                                                                                                    
                                                                                                                                                         
    export function BeritaForm({ initialData, categories }: BeritaFormProps) {                                                                           
        const router = useRouter()                                                                                                                       
        const isEdit = Boolean(initialData?.id)                                                                                                          
                                                                                                                                                         
        const [isPending, startTransition] = useTransition()                                                                                             
        const [errorMsg, setErrorMsg] = useState<string | null>(null)                                                                                    
        const [successMsg, setSuccessMsg] = useState<string | null>(null)                                                                                
                                                                                                                                                         
        // State input form                                                                                                                              
        const [judul, setJudul] = useState(initialData?.judul || "")                                                                                     
        const [slug, setSlug] = useState(initialData?.slug || "")                                                                                        
        const [kategoriId, setKategoriId] = useState<string>(                                                                                            
            initialData?.kategori_id ? String(initialData.kategori_id) : ""                                                                              
        )                                                                                                                                                
        const [status, setStatus] = useState<string>(initialData?.status || "published")                                                                 
        const [ringkasan, setRingkasan] = useState(initialData?.ringkasan || "")                                                                         
        const [isi, setIsi] = useState(initialData?.isi || "")                                                                                           
        const [previewImage, setPreviewImage] = useState<string | null>(                                                                                 
            initialData?.gambar_url || null                                                                                                              
        )                                                                                                                                                
        const [selectedFile, setSelectedFile] = useState<File | null>(null)                                                                              
                                                                                                                                                         
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {                                                                           
            const file = e.target.files?.[0]                                                                                                             
            if (!file) return                                                                                                                            
                                                                                                                                                         
            if (file.size > 5 * 1024 * 1024) {                                                                                                           
                setErrorMsg("Ukuran file maksimal 5 MB")                                                                                                 
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            setSelectedFile(file)                                                                                                                        
            const objectUrl = URL.createObjectURL(file)                                                                                                  
            setPreviewImage(objectUrl)                                                                                                                   
        }                                                                                                                                                
                                                                                                                                                         
        const handleRemoveImage = () => {                                                                                                                
            setSelectedFile(null)                                                                                                                        
            setPreviewImage(null)                                                                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {                                                                            
            e.preventDefault()                                                                                                                           
            setErrorMsg(null)                                                                                                                            
            setSuccessMsg(null)                                                                                                                          
                                                                                                                                                         
            if (!judul.trim()) {                                                                                                                         
                setErrorMsg("Judul berita wajib diisi.")                                                                                                 
                return                                                                                                                                   
            }                                                                                                                                            
            if (!isi.trim()) {                                                                                                                           
                setErrorMsg("Isi berita wajib diisi.")                                                                                                   
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            const formData = new FormData()                                                                                                              
            formData.append("judul", judul)                                                                                                              
            formData.append("slug", slug)                                                                                                                
            formData.append("kategori_id", kategoriId)                                                                                                   
            formData.append("status", status)                                                                                                            
            formData.append("ringkasan", ringkasan)                                                                                                      
            formData.append("isi", isi)                                                                                                                  
                                                                                                                                                         
            if (selectedFile) {                                                                                                                          
                formData.append("gambar", selectedFile)                                                                                                  
            } else if (previewImage) {                                                                                                                   
                formData.append("existing_gambar_url", previewImage)                                                                                     
            }                                                                                                                                            
                                                                                                                                                         
            startTransition(async () => {                                                                                                                
                if (isEdit && initialData?.id) {                                                                                                         
                    const res = await updateBerita(initialData.id, formData)                                                                             
                    if (res.error) {                                                                                                                     
                        setErrorMsg(res.error)                                                                                                           
                    } else {                                                                                                                             
                        setSuccessMsg("Berita berhasil diperbarui!")                                                                                     
                        setTimeout(() => {                                                                                                               
                            router.push("/admin/berita")                                                                                                 
                        }, 800)                                                                                                                          
                    }                                                                                                                                    
                } else {                                                                                                                                 
                    const res = await createBerita(formData)                                                                                             
                    if (res.error) {                                                                                                                     
                        setErrorMsg(res.error)                                                                                                           
                    } else {                                                                                                                             
                        setSuccessMsg("Berita berhasil dipublikasikan!")                                                                                 
                        setTimeout(() => {                                                                                                               
                            router.push("/admin/berita")                                                                                                 
                        }, 800)                                                                                                                          
                    }                                                                                                                                    
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <form onSubmit={handleSubmit} className="space-y-6">                                                                                         
                {/* Header navigasi & tombol submit */}                                                                                                  
                <div className="flex items-center justify-between">                                                                                      
                    <Link                                                                                                                                
                        href="/admin/berita"                                                                                                             
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors" 
                    >                                                                                                                                    
                        <ArrowLeft className="w-4 h-4" />                                                                                                
                        <span>Kembali ke Daftar Berita</span>                                                                                            
                    </Link>                                                                                                                              
                    <div className="flex items-center gap-2">                                                                                            
                        <button                                                                                                                          
                            type="button"                                                                                                                
                            onClick={() => router.push("/admin/berita")}                                                                                 
                            disabled={isPending}                                                                                                         
                            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"  
                        >                                                                                                                                
                            Batal                                                                                                                        
                        </button>                                                                                                                        
                        <button                                                                                                                          
                            type="submit"                                                                                                                
                            disabled={isPending}                                                                                                         
                            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90       
  transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"                                                                    
                        >                                                                                                                                
                            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}                                                              
                            <span>{isEdit ? "Simpan Perubahan" : "Publikasikan Berita"}</span>                                                           
                        </button>                                                                                                                        
                    </div>                                                                                                                               
                </div>                                                                                                                                   
                                                                                                                                                         
                {errorMsg && (                                                                                                                           
                    <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-     
  center gap-2">                                                                                                                                         
                        <AlertCircle className="w-4 h-4 shrink-0" />                                                                                     
                        <span>{errorMsg}</span>                                                                                                          
                    </div>                                                                                                                               
                )}                                                                                                                                       
                                                                                                                                                         
                {successMsg && (                                                                                                                         
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font- 
  medium flex items-center gap-2">                                                                                                                       
                        <CheckCircle2 className="w-4 h-4 shrink-0" />                                                                                    
                        <span>{successMsg}</span>                                                                                                        
                    </div>                                                                                                                               
                )}                                                                                                                                       
                                                                                                                                                         
                {/* Layout Grid Dua Kolom */}                                                                                                            
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">                                                                                  
                    {/* Kolom Kiri: Input Utama (2 Kolom) */}                                                                                            
                    <div className="lg:col-span-2 space-y-5 bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-xs">                              
                        {/* Judul Berita */}                                                                                                             
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground">                                                                        
                                Judul Berita <span className="text-destructive">*</span>                                                                 
                            </label>                                                                                                                     
                            <input                                                                                                                       
                                type="text"                                                                                                              
                                value={judul}                                                                                                            
                                onChange={(e) => setJudul(e.target.value)}                                                                               
                                placeholder="Contoh: Pj Bupati Brebes Tinjau Kesiapan Logistik Pilkada..."                                               
                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none      
  focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"                                                                               
                                required                                                                                                                 
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Slug */}                                                                                                                     
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground">                                                                        
                                Slug URL <span className="text-[10px] font-normal text-muted-foreground">(Otomatis dibuat jika dikosongkan)</span>       
                            </label>                                                                                                                     
                            <input                                                                                                                       
                                type="text"                                                                                                              
                                value={slug}                                                                                                             
                                onChange={(e) => setSlug(e.target.value)}                                                                                
                                placeholder="contoh-judul-berita-pj-bupati"                                                                              
                                className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border focus:outline-none focus:ring-2      
  focus:ring-primary/20 focus:border-primary text-foreground"                                                                                            
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Ringkasan */}                                                                                                                
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground">                                                                        
                                Ringkasan Singkat (Lead / Excerpt)                                                                                       
                            </label>                                                                                                                     
                            <textarea                                                                                                                    
                                value={ringkasan}                                                                                                        
                                onChange={(e) => setRingkasan(e.target.value)}                                                                           
                                rows={3}                                                                                                                 
                                placeholder="Tuliskan 1-2 kalimat ringkasan pengantar berita..."                                                         
                                className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border focus:outline-none focus:ring-2      
  focus:ring-primary/20 focus:border-primary text-foreground resize-y"                                                                                   
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Konten Isi Lengkap */}                                                                                                       
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground">                                                                        
                                Isi Lengkap Berita <span className="text-destructive">*</span>                                                           
                            </label>                                                                                                                     
                            <textarea                                                                                                                    
                                value={isi}                                                                                                              
                                onChange={(e) => setIsi(e.target.value)}                                                                                 
                                rows={12}                                                                                                                
                                placeholder="Tuliskan teks berita rilis selengkapnya di sini..."                                                         
                                className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 
  focus:ring-primary/20 focus:border-primary text-foreground resize-y leading-relaxed font-mono"                                                         
                                required                                                                                                                 
                            />                                                                                                                           
                        </div>                                                                                                                           
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Kolom Kanan: Pengaturan & Upload Cover (1 Kolom) */}                                                                             
                    <div className="space-y-5">                                                                                                          
                        {/* Status & Kategori */}                                                                                                        
                        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs space-y-4">                                               
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">                                                  
                                Pengaturan Berita                                                                                                        
                            </h3>                                                                                                                        
                                                                                                                                                         
                            {/* Status Publikasi */}                                                                                                     
                            <div className="space-y-1.5">                                                                                                
                                <label className="text-xs font-semibold text-foreground">                                                                
                                    Status Publikasi                                                                                                     
                                </label>                                                                                                                 
                                <select                                                                                                                  
                                    value={status}                                                                                                       
                                    onChange={(e) => setStatus(e.target.value)}                                                                          
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:outline-none focus:ring-2    
  focus:ring-primary/20 focus:border-primary text-foreground"                                                                                            
                                >                                                                                                                        
                                    <option value="published">Published (Tayang Publik)</option>                                                         
                                    <option value="draft">Draft (Disimpan Sementara)</option>                                                            
                                </select>                                                                                                                
                            </div>                                                                                                                       
                                                                                                                                                         
                            {/* Kategori */}                                                                                                             
                            <div className="space-y-1.5">                                                                                                
                                <label className="text-xs font-semibold text-foreground">                                                                
                                    Kategori Berita                                                                                                      
                                </label>                                                                                                                 
                                <select                                                                                                                  
                                    value={kategoriId}                                                                                                   
                                    onChange={(e) => setKategoriId(e.target.value)}                                                                      
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:outline-none focus:ring-2    
  focus:ring-primary/20 focus:border-primary text-foreground"                                                                                            
                                >                                                                                                                        
                                    <option value="">-- Pilih Kategori --</option>                                                                       
                                    {categories.map((c) => (                                                                                             
                                        <option key={c.id} value={c.id}>                                                                                 
                                            {c.nama}                                                                                                     
                                        </option>                                                                                                        
                                    ))}                                                                                                                  
                                </select>                                                                                                                
                            </div>                                                                                                                       
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Upload Cover */}                                                                                                             
                        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs space-y-3">                                               
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">                                                  
                                Gambar Cover Berita                                                                                                      
                            </h3>                                                                                                                        
                                                                                                                                                         
                            {previewImage ? (                                                                                                            
                                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border group bg-muted">            
                                    <Image                                                                                                               
                                        src={previewImage}                                                                                               
                                        alt="Pratinjau Cover"                                                                                            
                                        fill                                                                                                             
                                        className="object-cover"                                                                                         
                                    />                                                                                                                   
                                    <button                                                                                                              
                                        type="button"                                                                                                    
                                        onClick={handleRemoveImage}                                                                                      
                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors    
  cursor-pointer"                                                                                                                                        
                                        title="Hapus gambar"                                                                                             
                                    >                                                                                                                    
                                        <X className="w-4 h-4" />                                                                                        
                                    </button>                                                                                                            
                                </div>                                                                                                                   
                            ) : (                                                                                                                        
                                <label className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-    
  center cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors">                                                                    
                                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />                                                       
                                    <span className="text-xs font-semibold text-foreground">                                                             
                                        Unggah Gambar Cover                                                                                              
                                    </span>                                                                                                              
                                    <span className="text-[10px] text-muted-foreground mt-0.5">                                                          
                                        PNG, JPG, WEBP hingga 5MB                                                                                        
                                    </span>                                                                                                              
                                    <input                                                                                                               
                                        type="file"                                                                                                      
                                        accept="image/*"                                                                                                 
                                        onChange={handleFileChange}                                                                                      
                                        className="hidden"                                                                                               
                                    />                                                                                                                   
                                </label>                                                                                                                 
                            )}                                                                                                                           
                        </div>                                                                                                                           
                    </div>                                                                                                                               
                </div>                                                                                                                                   
            </form>                                                                                                                                      
        )                                                                                                                                                
    }   