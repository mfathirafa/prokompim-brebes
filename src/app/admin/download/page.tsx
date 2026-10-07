 import Link from "next/link"                                                                                                                         
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { formatDate, formatFileSize } from "@/lib/utils"                                                                                             
    import { ADMIN_ITEMS_PER_PAGE } from "@/lib/constants"                                                                                               
    import { DownloadRowActions } from "./download-actions"                                                                                              
    import {                                                                                                                                             
        Plus,                                                                                                                                            
        Download,                                                                                                                                        
        ChevronLeft,                                                                                                                                     
        ChevronRight,                                                                                                                                    
        Search,                                                                                                                                          
        ArrowDownToLine,                                                                                                                                 
    } from "lucide-react"                                                                                                                                
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Kelola Dokumen Unduhan | Admin Prokompim",                                                                                               
    }                                                                                                                                                    
                                                                                                                                                         
    interface AdminDownloadPageProps {                                                                                                                   
        searchParams: Promise<{                                                                                                                          
            status?: string                                                                                                                              
            kategori?: string                                                                                                                            
            page?: string                                                                                                                                
            q?: string                                                                                                                                   
        }>                                                                                                                                               
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminDownloadPage({ searchParams }: AdminDownloadPageProps) {                                                          
        const { status = "", kategori = "", page = "1", q = "" } = await searchParams                                                                    
        const currentPage = Math.max(1, parseInt(page, 10) || 1)                                                                                         
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // 1. Fetch kategori unduhan untuk filter                                                                                                        
        const { data: kategoriList } = await supabase                                                                                                    
            .from("kategori_download")                                                                                                                   
            .select("id, nama")                                                                                                                          
            .order("urutan", { ascending: true })                                                                                                        
                                                                                                                                                         
        // 2. Fetch total count status untuk tab badge                                                                                                   
        const [                                                                                                                                          
            { count: countAll },                                                                                                                         
            { count: countActive },                                                                                                                      
            { count: countInactive },                                                                                                                    
        ] = await Promise.all([                                                                                                                          
            supabase.from("files_download").select("*", { count: "exact", head: true }),                                                                 
            supabase.from("files_download").select("*", { count: "exact", head: true }).eq("is_active", true),                                           
            supabase.from("files_download").select("*", { count: "exact", head: true }).eq("is_active", false),                                          
        ])                                                                                                                                               
                                                                                                                                                         
        // 3. Query data files_download dengan filter & paginasi                                                                                         
        const from = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE                                                                                            
        const to = from + ADMIN_ITEMS_PER_PAGE - 1                                                                                                       
                                                                                                                                                         
        let query = supabase                                                                                                                             
            .from("files_download")                                                                                                                      
            .select(                                                                                                                                     
                `                                                                                                                                        
                id,                                                                                                                                      
                judul,                                                                                                                                   
                deskripsi,                                                                                                                               
                file_name,                                                                                                                               
                file_size,                                                                                                                               
                file_type,                                                                                                                               
                download_count,                                                                                                                          
                tanggal_kegiatan,                                                                                                                        
                is_active,                                                                                                                               
                created_at,                                                                                                                              
                kategori_download (                                                                                                                      
                    id,                                                                                                                                  
                    nama                                                                                                                                 
                )                                                                                                                                        
            `,                                                                                                                                           
                { count: "exact" }                                                                                                                       
            )                                                                                                                                            
            .order("created_at", { ascending: false })                                                                                                   
            .range(from, to)                                                                                                                             
                                                                                                                                                         
        if (status === "active") {                                                                                                                       
            query = query.eq("is_active", true)                                                                                                          
        } else if (status === "inactive") {                                                                                                              
            query = query.eq("is_active", false)                                                                                                         
        }                                                                                                                                                
                                                                                                                                                         
        if (kategori) {                                                                                                                                  
            query = query.eq("kategori_id", Number(kategori))                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        if (q.trim()) {                                                                                                                                  
            query = query.or(`judul.ilike.%${q.trim()}%,file_name.ilike.%${q.trim()}%`)                                                                  
        }                                                                                                                                                
                                                                                                                                                         
        const { data: rawFileList, count: totalFiltered = 0 } = await query                                                                              
        const fileList = rawFileList || []                                                                                                               
        const totalPages = Math.ceil((totalFiltered ?? 0) / ADMIN_ITEMS_PER_PAGE) || 1                                                                   
                                                                                                                                                         
        const buildUrl = (targetPage: number, targetStatus: string, targetKategori: string, search: string) => {                                         
            const params = new URLSearchParams()                                                                                                         
            if (targetStatus) params.set("status", targetStatus)                                                                                         
            if (targetKategori) params.set("kategori", targetKategori)                                                                                   
            if (search) params.set("q", search)                                                                                                          
            if (targetPage > 1) params.set("page", targetPage.toString())                                                                                
            const qs = params.toString()                                                                                                                 
            return `/admin/download${qs ? `?${qs}` : ""}`                                                                                                
        }                                                                                                                                                
                                                                                                                                                         
        const tabs = [                                                                                                                                   
            { label: "Semua", value: "", count: countAll ?? 0 },                                                                                         
            { label: "Aktif", value: "active", count: countActive ?? 0 },                                                                                
            { label: "Nonaktif", value: "inactive", count: countInactive ?? 0 },                                                                         
        ]                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <div className="space-y-6">                                                                                                                  
                {/* Header: Judul & Tombol Tambah */}                                                                                                    
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">                                                     
                    <div>                                                                                                                                
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">                                                    
                            Kelola Dokumen Unduhan                                                                                                       
                        </h2>                                                                                                                            
                        <p className="text-xs text-muted-foreground mt-1">                                                                               
                            Daftar file sambutan pimpinan, tata upacara, dan pedoman protokoler resmi.                                                   
                        </p>                                                                                                                             
                    </div>                                                                                                                               
                    <Link                                                                                                                                
                        href="/admin/download/tambah"                                                                                                    
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-
  primary/90 transition-all shadow-sm w-fit"                                                                                                             
                    >                                                                                                                                    
                        <Plus className="w-4 h-4" />                                                                                                     
                        <span>Tambah Dokumen</span>                                                                                                      
                    </Link>                                                                                                                              
                </div>                                                                                                                                   
                                                                                                                                                         
                {/* Filter Tab, Kategori Dropdown & Search */}                                                                                           
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">                                                        
                    {/* Tab Status */}                                                                                                                   
                    <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/50 w-fit overflow-x-auto">                 
                        {tabs.map((tab) => {                                                                                                             
                            const isActiveTab = status === tab.value                                                                                     
                            return (                                                                                                                     
                                <Link                                                                                                                    
                                    key={tab.label}                                                                                                      
                                    href={buildUrl(1, tab.value, kategori, q)}                                                                           
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5  
  ${                                                                                                                                                     
                                        isActiveTab                                                                                                      
                                            ? "bg-card text-foreground shadow-sm"                                                                        
                                            : "text-muted-foreground hover:text-foreground"                                                              
                                    }`}                                                                                                                  
                                >                                                                                                                        
                                    <span>{tab.label}</span>                                                                                             
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${                                                
                                        isActiveTab ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"                                    
                                    }`}>                                                                                                                 
                                        {tab.count}                                                                                                      
                                    </span>                                                                                                              
                                </Link>                                                                                                                  
                            )                                                                                                                            
                        })}                                                                                                                              
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Filter Kategori & Search */}                                                                                                     
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">                                                      
                        {/* Dropdown Kategori */}                                                                                                        
                        <form method="GET" action="/admin/download" className="w-full sm:w-auto">                                                        
                            {status && <input type="hidden" name="status" value={status} />}                                                             
                            {q && <input type="hidden" name="q" value={q} />}                                                                            
                            <select                                                                                                                      
                                name="kategori"                                                                                                          
                                defaultValue={kategori}                                                                                                  
                                onChange={(e) => {                                                                                                       
                                    e.target.form?.submit()                                                                                              
                                }}                                                                                                                       
                                className="w-full sm:w-44 px-3 py-1.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-
  2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"                                                                           
                            >                                                                                                                            
                                <option value="">Semua Kategori</option>                                                                                 
                                {kategoriList?.map((cat) => (                                                                                            
                                    <option key={cat.id} value={cat.id}>                                                                                 
                                        {cat.nama}                                                                                                       
                                    </option>                                                                                                            
                                ))}                                                                                                                      
                            </select>                                                                                                                    
                        </form>                                                                                                                          
                                                                                                                                                         
                        {/* Search Input */}                                                                                                             
                        <form method="GET" action="/admin/download" className="relative w-full sm:w-64">                                                 
                            {status && <input type="hidden" name="status" value={status} />}                                                             
                            {kategori && <input type="hidden" name="kategori" value={kategori} />}                                                       
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />                                
                            <input                                                                                                                       
                                type="text"                                                                                                              
                                name="q"                                                                                                                 
                                defaultValue={q}                                                                                                         
                                placeholder="Cari judul atau file..."                                                                                    
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2  
  focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"                                                           
                            />                                                                                                                           
                        </form>                                                                                                                          
                    </div>                                                                                                                               
                </div>                                                                                                                                   
                                                                                                                                                         
                {/* Tabel Dokumen Unduhan */}                                                                                                            
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">                                                     
                    <div className="overflow-x-auto">                                                                                                    
                        <table className="w-full text-left text-xs">                                                                                     
                            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase tracking-wider font-bold text-[10px]">  
                                <tr>                                                                                                                     
                                    <th className="p-4">Dokumen & File</th>                                                                              
                                    <th className="p-4">Kategori</th>                                                                                    
                                    <th className="p-4">Tanggal Kegiatan</th>                                                                            
                                    <th className="p-4 text-center">Unduhan</th>                                                                         
                                    <th className="p-4">Status</th>                                                                                      
                                    <th className="p-4 text-right">Aksi</th>                                                                             
                                </tr>                                                                                                                    
                            </thead>                                                                                                                     
                            <tbody className="divide-y divide-border/60">                                                                                
                                {fileList.length === 0 ? (                                                                                               
                                    <tr>                                                                                                                 
                                        <td colSpan={6} className="p-12 text-center text-muted-foreground">                                              
                                            <Download className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />                                     
                                            <p className="font-semibold text-foreground">Tidak ada dokumen ditemukan.</p>                                
                                            <p className="text-[11px] mt-1">                                                                             
                                                {q ? `Tidak ada hasil untuk pencarian "${q}".` : "Belum ada dokumen yang diunggah."}                     
                                            </p>                                                                                                         
                                        </td>                                                                                                            
                                    </tr>                                                                                                                
                                ) : (                                                                                                                    
                                    fileList.map((item) => (                                                                                             
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">                                               
                                            {/* Dokumen & Nama File */}                                                                                  
                                            <td className="p-4 max-w-sm">                                                                                
                                                <div className="font-bold text-foreground line-clamp-2 leading-snug">                                    
                                                    {item.judul}                                                                                         
                                                </div>                                                                                                   
                                                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground font-mono">             
                                                    <span className="uppercase px-1.5 py-0.2 rounded bg-muted font-bold text-[9px] text-foreground">     
                                                        {item.file_type || "FILE"}                                                                       
                                                    </span>                                                                                              
                                                    <span className="truncate max-w-[200px]" title={item.file_name}>                                     
                                                        {item.file_name}                                                                                 
                                                    </span>                                                                                              
                                                    <span>•</span>                                                                                       
                                                    <span>{formatFileSize(item.file_size || 0)}</span>                                                   
                                                </div>                                                                                                   
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Kategori */}                                                                                             
                                            <td className="p-4 whitespace-nowrap">                                                                       
                                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">  
                                                    {item.kategori_download?.nama || "Umum"}                                                             
                                                </span>                                                                                                  
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Tanggal Kegiatan */}                                                                                     
                                            <td className="p-4 whitespace-nowrap text-muted-foreground">                                                 
                                                {item.tanggal_kegiatan ? formatDate(item.tanggal_kegiatan) : "-"}                                        
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Download Counter */}                                                                                     
                                            <td className="p-4 whitespace-nowrap text-center">                                                           
                                                <div className="inline-flex items-center gap-1 text-muted-foreground font-semibold">                     
                                                    <ArrowDownToLine className="w-3.5 h-3.5 text-brand-sky" />                                           
                                                    <span>{item.download_count ?? 0}</span>                                                              
                                                </div>                                                                                                   
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Status */}                                                                                               
                                            <td className="p-4 whitespace-nowrap">                                                                       
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${             
                                                    item.is_active                                                                                       
                                                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"                              
                                                        : "bg-muted text-muted-foreground border border-border"                                          
                                                }`}>                                                                                                     
                                                    {item.is_active ? "Aktif" : "Nonaktif"}                                                              
                                                </span>                                                                                                  
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Aksi Baris */}                                                                                           
                                            <td className="p-4 whitespace-nowrap text-right">                                                            
                                                <DownloadRowActions id={item.id} isActive={item.is_active} />                                            
                                            </td>                                                                                                        
                                        </tr>                                                                                                            
                                    ))                                                                                                                   
                                )}                                                                                                                       
                            </tbody>                                                                                                                     
                        </table>                                                                                                                         
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Pagination Controls */}                                                                                                          
                    {totalPages > 1 && (                                                                                                                 
                        <div className="p-4 border-t border-border flex items-center justify-between">                                                   
                            <span className="text-xs text-muted-foreground">                                                                             
                                Halaman {currentPage} dari {totalPages} ({totalFiltered} total)                                                          
                            </span>                                                                                                                      
                            <div className="flex items-center gap-1.5">                                                                                  
                                <Link                                                                                                                    
                                    href={buildUrl(currentPage - 1, status, kategori, q)}                                                                
                                    aria-disabled={currentPage <= 1}                                                                                     
                                    className={`p-1.5 rounded-lg border border-border text-foreground transition-colors ${                               
                                        currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted"                                           
                                    }`}                                                                                                                  
                                >                                                                                                                        
                                    <ChevronLeft className="w-4 h-4" />                                                                                  
                                </Link>                                                                                                                  
                                <Link                                                                                                                    
                                    href={buildUrl(currentPage + 1, status, kategori, q)}                                                                
                                    aria-disabled={currentPage >= totalPages}                                                                            
                                    className={`p-1.5 rounded-lg border border-border text-foreground transition-colors ${                               
                                        currentPage >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-muted"                                  
                                    }`}                                                                                                                  
                                >                                                                                                                        
                                    <ChevronRight className="w-4 h-4" />                                                                                 
                                </Link>                                                                                                                  
                            </div>                                                                                                                       
                        </div>                                                                                                                           
                    )}                                                                                                                                   
                </div>                                                                                                                                   
            </div>                                                                                                                                       
        )                                                                                                                                                
    }                                  