"use client"                                                                                                                                         
                                                                                                                                                         
    import { useState, useTransition } from "react"                                                                                                      
    import { useRouter } from "next/navigation"                                                                                                          
    import Link from "next/link"                                                                                                                         
    import Image from "next/image"                                                                                                                       
    import { createPenghargaan, updatePenghargaan } from "./actions"                                                                                     
    import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, UploadCloud, X, Trophy } from "lucide-react"                                                 
                                                                                                                                                         
    const TINGKAT_OPTIONS = [                                                                                                                            
        { value: "Nasional", label: "Nasional" },                                                                                                        
        { value: "Provinsi", label: "Provinsi" },                                                                                                        
        { value: "Kabupaten/Kota", label: "Kabupaten / Kota" },                                                                                          
        { value: "Internasional", label: "Internasional" },                                                                                              
    ]                                                                                                                                                    
                                                                                                                                                         
    interface PenghargaanFormProps {                                                                                                                     
        initialData?: {                                                                                                                                  
            id?: string                                                                                                                                  
            judul: string                                                                                                                                
            deskripsi: string | null                                                                                                                     
            instansi_pemberi: string                                                                                                                     
            penerima: string                                                                                                                             
            tingkat: string | null                                                                                                                       
            tanggal: string                                                                                                                              
            gambar_url: string | null                                                                                                                    
            is_active: boolean                                                                                                                           
        }                                                                                                                                                
    }                                                                                                                                                    
                                                                                                                                                         
    export function PenghargaanForm({ initialData }: PenghargaanFormProps) {                                                                             
        const router = useRouter()                                                                                                                       
        const isEdit = Boolean(initialData?.id)                                                                                                          
                                                                                                                                                         
        const [isPending, startTransition] = useTransition()                                                                                             
        const [errorMsg, setErrorMsg] = useState<string | null>(null)                                                                                    
        const [successMsg, setSuccessMsg] = useState<string | null>(null)                                                                                
                                                                                                                                                         
        // Form state                                                                                                                                    
        const [judul, setJudul] = useState(initialData?.judul || "")                                                                                     
        const [instansiPemberi, setInstansiPemberi] = useState(initialData?.instansi_pemberi || "")                                                      
        const [penerima, setPenerima] = useState(initialData?.penerima || "Pemerintah Kabupaten Brebes")                                                 
        const [tingkat, setTingkat] = useState(initialData?.tingkat || "Nasional")                                                                       
        const [tanggal, setTanggal] = useState(                                                                                                          
            initialData?.tanggal ? initialData.tanggal.split("T")[0] : new Date().toISOString().split("T")[0]                                            
        )                                                                                                                                                
        const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "")                                                                         
        const [isActive, setIsActive] = useState(initialData ? initialData.is_active : true)                                                             
                                                                                                                                                         
        // File gambar                                                                                                                                   
        const [selectedImage, setSelectedImage] = useState<File | null>(null)                                                                            
        const [imagePreview, setImagePreview] = useState<string | null>(initialData?.gambar_url || null)                                                 
                                                                                                                                                         
        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {                                                                          
            const file = e.target.files?.[0]                                                                                                             
            if (!file) return                                                                                                                            
                                                                                                                                                         
            if (file.size > 5 * 1024 * 1024) {                                                                                                           
                setErrorMsg("Ukuran foto penghargaan melebihi batas maksimal 5 MB.")                                                                     
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            setSelectedImage(file)                                                                                                                       
            setImagePreview(URL.createObjectURL(file))                                                                                                   
            setErrorMsg(null)                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const handleRemoveImage = () => {                                                                                                                
            setSelectedImage(null)                                                                                                                       
            setImagePreview(null)                                                                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {                                                                            
            e.preventDefault()                                                                                                                           
            setErrorMsg(null)                                                                                                                            
            setSuccessMsg(null)                                                                                                                          
                                                                                                                                                         
            if (!judul.trim()) {                                                                                                                         
                setErrorMsg("Nama penghargaan wajib diisi.")                                                                                             
                return                                                                                                                                   
            }                                                                                                                                            
            if (!instansiPemberi.trim()) {                                                                                                               
                setErrorMsg("Instansi pemberi penghargaan wajib diisi.")                                                                                 
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            const formData = new FormData()                                                                                                              
            formData.append("judul", judul)                                                                                                              
            formData.append("instansi_pemberi", instansiPemberi)                                                                                         
            formData.append("penerima", penerima)                                                                                                        
            formData.append("tingkat", tingkat)                                                                                                          
            formData.append("tanggal", tanggal)                                                                                                          
            formData.append("deskripsi", deskripsi)                                                                                                      
            formData.append("is_active", String(isActive))                                                                                               
                                                                                                                                                         
            if (selectedImage) {                                                                                                                         
                formData.append("gambar", selectedImage)                                                                                                 
            }                                                                                                                                            
                                                                                                                                                         
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    if (isEdit && initialData?.id) {                                                                                                     
                        await updatePenghargaan(initialData.id, formData)                                                                                
                        setSuccessMsg("Data penghargaan berhasil diperbarui!")                                                                           
                    } else {                                                                                                                             
                        await createPenghargaan(formData)                                                                                                
                        setSuccessMsg("Data penghargaan berhasil ditambahkan!")                                                                          
                    }                                                                                                                                    
                                                                                                                                                         
                    setTimeout(() => {                                                                                                                   
                        router.push("/admin/penghargaan")                                                                                                
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
                            href="/admin/penghargaan"                                                                                                    
                            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-
  colors"                                                                                                                                                
                        >                                                                                                                                
                            <ArrowLeft className="w-5 h-5" />                                                                                            
                        </Link>                                                                                                                          
                        <div>                                                                                                                            
                            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">                                   
                                <Trophy className="w-6 h-6 text-brand-gold" />                                                                           
                                {isEdit ? "Edit Penghargaan" : "Tambah Penghargaan Baru"}                                                                
                            </h1>                                                                                                                        
                            <p className="text-xs text-muted-foreground mt-0.5">                                                                         
                                {isEdit                                                                                                                  
                                    ? "Perbarui informasi dan dokumentasi prestasi daerah"                                                               
                                    : "Catat prestasi dan apresiasi yang diraih oleh Pemkab Brebes"}                                                     
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
                            Nama / Judul Penghargaan <span className="text-destructive">*</span>                                                         
                        </label>                                                                                                                         
                        <input                                                                                                                           
                            type="text"                                                                                                                  
                            value={judul}                                                                                                                
                            onChange={(e) => setJudul(e.target.value)}                                                                                   
                            placeholder="Contoh: Opini WTP ke-8 Atas Laporan Keuangan Pemerintah Daerah"                                                 
                            required                                                                                                                     
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2          
  focus:ring-primary/20 focus:border-primary transition-all"                                                                                             
                        />                                                                                                                               
                    </div>                                                                                                                               
                                                                                                                                                         
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">                                                                              
                        <div className="space-y-2">                                                                                                      
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                     
                                Instansi Pemberi <span className="text-destructive">*</span>                                                             
                            </label>                                                                                                                     
                            <input                                                                                                                       
                                type="text"                                                                                                              
                                value={instansiPemberi}                                                                                                  
                                onChange={(e) => setInstansiPemberi(e.target.value)}                                                                     
                                placeholder="Contoh: Badan Pemeriksa Keuangan (BPK) RI"                                                                  
                                required                                                                                                                 
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2      
  focus:ring-primary/20 focus:border-primary transition-all"                                                                                             
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        <div className="space-y-2">                                                                                                      
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                     
                                Penerima Penghargaan                                                                                                     
                            </label>                                                                                                                     
                            <input                                                                                                                       
                                type="text"                                                                                                              
                                value={penerima}                                                                                                         
                                onChange={(e) => setPenerima(e.target.value)}                                                                            
                                placeholder="Pemerintah Kabupaten Brebes"                                                                                
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2      
  focus:ring-primary/20 focus:border-primary transition-all"                                                                                             
                            />                                                                                                                           
                        </div>                                                                                                                           
                    </div>                                                                                                                               
                                                                                                                                                         
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">                                                                              
                        <div className="space-y-2">                                                                                                      
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                     
                                Tingkat Prestasi                                                                                                         
                            </label>                                                                                                                     
                            <select                                                                                                                      
                                value={tingkat}                                                                                                          
                                onChange={(e) => setTingkat(e.target.value)}                                                                             
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2      
  focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"                                                                              
                            >                                                                                                                            
                                {TINGKAT_OPTIONS.map((item) => (                                                                                         
                                    <option key={item.value} value={item.value}>                                                                         
                                        {item.label}                                                                                                     
                                    </option>                                                                                                            
                                ))}                                                                                                                      
                            </select>                                                                                                                    
                        </div>                                                                                                                           
                                                                                                                                                         
                        <div className="space-y-2">                                                                                                      
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                     
                                Tanggal Penganugerahan                                                                                                   
                            </label>                                                                                                                     
                            <input                                                                                                                       
                                type="date"                                                                                                              
                                value={tanggal}                                                                                                          
                                onChange={(e) => setTanggal(e.target.value)}                                                                             
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2      
  focus:ring-primary/20 focus:border-primary transition-all"                                                                                             
                            />                                                                                                                           
                        </div>                                                                                                                           
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Upload Foto / Piagam */}                                                                                                         
                    <div className="space-y-2">                                                                                                          
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                         
                            Dokumentasi Foto Piagam / Trofi (Opsional)                                                                                   
                        </label>                                                                                                                         
                        {imagePreview ? (                                                                                                                
                            <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-border aspect-video bg-muted">             
                                <Image                                                                                                                   
                                    src={imagePreview}                                                                                                   
                                    alt="Preview penghargaan"                                                                                            
                                    fill                                                                                                                 
                                    className="object-cover"                                                                                             
                                />                                                                                                                       
                                <button                                                                                                                  
                                    type="button"                                                                                                        
                                    onClick={handleRemoveImage}                                                                                          
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"     
                                >                                                                                                                        
                                    <X className="w-4 h-4" />                                                                                            
                                </button>                                                                                                                
                            </div>                                                                                                                       
                        ) : (                                                                                                                            
                            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-border hover:border-    
  primary/50 rounded-2xl cursor-pointer bg-background/50 hover:bg-muted/20 transition-all">                                                              
                                <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />                                                           
                                <p className="text-sm font-semibold text-foreground">Klik untuk upload foto</p>                                          
                                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, atau WebP (Maks. 5 MB)</p>                                 
                                <input                                                                                                                   
                                    type="file"                                                                                                          
                                    accept="image/jpeg,image/png,image/webp"                                                                             
                                    onChange={handleImageChange}                                                                                         
                                    className="hidden"                                                                                                   
                                />                                                                                                                       
                            </label>                                                                                                                     
                        )}                                                                                                                               
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Deskripsi */}                                                                                                                    
                    <div className="space-y-2">                                                                                                          
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">                                         
                            Deskripsi / Rincian Prestasi                                                                                                 
                        </label>                                                                                                                         
                        <textarea                                                                                                                        
                            rows={4}                                                                                                                     
                            value={deskripsi}                                                                                                            
                            onChange={(e) => setDeskripsi(e.target.value)}                                                                               
                            placeholder="Uraian singkat mengenai indikator penilaian atau latar belakang diraihnya penghargaan..."                       
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2          
  focus:ring-primary/20 focus:border-primary transition-all resize-y"                                                                                    
                        />                                                                                                                               
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Toggle Status Aktif */}                                                                                                          
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">                                  
                        <div>                                                                                                                            
                            <p className="text-sm font-semibold text-foreground">Tampilkan ke Publik</p>                                                 
                            <p className="text-xs text-muted-foreground">                                                                                
                                Aktifkan agar penghargaan ini muncul di halaman prestasi publik (/penghargaan).                                          
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
                            href="/admin/penghargaan"                                                                                                    
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
                            {isEdit ? "Simpan Perubahan" : "Terbitkan Penghargaan"}                                                                      
                        </button>                                                                                                                        
                    </div>                                                                                                                               
                </form>                                                                                                                                  
            </div>                                                                                                                                       
        )                                                                                                                                                
    }                       