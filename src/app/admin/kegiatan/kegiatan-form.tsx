"use client"                                                                                                                                         
                                                                                                                                                         
    import { useState, useTransition } from "react"                                                                                                      
    import { useRouter } from "next/navigation"                                                                                                          
    import Link from "next/link"                                                                                                                         
    import { createKegiatan, updateKegiatan } from "./actions"                                                                                           
    import {                                                                                                                                             
        ArrowLeft,                                                                                                                                       
        Loader2,                                                                                                                                         
        AlertCircle,                                                                                                                                     
        CheckCircle2,                                                                                                                                    
        Calendar,                                                                                                                                        
    } from "lucide-react"                                                                                                                                
                                                                                                                                                         
    const OPSI_JENIS = [                                                                                                                                 
        { value: "kegiatan_pimpinan", label: "Kegiatan Pimpinan" },                                                                                      
        { value: "upacara", label: "Upacara" },                                                                                                          
        { value: "hari_nasional", label: "Hari Nasional" },                                                                                              
        { value: "kegiatan", label: "Kegiatan Umum" },                                                                                                   
    ]                                                                                                                                                    
                                                                                                                                                         
    interface KegiatanFormProps {                                                                                                                        
        initialData?: {                                                                                                                                  
            id?: string                                                                                                                                  
            judul: string                                                                                                                                
            jenis: string                                                                                                                                
            lokasi: string | null                                                                                                                        
            pimpinan: string | null                                                                                                                      
            tanggal_mulai: string                                                                                                                        
            tanggal_selesai: string | null                                                                                                               
            deskripsi: string | null                                                                                                                     
            is_active: boolean                                                                                                                           
        }                                                                                                                                                
    }                                                                                                                                                    
                                                                                                                                                         
    export function KegiatanForm({ initialData }: KegiatanFormProps) {                                                                                   
        const router = useRouter()                                                                                                                       
        const isEdit = Boolean(initialData?.id)                                                                                                          
                                                                                                                                                         
        const [isPending, startTransition] = useTransition()                                                                                             
        const [errorMsg, setErrorMsg] = useState<string | null>(null)                                                                                    
        const [successMsg, setSuccessMsg] = useState<string | null>(null)                                                                                
                                                                                                                                                         
        // Form states                                                                                                                                   
        const [judul, setJudul] = useState(initialData?.judul || "")                                                                                     
        const [jenis, setJenis] = useState(initialData?.jenis || "kegiatan_pimpinan")                                                                    
        const [lokasi, setLokasi] = useState(initialData?.lokasi || "")                                                                                  
        const [pimpinan, setPimpinan] = useState(initialData?.pimpinan || "")                                                                            
        const [tanggalMulai, setTanggalMulai] = useState(                                                                                                
            initialData?.tanggal_mulai ? initialData.tanggal_mulai.split("T")[0] : ""                                                                    
        )                                                                                                                                                
        const [tanggalSelesai, setTanggalSelesai] = useState(                                                                                            
            initialData?.tanggal_selesai ? initialData.tanggal_selesai.split("T")[0] : ""                                                                
        )                                                                                                                                                
        const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "")                                                                         
        const [isActive, setIsActive] = useState(                                                                                                        
            initialData ? initialData.is_active : true                                                                                                   
        )                                                                                                                                                
                                                                                                                                                         
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {                                                                            
            e.preventDefault()                                                                                                                           
            setErrorMsg(null)                                                                                                                            
            setSuccessMsg(null)                                                                                                                          
                                                                                                                                                         
            if (!judul.trim()) {                                                                                                                         
                setErrorMsg("Judul kegiatan wajib diisi.")                                                                                               
                return                                                                                                                                   
            }                                                                                                                                            
            if (!tanggalMulai) {                                                                                                                         
                setErrorMsg("Tanggal mulai wajib diisi.")                                                                                                
                return                                                                                                                                   
            }                                                                                                                                            
                                                                                                                                                         
            const formData = new FormData()                                                                                                              
            formData.append("judul", judul)                                                                                                              
            formData.append("jenis", jenis)                                                                                                              
            formData.append("lokasi", lokasi)                                                                                                            
            formData.append("pimpinan", pimpinan)                                                                                                        
            formData.append("tanggal_mulai", tanggalMulai)                                                                                               
            formData.append("tanggal_selesai", tanggalSelesai)                                                                                           
            formData.append("deskripsi", deskripsi)                                                                                                      
            formData.append("is_active", String(isActive))                                                                                               
                                                                                                                                                         
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    if (isEdit && initialData?.id) {                                                                                                     
                        await updateKegiatan(initialData.id, formData)                                                                                   
                        setSuccessMsg("Kegiatan berhasil diperbarui!")                                                                                   
                    } else {                                                                                                                             
                        await createKegiatan(formData)                                                                                                   
                        setSuccessMsg("Kegiatan baru berhasil ditambahkan!")                                                                             
                    }                                                                                                                                    
                                                                                                                                                         
                    setTimeout(() => {                                                                                                                   
                        router.push("/admin/kegiatan")                                                                                                   
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
                            href="/admin/kegiatan"                                                                                                       
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"                      
                            title="Kembali ke Daftar Kegiatan"                                                                                           
                        >                                                                                                                                
                            <ArrowLeft className="w-5 h-5" />                                                                                            
                        </Link>                                                                                                                          
                        <div>                                                                                                                            
                            <h2 className="text-xl font-bold tracking-tight text-foreground">                                                            
                                {isEdit ? "Edit Agenda Kegiatan" : "Tambah Agenda Kegiatan"}                                                             
                            </h2>                                                                                                                        
                            <p className="text-xs text-muted-foreground">                                                                                
                                {isEdit                                                                                                                  
                                    ? "Perbarui informasi kegiatan resmi atau agenda pimpinan."                                                          
                                    : "Jadwalkan kegiatan resmi, upacara, atau agenda pimpinan baru."}                                                   
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
                        {/* Judul Kegiatan */}                                                                                                           
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                               
                                Judul Kegiatan <span className="text-destructive">*</span>                                                               
                            </label>                                                                                                                     
                            <input                                                                                                                       
                                type="text"                                                                                                              
                                required                                                                                                                 
                                placeholder="Contoh: Rapat Koordinasi Penanggulangan Kemiskinan Ekstrem"                                                 
                                value={judul}                                                                                                            
                                onChange={(e) => setJudul(e.target.value)}                                                                               
                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none  
  focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"                                              
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Jenis & Pimpinan (2 Kolom) */}                                                                                               
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">                                                                          
                            <div className="space-y-1.5">                                                                                                
                                <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                           
                                    Jenis Kegiatan                                                                                                       
                                </label>                                                                                                                 
                                <select                                                                                                                  
                                    value={jenis}                                                                                                        
                                    onChange={(e) => setJenis(e.target.value)}                                                                           
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-  
  none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"                                                                           
                                >                                                                                                                        
                                    {OPSI_JENIS.map((opsi) => (                                                                                          
                                        <option key={opsi.value} value={opsi.value}>                                                                     
                                            {opsi.label}                                                                                                 
                                        </option>                                                                                                        
                                    ))}                                                                                                                  
                                </select>                                                                                                                
                            </div>                                                                                                                       
                                                                                                                                                         
                            <div className="space-y-1.5">                                                                                                
                                <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                           
                                    Pimpinan / Pejabat Hadir                                                                                             
                                </label>                                                                                                                 
                                <input                                                                                                                   
                                    type="text"                                                                                                          
                                    placeholder="Contoh: Pj. Bupati Brebes / Sekda Kab. Brebes"                                                          
                                    value={pimpinan}                                                                                                     
                                    onChange={(e) => setPimpinan(e.target.value)}                                                                        
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-  
  none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"                                         
                                />                                                                                                                       
                            </div>                                                                                                                       
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Lokasi */}                                                                                                                   
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                               
                                Lokasi Pelaksanaan                                                                                                       
                            </label>                                                                                                                     
                            <input                                                                                                                       
                                type="text"                                                                                                              
                                placeholder="Contoh: Pendopo Kabupaten Brebes / KPT Brebes Lt. 5"                                                        
                                value={lokasi}                                                                                                           
                                onChange={(e) => setLokasi(e.target.value)}                                                                              
                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none  
  focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"                                              
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Tanggal Mulai & Tanggal Selesai (2 Kolom) */}                                                                                
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">                                                                          
                            <div className="space-y-1.5">                                                                                                
                                <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                           
                                    Tanggal Mulai <span className="text-destructive">*</span>                                                            
                                </label>                                                                                                                 
                                <input                                                                                                                   
                                    type="date"                                                                                                          
                                    required                                                                                                             
                                    value={tanggalMulai}                                                                                                 
                                    onChange={(e) => setTanggalMulai(e.target.value)}                                                                    
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-  
  none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"                                                                           
                                />                                                                                                                       
                            </div>                                                                                                                       
                                                                                                                                                         
                            <div className="space-y-1.5">                                                                                                
                                <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                           
                                    Tanggal Selesai (Opsional)                                                                                           
                                </label>                                                                                                                 
                                <input                                                                                                                   
                                    type="date"                                                                                                          
                                    value={tanggalSelesai}                                                                                               
                                    onChange={(e) => setTanggalSelesai(e.target.value)}                                                                  
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-  
  none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"                                                                           
                                />                                                                                                                       
                            </div>                                                                                                                       
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Deskripsi / Keterangan */}                                                                                                   
                        <div className="space-y-1.5">                                                                                                    
                            <label className="text-xs font-bold text-foreground uppercase tracking-wider">                                               
                                Deskripsi / Catatan Agenda                                                                                               
                            </label>                                                                                                                     
                            <textarea                                                                                                                    
                                rows={4}                                                                                                                 
                                placeholder="Tuliskan rincian agenda, pakaian/dresscode, atau instruksi protokoler jika ada..."                          
                                value={deskripsi}                                                                                                        
                                onChange={(e) => setDeskripsi(e.target.value)}                                                                           
                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none  
  focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground resize-y"                                     
                            />                                                                                                                           
                        </div>                                                                                                                           
                                                                                                                                                         
                        {/* Switch Status Aktif */}                                                                                                      
                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">                                               
                            <div>                                                                                                                        
                                <p className="text-xs font-bold text-foreground">Status Publikasi Jadwal</p>                                             
                                <p className="text-[11px] text-muted-foreground">                                                                        
                                    Tampilkan kegiatan ini di halaman website publik (/kegiatan).                                                        
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
                            href="/admin/kegiatan"                                                                                                       
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
                                    <span>Menyimpan...</span>                                                                                            
                                </>                                                                                                                      
                            ) : (                                                                                                                        
                                <>                                                                                                                       
                                    <Calendar className="w-4 h-4" />                                                                                     
                                    <span>{isEdit ? "Simpan Perubahan" : "Terbitkan Kegiatan"}</span>                                                    
                                </>                                                                                                                      
                            )}                                                                                                                           
                        </button>                                                                                                                        
                    </div>                                                                                                                               
                </form>                                                                                                                                  
            </div>                                                                                                                                       
        )                                                                                                                                                
    }                             