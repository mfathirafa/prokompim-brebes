                                                                                                                                                     
    "use client"                                                                                                                                         
                                                                                                                                                         
    import { useState, useTransition } from "react"                                                                                                      
    import { useRouter } from "next/navigation"                                                                                                          
    import Link from "next/link"                                                                                                                         
    import Image from "next/image"                                                                                                                       
    import { createLiputan, updateLiputan, deleteFotoLiputan } from "./actions"                                                                          
    import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, UploadCloud, X, Camera, Trash2 } from "lucide-react"                                         
                                                                                                                                                         
    interface ExistingFoto {                                                                                                                             
        id: string                                                                                                                                       
        gambar_url: string                                                                                                                               
        keterangan?: string | null                                                                                                                       
        urutan?: number | null                                                                                                                           
    }                                                                                                                                                    
                                                                                                                                                         
    interface LiputanFormProps {                                                                                                                         
        initialData?: {                                                                                                                                  
            id?: string                                                                                                                                  
            judul: string                                                                                                                                
            deskripsi: string | null                                                                                                                     
            tanggal: string                                                                                                                              
            cover_url: string | null                                                                                                                     
            is_active: boolean                                                                                                                           
        }                                                                                                                                                
        existingPhotos?: ExistingFoto[]                                                                                                                  
    }                                                                                                                                                    
                                                                                                                                                         
    export function LiputanForm({ initialData, existingPhotos = [] }: LiputanFormProps) {                                                                
        const router = useRouter()                                                                                                                       
        const isEdit = Boolean(initialData?.id)                                                                                                          
                                                                                                                                                         
        const [isPending, startTransition] = useTransition()                                                                                             
        const [errorMsg, setErrorMsg] = useState<string | null>(null)                                                                                    
        const [successMsg, setSuccessMsg] = useState<string | null>(null)                                                                                
                                                                                                                                                         
        // Form states                                                                                                                                   
        const [judul, setJudul] = useState(initialData?.judul || "")                                                                                     
        const [tanggal, setTanggal] = useState(                                                                                                          
            initialData?.tanggal ? initialData.tanggal.split("T")[0] : new Date().toISOString().split("T")[0]                                            
        )                                                                                                                                                
        const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "")                                                                         
        const [isActive, setIsActive] = useState(initialData ? initialData.is_active : true)                                                             
                                                                                                                                                         
        // Cover image state                                                                                                                             
        const [coverFile, setCoverFile] = useState<File | null>(null)                                                                                    
        const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.cover_url || null)                                                  
                                                                                                                                                         
        // Galeri multiple photos                                                                                                                        
        const [extraFiles, setExtraFiles] = useState<File[]>([])                                                                                         
        const [currentPhotos, setCurrentPhotos] = useState<ExistingFoto[]>(existingPhotos)                                                               
                                                                                                                                                         
        const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {                                                                          
            const file = e.target.files?.[0]                                                                                                             
            if (!file) return                                                                                                                            
                                                                                                                                                         
            if (file.size > 5 * 1024 * 1024) {                                                                                                           
                setErrorMsg("Ukuran cover maksimal 5 MB.")                                                                                               
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            setCoverFile(file)                                                                                                                           
            setCoverPreview(URL.createObjectURL(file))                                                                                                   
            setErrorMsg(null)                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const handleExtraFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {                                                                     
            if (!e.target.files) return                                                                                                                  
            const newFiles = Array.from(e.target.files)                                                                                                  
            setExtraFiles((prev) => [...prev, ...newFiles])                                                                                              
        }                                                                                                                                                
                                                                                                                                                         
        const handleRemoveExtraFile = (index: number) => {                                                                                               
            setExtraFiles((prev) => prev.filter((_, i) => i !== index))                                                                                  
        }                                                                                                                                                
                                                                                                                                                         
        const handleDeleteExistingPhoto = async (fotoId: string) => {                                                                                    
            if (!initialData?.id) return                                                                                                                 
            const confirmDelete = window.confirm("Hapus foto ini dari album?")                                                                           
            if (!confirmDelete) return                                                                                                                   
                                                                                                                                                         
            try {                                                                                                                                        
                await deleteFotoLiputan(fotoId, initialData.id)                                                                                          
                setCurrentPhotos((prev) => prev.filter((p) => p.id !== fotoId))                                                                          
            } catch (err) {                                                                                                                              
                alert(err instanceof Error ? err.message : "Gagal menghapus foto")                                                                       
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {                                                                            
            e.preventDefault()                                                                                                                           
            setErrorMsg(null)                                                                                                                            
            setSuccessMsg(null)                                                                                                                          
                                                                                                                                                         
            if (!judul.trim()) {                                                                                                                         
                setErrorMsg("Judul liputan wajib diisi.")                                                                                                
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            const formData = new FormData()                                                                                                              
            formData.append("judul", judul)                                                                                                              
            formData.append("tanggal", tanggal)                                                                                                          
            formData.append("deskripsi", deskripsi)                                                                                                      
            formData.append("is_active", String(isActive))                                                                                               
                                                                                                                                                         
            if (coverFile) {                                                                                                                             
                formData.append("cover", coverFile)                                                                                                      
            }                                                                                                                                            
                                                                                                                                                         
            for (const file of extraFiles) {                                                                                                             
                formData.append("galeri", file)                                                                                                          
            }                                                                                                                                            
                                                                                                                                                         
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    if (isEdit && initialData?.id) {                                                                                                     
                        await updateLiputan(initialData.id, formData)                                                                                    
                        setSuccessMsg("Album liputan berhasil diperbarui!")                                                                              
                    } else {                                                                                                                             
                        await createLiputan(formData)                                                                                                    
                        setSuccessMsg("Album liputan berhasil dibuat!")                                                                                  
                    }                                                                                                                                    
                                                                                                                                                         
                    setTimeout(() => {                                                                                                                   
                        router.push("/admin/liputan")                                                                                                    
                        router.refresh()                                                                                                                 
                    }, 1000)                                                                                                                             
                } catch (err) {                                                                                                                          
                    setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan sistem.")                                                        
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <div className="space-y-6 max-w-4xl mx-auto pb-12">                                                                                          
                {/* Top Navigation */}                                                                                                                   
                <div className="flex items-center justify-between">                                                                                      
                    <div className="flex items-center gap-3">                                                                                            
                        <Link                                                                                                                            
                            href="/admin/liputan"                                                                                                        
                            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-
  colors"                                                                                                                                                
                        >                                                                                                                                
                            <ArrowLeft className="w-5 h-5" />                                                                                            
                        </Link>                                                                                                                          
                        <div>                                                                                                                            
                            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">                                   
                                <Camera className="w-6 h-6 text-brand-sky" />                                                                            
                                {isEdit ? "Edit Album Liputan" : "Tambah Album Liputan Baru"}                                                            
                            </h1>                                                                                                                        
                            <p className="text-xs text-muted-foreground mt-0.5">                                                                         
                                {isEdit                                                                                                                  
                                    ? "Perbarui dokumentasi dan foto-foto liputan kegiatan"                                                              
                                    : "Dokumentasikan agenda protokoler dan kegiatan pimpinan Brebes"}                                                   
                            </p>                                                                                                                         
                        </div>                                                                                                                           
                    </div>                                                                                                                               
                </div>                                                                                                                                   
                                                                                                                                                         
                {/* Notification Alerts */}                                                                                                              
                {errorMsg && (                                                                                                                           
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm        
  animate-in fade-in">                                                                                                                                   
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />                                                                              
                        <p className="font-medium">{errorMsg}</p>                                                                                        
                    </div>                                                                                                                               
                )}                                                                                                                                       
                                                                                                                                                         
                {successMsg && (                                                                                                                         
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm        
  animate-in fade-in">                                                                                                                                   
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />                                                                             
                        <p className="font-medium">{successMsg}</p>                                                                                      
                    </div>                                                                                                                               
                )}                                                                                                                                       
                                                                                                                                                         
                {/* Formulir */}                                                                                                                         
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">                       
                    <div className="space-y-2">                                                                                                          
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                         
                            Judul Liputan Kegiatan <span className="text-destructive">*</span>                                                           
                        </label>                                                                                                                         
                        <input                                                                                                                           
                            type="text"                                                                                                                  
                            value={judul}                                                                                                                
                            onChange={(e) => setJudul(e.target.value)}                                                                                   
                            placeholder="Contoh: Liputan Upacara Peringatan Hari Jadi Kabupaten Brebes ke-348"                                           
                            required                                                                                                                     
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2          
  focus:ring-primary/20 focus:border-primary transition-all"                                                                                             
                        />                                                                                                                               
                    </div>                                                                                                                               
                                                                                                                                                         
                    <div className="space-y-2">                                                                                                          
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                         
                            Tanggal Kegiatan <span className="text-destructive">*</span>                                                                 
                        </label>                                                                                                                         
                        <input                                                                                                                           
                            type="date"                                                                                                                  
                            value={tanggal}                                                                                                              
                            onChange={(e) => setTanggal(e.target.value)}                                                                                 
                            required                                                                                                                     
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2          
  focus:ring-primary/20 focus:border-primary transition-all"                                                                                             
                        />                                                                                                                               
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Upload Cover */}                                                                                                                 
                    <div className="space-y-2">                                                                                                          
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                         
                            Foto Cover Utama                                                                                                             
                        </label>                                                                                                                         
                        {coverPreview ? (                                                                                                                
                            <div className="relative w-full max-w-md rounded-xl overflow-hidden border border-border aspect-video bg-muted">             
                                <Image src={coverPreview} alt="Preview cover" fill className="object-cover" />                                           
                                <button                                                                                                                  
                                    type="button"                                                                                                        
                                    onClick={() => {                                                                                                     
                                        setCoverFile(null)                                                                                               
                                        setCoverPreview(null)                                                                                            
                                    }}                                                                                                                   
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"     
                                >                                                                                                                        
                                    <X className="w-4 h-4" />                                                                                            
                                </button>                                                                                                                
                            </div>                                                                                                                       
                        ) : (                                                                                                                            
                            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-border hover:border-    
  primary/50 rounded-2xl cursor-pointer bg-background/50 hover:bg-muted/20 transition-all">                                                              
                                <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />                                                           
                                <p className="text-sm font-semibold text-foreground">Klik untuk upload cover album</p>                                   
                                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, atau WebP (Maks. 5 MB)</p>                                 
                                <input                                                                                                                   
                                    type="file"                                                                                                          
                                    accept="image/jpeg,image/png,image/webp"                                                                             
                                    onChange={handleCoverChange}                                                                                         
                                    className="hidden"                                                                                                   
                                />                                                                                                                       
                            </label>                                                                                                                     
                        )}                                                                                                                               
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Foto Galeri Eksisting (Hanya Mode Edit) */}                                                                                      
                    {isEdit && currentPhotos.length > 0 && (                                                                                             
                        <div className="space-y-3 pt-2">                                                                                                 
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                     
                                Foto Dokumentasi Saat Ini ({currentPhotos.length} Foto)                                                                  
                            </label>                                                                                                                     
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">                                                                      
                                {currentPhotos.map((foto) => (                                                                                           
                                    <div key={foto.id} className="relative aspect-video rounded-xl overflow-hidden border border-border group bg-muted"> 
                                        <Image src={foto.gambar_url} alt="Foto galeri" fill className="object-cover" />                                  
                                        <button                                                                                                          
                                            type="button"                                                                                                
                                            onClick={() => handleDeleteExistingPhoto(foto.id)}                                                           
                                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-destructive text-destructive-foreground opacity-0    
  group-hover:opacity-100 transition-opacity"                                                                                                            
                                            title="Hapus foto ini"                                                                                       
                                        >                                                                                                                
                                            <Trash2 className="w-3.5 h-3.5" />                                                                           
                                        </button>                                                                                                        
                                    </div>                                                                                                               
                                ))}                                                                                                                      
                            </div>                                                                                                                       
                        </div>                                                                                                                           
                    )}                                                                                                                                   
                                                                                                                                                         
                    {/* Tambah Foto Galeri Tambahan */}                                                                                                  
                    <div className="space-y-2">                                                                                                          
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                         
                            Unggah Foto Dokumentasi Galeri (Bisa Pilih Banyak)                                                                           
                        </label>                                                                                                                         
                        <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-border hover:border-        
  primary/50 rounded-2xl cursor-pointer bg-background/50 hover:bg-muted/20 transition-all">                                                              
                            <Camera className="w-7 h-7 text-muted-foreground mb-1.5" />                                                                  
                            <p className="text-xs font-semibold text-foreground">Pilih foto-foto dokumentasi pendukung</p>                               
                            <input                                                                                                                       
                                type="file"                                                                                                              
                                multiple                                                                                                                 
                                accept="image/jpeg,image/png,image/webp"                                                                                 
                                onChange={handleExtraFilesChange}                                                                                        
                                className="hidden"                                                                                                       
                            />                                                                                                                           
                        </label>                                                                                                                         
                                                                                                                                                         
                        {extraFiles.length > 0 && (                                                                                                      
                            <div className="flex flex-wrap gap-2 pt-2">                                                                                  
                                {extraFiles.map((file, idx) => (                                                                                         
                                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted text-xs border border-border">     
                                        <span className="truncate max-w-[150px]">{file.name}</span>                                                      
                                        <button                                                                                                          
                                            type="button"                                                                                                
                                            onClick={() => handleRemoveExtraFile(idx)}                                                                   
                                            className="text-muted-foreground hover:text-destructive"                                                     
                                        >                                                                                                                
                                            <X className="w-3 h-3" />                                                                                    
                                        </button>                                                                                                        
                                    </div>                                                                                                               
                                ))}                                                                                                                      
                            </div>                                                                                                                       
                        )}                                                                                                                               
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Deskripsi */}                                                                                                                    
                    <div className="space-y-2">                                                                                                          
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                         
                            Deskripsi / Narasi Liputan                                                                                                   
                        </label>                                                                                                                         
                        <textarea                                                                                                                        
                            rows={4}                                                                                                                     
                            value={deskripsi}                                                                                                            
                            onChange={(e) => setDeskripsi(e.target.value)}                                                                               
                            placeholder="Rincian informasi mengenai pelaksanaan kegiatan liputan..."                                                     
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2          
  focus:ring-primary/20 focus:border-primary transition-all resize-y"                                                                                    
                        />                                                                                                                               
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Toggle Status Aktif */}                                                                                                          
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">                                  
                        <div>                                                                                                                            
                            <p className="text-sm font-semibold text-foreground">Tampilkan ke Publik</p>                                                 
                            <p className="text-xs text-muted-foreground">                                                                                
                                Aktifkan agar album ini tampil di galeri liputan publik (/liputan).                                                      
                            </p>                                                                                                                         
                        </div>                                                                                                                           
                        <button                                                                                                                          
                            type="button"                                                                                                                
                            onClick={() => setIsActive(!isActive)}                                                                                       
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${                                               
                                isActive ? "bg-primary" : "bg-muted-foreground/30"                                                                       
                            }`}                                                                                                                          
                        >                                                                                                                                
                            <span                                                                                                                        
                                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${                                       
                                    isActive ? "left-6" : "left-1"                                                                                       
                                }`}                                                                                                                      
                            />                                                                                                                           
                        </button>                                                                                                                        
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Action Buttons */}                                                                                                               
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">                                                    
                        <Link                                                                                                                            
                            href="/admin/liputan"                                                                                                        
                            className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"               
                        >                                                                                                                                
                            Batal                                                                                                                        
                        </Link>                                                                                                                          
                        <button                                                                                                                          
                            type="submit"                                                                                                                
                            disabled={isPending}                                                                                                         
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg- 
  primary/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"                                                                             
                        >                                                                                                                                
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}                                                                  
                            {isEdit ? "Simpan Perubahan" : "Terbitkan Album"}                                                                            
                        </button>                                                                                                                        
                    </div>                                                                                                                               
                </form>                                                                                                                                  
            </div>                                                                                                                                       
        )                                                                                                                                                
    }                                                     