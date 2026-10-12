"use client"                                                                                                                                         
                                                                                                                                                         
    import { useState, useTransition } from "react"                                                                                                      
    import { useRouter } from "next/navigation"                                                                                                          
    import Link from "next/link"                                                                                                                         
    import { createDownload, updateDownload } from "./actions"                                                                                           
    import { formatFileSize } from "@/lib/utils"                                                                                                         
    import {                                                                                                                                             
        ArrowLeft,                                                                                                                                       
        Loader2,                                                                                                                                         
        AlertCircle,                                                                                                                                     
        CheckCircle2,                                                                                                                                    
        UploadCloud,                                                                                                                                     
        FileText,                                                                                                                                        
        Download,                                                                                                                                        
        X,                                                                                                                                               
    } from "lucide-react"                                                                                                                                
                                                                                                                                                         
    interface KategoriDownloadItem {                                                                                                                     
        id: number                                                                                                                                       
        nama: string                                                                                                                                     
    }                                                                                                                                                    
                                                                                                                                                         
    interface DownloadFormProps {                                                                                                                        
        categories: KategoriDownloadItem[]                                                                                                               
        initialData?: {                                                                                                                                  
            id?: string                                                                                                                                  
            judul: string                                                                                                                                
            deskripsi: string | null                                                                                                                     
            kategori_id: number | null                                                                                                                   
            tanggal_kegiatan: string | null                                                                                                              
            file_name: string                                                                                                                            
            file_size: number | null                                                                                                                     
            file_type: string | null                                                                                                                     
            is_active: boolean                                                                                                                           
        }                                                                                                                                                
    }                                                                                                                                                    
                                                                                                                                                         
    export function DownloadForm({ categories, initialData }: DownloadFormProps) {                                                                       
        const router = useRouter()                                                                                                                       
        const isEdit = Boolean(initialData?.id)                                                                                                          
                                                                                                                                                         
        const [isPending, startTransition] = useTransition()                                                                                             
        const [errorMsg, setErrorMsg] = useState<string | null>(null)                                                                                    
        const [successMsg, setSuccessMsg] = useState<string | null>(null)                                                                                
                                                                                                                                                         
        // Form states                                                                                                                                   
        const [judul, setJudul] = useState(initialData?.judul || "")                                                                                     
        const [kategoriId, setKategoriId] = useState<string>(                                                                                            
            initialData?.kategori_id ? String(initialData.kategori_id) : (categories[0]?.id ? String(categories[0].id) : "")                             
        )                                                                                                                                                
        const [tanggalKegiatan, setTanggalKegiatan] = useState(                                                                                          
            initialData?.tanggal_kegiatan ? initialData.tanggal_kegiatan.split("T")[0] : ""                                                              
        )                                                                                                                                                
        const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "")                                                                         
        const [isActive, setIsActive] = useState(                                                                                                        
            initialData ? initialData.is_active : true                                                                                                   
        )                                                                                                                                                
        const [selectedFile, setSelectedFile] = useState<File | null>(null)                                                                              
                                                                                                                                                         
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {                                                                           
            const file = e.target.files?.[0]                                                                                                             
            if (!file) return                                                                                                                            
                                                                                                                                                         
            if (file.size > 25 * 1024 * 1024) {                                                                                                          
                setErrorMsg("Ukuran file melebihi batas maksimal 25 MB.")                                                                                
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            setSelectedFile(file)                                                                                                                        
            setErrorMsg(null)                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const handleRemoveFile = () => {                                                                                                                 
            setSelectedFile(null)                                                                                                                        
        }                                                                                                                                                
                                                                                                                                                         
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {                                                                            
            e.preventDefault()                                                                                                                           
            setErrorMsg(null)                                                                                                                            
            setSuccessMsg(null)                                                                                                                          
                                                                                                                                                         
            if (!judul.trim()) {                                                                                                                         
                setErrorMsg("Judul dokumen wajib diisi.")                                                                                                
                return                                                                                                                                   
            }                                                                                                                                            
            if (!isEdit && !selectedFile) {                                                                                                              
                setErrorMsg("Silakan pilih file dokumen untuk diunggah.")                                                                                
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            const formData = new FormData()                                                                                                              
            formData.append("judul", judul)                                                                                                              
            formData.append("kategori_id", kategoriId)                                                                                                   
            formData.append("tanggal_kegiatan", tanggalKegiatan)                                                                                         
            formData.append("deskripsi", deskripsi)                                                                                                      
            formData.append("is_active", String(isActive))                                                                                               
                                                                                                                                                         
            if (selectedFile) {                                                                                                                          
                formData.append("file", selectedFile)                                                                                                    
            }                                                                                                                                            
                                                                                                                                                         
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    if (isEdit && initialData?.id) {                                                                                                     
                        await updateDownload(initialData.id, formData)                                                                                   
                        setSuccessMsg("Dokumen unduhan berhasil diperbarui!")                                                                            
                    } else {                                                                                                                             
                        await createDownload(formData)                                                                                                   
                        setSuccessMsg("Dokumen baru berhasil ditambahkan dan diunggah!")                                                                 
                    }                                                                                                                                    
                                                                                                                                                         
                    setTimeout(() => {                                                                                                                   
                        router.push("/admin/download")                                                                                                   
                        router.refresh()                                                                                                                 
                    }, 1000)                                                                                                                             
                } catch (err) {                                                                                                                          
                    setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan sistem.")                                                        
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <div className="max-w-4xl mx-auto space-y-6">                                                                                                
                {/* Header Form */}                                                                                                                      
                <div className="flex items-center justify-between pb-4 border-b border-border">                                                          
                    <div className="flex items-center gap-3">                                                                                            
                        <Link                                                                                                                            
                            href="/admin/download"                                                                                                       
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"                      
                            title="Kembali ke Daftar Dokumen"                                                                                            
                        >                                                                                                                                
                            <ArrowLeft className="w-5 h-5" />                                                                                            
                        </Link>                                                                                                                          
                        <div>                                                                                                                            
                            <h2 className="text-xl font-bold tracking-tight text-foreground">                                                            
                                {isEdit ? "Edit Dokumen Unduhan" : "Tambah Dokumen Unduhan"}                                                             
                            </h2>                                                                                                                        
                            <p className="text-xs text-muted-foreground">                                                                                
                                {isEdit                                                                                                                  
                                    ? "Perbarui informasi atau ganti file dokumen resmi Prokompim."                                                      
                                    : "Unggah naskah sambutan, tata upacara, atau dokumen protokoler resmi baru."}                                       
                            </p>                                                                                                                         
                        </div>                                                                                                                           
                    </div>                                                                                                                               
                </div>                                                                                                                                   
                                                                                                                                                         
                {/* Alert Error / Success */}                                                                                                            
                {errorMsg && (                                                                                                                           
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3        
  animate-in fade-in">                                                                                                                                   
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />                                                                              
                        <span>{errorMsg}</span>                                                                                                          
                    </div>                                                                                                                               
                )}                                                                                                                                       
                {successMsg && (                                                                                                                         
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex    
  items-start gap-3 animate-in fade-in">                                                                                                                 
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />                                                                             
                        <span>{successMsg}</span>                                                                                                        
                    </div>                                                                                                                               
                )}                                                                                                                                       
                                                                                                                                                         
                {/* Form Utama */}                                                                                                                       
                <form onSubmit={handleSubmit} className="space-y-6">                                                                                     
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">                                                   
                        {/* Judul Dokumen */}                                                                                                            
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                               
                                Judul Dokumen <span className="text-destructive">*</span>                                                                
                            </label>                                                                                                                     
                            <input                                                                                                                       
                                type="text"                                                                                                              
                                required                                                                                                                 
                                placeholder="Contoh: Sambutan Bupati Brebes pada Peringatan Hari Jadi ke-348"                                            
                                value={judul}                                                                                                            
                                onChange={(e) => setJudul(e.target.value)}                                                                               
                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none  
  focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"                                              
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Kategori & Tanggal Kegiatan (2 Kolom) */}                                                                                    
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">                                                                          
                            <div className="space-y-1.5">                                                                                                
                                <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                           
                                    Kategori Dokumen                                                                                                     
                                </label>                                                                                                                 
                                <select                                                                                                                  
                                    value={kategoriId}                                                                                                   
                                    onChange={(e) => setKategoriId(e.target.value)}                                                                      
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-  
  none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"                                                                           
                                >                                                                                                                        
                                    {categories.map((cat) => (                                                                                           
                                        <option key={cat.id} value={cat.id}>                                                                             
                                            {cat.nama}                                                                                                   
                                        </option>                                                                                                        
                                    ))}                                                                                                                  
                                </select>                                                                                                                
                            </div>                                                                                                                       
                                                                                                                                                         
                            <div className="space-y-1.5">                                                                                                
                                <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                           
                                    Tanggal Terkait / Kegiatan                                                                                           
                                </label>                                                                                                                 
                                <input                                                                                                                   
                                    type="date"                                                                                                          
                                    value={tanggalKegiatan}                                                                                              
                                    onChange={(e) => setTanggalKegiatan(e.target.value)}                                                                 
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-  
  none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"                                                                           
                                />                                                                                                                       
                            </div>                                                                                                                       
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Area Upload File Dokumen */}                                                                                                 
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                               
                                File Dokumen {!isEdit && <span className="text-destructive">*</span>}                                                    
                            </label>                                                                                                                     
                                                                                                                                                         
                            {/* Tampilan File Eksisting (Jika mode edit) */}                                                                             
                            {isEdit && !selectedFile && initialData && (                                                                                 
                                <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between mb-2">               
                                    <div className="flex items-center gap-3">                                                                            
                                        <FileText className="w-5 h-5 text-primary shrink-0" />                                                           
                                        <div>                                                                                                            
                                            <p className="text-xs font-bold text-foreground truncate max-w-sm sm:max-w-md">                              
                                                {initialData.file_name}                                                                                  
                                            </p>                                                                                                         
                                            <p className="text-[10px] text-muted-foreground">                                                            
                                                Ukuran: {formatFileSize(initialData.file_size || 0)} • Format: {initialData.file_type?.toUpperCase()}    
                                            </p>                                                                                                         
                                        </div>                                                                                                           
                                    </div>                                                                                                               
                                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">                              
                                        File Saat Ini                                                                                                    
                                    </span>                                                                                                              
                                </div>                                                                                                                   
                            )}                                                                                                                           
                                                                                                                                                         
                            {/* File Baru Terpilih */}                                                                                                   
                            {selectedFile ? (                                                                                                            
                                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">               
                                    <div className="flex items-center gap-3">                                                                            
                                        <FileText className="w-5 h-5 text-primary shrink-0" />                                                           
                                        <div>                                                                                                            
                                            <p className="text-xs font-bold text-foreground truncate max-w-sm sm:max-w-md">                              
                                                {selectedFile.name}                                                                                      
                                            </p>                                                                                                         
                                            <p className="text-[10px] text-muted-foreground">                                                            
                                                {formatFileSize(selectedFile.size)}                                                                      
                                            </p>                                                                                                         
                                        </div>                                                                                                           
                                    </div>                                                                                                               
                                    <button                                                                                                              
                                        type="button"                                                                                                    
                                        onClick={handleRemoveFile}                                                                                       
                                        className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-  
  pointer"                                                                                                                                               
                                        title="Batalkan File"                                                                                            
                                    >                                                                                                                    
                                        <X className="w-4 h-4" />                                                                                        
                                    </button>                                                                                                            
                                </div>                                                                                                                   
                            ) : (                                                                                                                        
                                <label className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-6 flex    
  flex-col items-center justify-center gap-2 cursor-pointer bg-muted/20">                                                                                
                                    <UploadCloud className="w-8 h-8 text-muted-foreground" />                                                            
                                    <div className="text-center">                                                                                        
                                        <p className="text-xs font-bold text-foreground">                                                                
                                            {isEdit ? "Pilih file untuk menggantikan dokumen lama" : "Klik untuk mengunggah file dokumen"}               
                                        </p>                                                                                                             
                                        <p className="text-[11px] text-muted-foreground mt-0.5">                                                         
                                            Mendukung PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP (Maksimal 25 MB)                                         
                                        </p>                                                                                                             
                                    </div>                                                                                                               
                                    <input                                                                                                               
                                        type="file"                                                                                                      
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"                                                              
                                        onChange={handleFileChange}                                                                                      
                                        className="hidden"                                                                                               
                                    />                                                                                                                   
                                </label>                                                                                                                 
                            )}                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Deskripsi Dokumen */}                                                                                                        
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                               
                                Deskripsi / Keterangan Dokumen                                                                                           
                            </label>                                                                                                                     
                            <textarea                                                                                                                    
                                rows={3}                                                                                                                 
                                placeholder="Tuliskan ringkasan isi dokumen, tujuan penerbitan, atau catatan lainnya..."                                 
                                value={deskripsi}                                                                                                        
                                onChange={(e) => setDeskripsi(e.target.value)}                                                                           
                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none  
  focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground resize-y"                                     
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Switch Status Aktif */}                                                                                                      
                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">                                               
                            <div>                                                                                                                        
                                <p className="text-xs font-bold text-foreground">Status Akses Dokumen</p>                                                
                                <p className="text-[11px] text-muted-foreground">                                                                        
                                    Tampilkan dokumen ini di halaman publik (/download) agar dapat diunduh pengguna.                                     
                                </p>                                                                                                                     
                            </div>                                                                                                                       
                            <label className="relative inline-flex items-center cursor-pointer">                                                         
                                <input                                                                                                                   
                                    type="checkbox"                                                                                                      
                                    checked={isActive}                                                                                                   
                                    onChange={(e) => setIsActive(e.target.checked)}                                                                      
                                    className="sr-only peer"                                                                                             
                                />                                                                                                                       
                                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-    
  checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border        
  after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>                                                            
                            </label>                                                                                                                     
                        </div>                                                                                                                           
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Tombol Aksi Submit */}                                                                                                           
                    <div className="flex items-center justify-end gap-3">                                                                                
                        <Link                                                                                                                            
                            href="/admin/download"                                                                                                       
                            className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-      
  colors"                                                                                                                                                
                        >                                                                                                                                
                            Batal                                                                                                                        
                        </Link>                                                                                                                          
                        <button                                                                                                                          
                            type="submit"                                                                                                                
                            disabled={isPending}                                                                                                         
                            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all
  flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"                                                                                  
                        >                                                                                                                                
                            {isPending ? (                                                                                                               
                                <>                                                                                                                       
                                    <Loader2 className="w-4 h-4 animate-spin" />                                                                         
                                    <span>Mengunggah...</span>                                                                                           
                                </>                                                                                                                      
                            ) : (                                                                                                                        
                                <>                                                                                                                       
                                    <Download className="w-4 h-4" />                                                                                     
                                    <span>{isEdit ? "Simpan Perubahan" : "Terbitkan Dokumen"}</span>                                                     
                                </>                                                                                                                      
                            )}                                                                                                                           
                        </button>                                                                                                                        
                    </div>                                                                                                                               
                </form>                                                                                                                                  
            </div>                                                                                                                                       
        )                                                                                                                                                
    }                   