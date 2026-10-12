import Link from "next/link"                                                                                                                         
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { formatDate } from "@/lib/utils"                                                                                                             
    import { ADMIN_ITEMS_PER_PAGE } from "@/lib/constants"                                                                                               
    import { KegiatanRowActions } from "./kegiatan-actions"                                                                                              
    import {                                                                                                                                             
        Plus,                                                                                                                                            
        Calendar,                                                                                                                                        
        ChevronLeft,                                                                                                                                     
        ChevronRight,                                                                                                                                    
        Search,                                                                                                                                          
        MapPin,                                                                                                                                          
        User,                                                                                                                                            
    } from "lucide-react"                                                                                                                                
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Kelola Kegiatan | Admin Prokompim",                                                                                                      
    }                                                                                                                                                    
                                                                                                                                                         
    interface AdminKegiatanPageProps {                                                                                                                   
        searchParams: Promise<{                                                                                                                          
            status?: string                                                                                                                              
            page?: string                                                                                                                                
            q?: string                                                                                                                                   
        }>                                                                                                                                               
    }                                                                                                                                                    
                                                                                                                                                         
    const JENIS_BADGE: Record<string, string> = {                                                                                                        
        upacara: "bg-brand-red text-white",                                                                                                              
        hari_nasional: "bg-brand-gold text-zinc-950",                                                                                                    
        kegiatan_pimpinan: "bg-primary text-primary-foreground",                                                                                         
        kegiatan: "bg-muted text-muted-foreground",                                                                                                      
    }                                                                                                                                                    
                                                                                                                                                         
    const JENIS_LABEL: Record<string, string> = {                                                                                                        
        upacara: "Upacara",                                                                                                                              
        hari_nasional: "Hari Nasional",                                                                                                                  
        kegiatan_pimpinan: "Kegiatan Pimpinan",                                                                                                          
        kegiatan: "Kegiatan",                                                                                                                            
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminKegiatanPage({ searchParams }: AdminKegiatanPageProps) {                                                          
        const { status = "", page = "1", q = "" } = await searchParams                                                                                   
        const currentPage = Math.max(1, parseInt(page, 10) || 1)                                                                                         
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // 1. Fetch total count status untuk tab badge                                                                                                   
        const [                                                                                                                                          
            { count: countAll },                                                                                                                         
            { count: countActive },                                                                                                                      
            { count: countInactive },                                                                                                                    
        ] = await Promise.all([                                                                                                                          
            supabase.from("kegiatan").select("*", { count: "exact", head: true }),                                                                       
            supabase.from("kegiatan").select("*", { count: "exact", head: true }).eq("is_active", true),                                                 
            supabase.from("kegiatan").select("*", { count: "exact", head: true }).eq("is_active", false),                                                
        ])                                                                                                                                               
                                                                                                                                                         
        // 2. Query data kegiatan dengan filter & paginasi                                                                                               
        const from = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE                                                                                            
        const to = from + ADMIN_ITEMS_PER_PAGE - 1                                                                                                       
                                                                                                                                                         
        let query = supabase                                                                                                                             
            .from("kegiatan")                                                                                                                            
            .select("*", { count: "exact" })                                                                                                             
            .order("tanggal_mulai", { ascending: false })                                                                                                
            .range(from, to)                                                                                                                             
                                                                                                                                                         
        if (status === "active") {                                                                                                                       
            query = query.eq("is_active", true)                                                                                                          
        } else if (status === "inactive") {                                                                                                              
            query = query.eq("is_active", false)                                                                                                         
        }                                                                                                                                                
                                                                                                                                                         
        if (q.trim()) {                                                                                                                                  
            query = query.or(`judul.ilike.%${q.trim()}%,lokasi.ilike.%${q.trim()}%,pimpinan.ilike.%${q.trim()}%`)                                        
        }                                                                                                                                                
                                                                                                                                                         
        const { data: rawKegiatanList, count: totalFiltered = 0 } = await query                                                                          
        const kegiatanList = rawKegiatanList || []                                                                                                       
        const totalPages = Math.ceil((totalFiltered ?? 0) / ADMIN_ITEMS_PER_PAGE) || 1                                                                   
                                                                                                                                                         
        const buildUrl = (targetPage: number, targetStatus: string, search: string) => {                                                                 
            const params = new URLSearchParams()                                                                                                         
            if (targetStatus) params.set("status", targetStatus)                                                                                         
            if (search) params.set("q", search)                                                                                                          
            if (targetPage > 1) params.set("page", targetPage.toString())                                                                                
            const qs = params.toString()                                                                                                                 
            return `/admin/kegiatan${qs ? `?${qs}` : ""}`                                                                                                
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
                            Kelola Agenda Kegiatan                                                                                                       
                        </h2>                                                                                                                            
                        <p className="text-xs text-muted-foreground mt-1">                                                                               
                            Daftar jadwal acara resmi, upacara, dan agenda pimpinan Pemerintah Kabupaten Brebes.                                         
                        </p>                                                                                                                             
                    </div>                                                                                                                               
                    <Link                                                                                                                                
                        href="/admin/kegiatan/tambah"                                                                                                    
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-
  primary/90 transition-all shadow-sm w-fit"                                                                                                             
                    >                                                                                                                                    
                        <Plus className="w-4 h-4" />                                                                                                     
                        <span>Tambah Kegiatan</span>                                                                                                     
                    </Link>                                                                                                                              
                </div>                                                                                                                                   
                                                                                                                                                         
                {/* Filter Tab & Form Pencarian */}                                                                                                      
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">                                                        
                    {/* Tab Status */}                                                                                                                   
                    <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/50 w-fit overflow-x-auto">                 
                        {tabs.map((tab) => {                                                                                                             
                            const isActiveTab = status === tab.value                                                                                     
                            return (                                                                                                                     
                                <Link                                                                                                                    
                                    key={tab.label}                                                                                                      
                                    href={buildUrl(1, tab.value, q)}                                                                                     
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
                                                                                                                                                         
                    {/* Search Input */}                                                                                                                 
                    <form method="GET" action="/admin/kegiatan" className="relative w-full sm:w-64">                                                     
                        {status && <input type="hidden" name="status" value={status} />}                                                                 
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />                                    
                        <input                                                                                                                           
                            type="text"                                                                                                                  
                            name="q"                                                                                                                     
                            defaultValue={q}                                                                                                             
                            placeholder="Cari judul, lokasi, pimpinan..."                                                                                
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2      
  focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"                                                           
                        />                                                                                                                               
                    </form>                                                                                                                              
                </div>                                                                                                                                   
                                                                                                                                                         
                {/* Tabel Agenda Kegiatan */}                                                                                                            
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">                                                     
                    <div className="overflow-x-auto">                                                                                                    
                        <table className="w-full text-left text-xs">                                                                                     
                            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase tracking-wider font-bold text-[10px]">  
                                <tr>                                                                                                                     
                                    <th className="p-4">Tanggal Pelaksanaan</th>                                                                         
                                    <th className="p-4">Judul & Jenis</th>                                                                               
                                    <th className="p-4">Lokasi & Pimpinan</th>                                                                           
                                    <th className="p-4">Status</th>                                                                                      
                                    <th className="p-4 text-right">Aksi</th>                                                                             
                                </tr>                                                                                                                    
                            </thead>                                                                                                                     
                            <tbody className="divide-y divide-border/60">                                                                                
                                {kegiatanList.length === 0 ? (                                                                                           
                                    <tr>                                                                                                                 
                                        <td colSpan={5} className="p-12 text-center text-muted-foreground">                                              
                                            <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />                                     
                                            <p className="font-semibold text-foreground">Tidak ada agenda kegiatan ditemukan.</p>                        
                                            <p className="text-[11px] mt-1">                                                                             
                                                {q ? `Tidak ada hasil untuk pencarian "${q}".` : "Belum ada agenda yang dijadwalkan."}                   
                                            </p>                                                                                                         
                                        </td>                                                                                                            
                                    </tr>                                                                                                                
                                ) : (                                                                                                                    
                                    kegiatanList.map((item) => (                                                                                         
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">                                               
                                            {/* Kolom Tanggal */}                                                                                        
                                            <td className="p-4 whitespace-nowrap">                                                                       
                                                <div className="font-semibold text-foreground">                                                          
                                                    {formatDate(item.tanggal_mulai)}                                                                     
                                                </div>                                                                                                   
                                                {item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_mulai && (                                
                                                    <div className="text-[11px] text-muted-foreground mt-0.5">                                           
                                                        s.d. {formatDate(item.tanggal_selesai)}                                                          
                                                    </div>                                                                                               
                                                )}                                                                                                       
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Kolom Judul & Badge Jenis */}                                                                            
                                            <td className="p-4 max-w-sm">                                                                                
                                                <div className="font-bold text-foreground line-clamp-2 leading-snug">                                    
                                                    {item.judul}                                                                                         
                                                </div>                                                                                                   
                                                <div className="mt-1.5">                                                                                 
                                                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${                       
                                                        JENIS_BADGE[item.jenis] || JENIS_BADGE["kegiatan"]                                               
                                                    }`}>                                                                                                 
                                                        {JENIS_LABEL[item.jenis] || item.jenis}                                                          
                                                    </span>                                                                                              
                                                </div>                                                                                                   
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Kolom Lokasi & Pimpinan */}                                                                              
                                            <td className="p-4 whitespace-nowrap space-y-1">                                                             
                                                {item.lokasi && (                                                                                        
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">                                    
                                                        <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />                                       
                                                        <span className="truncate max-w-[180px]">{item.lokasi}</span>                                    
                                                    </div>                                                                                               
                                                )}                                                                                                       
                                                {item.pimpinan && (                                                                                      
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">                                    
                                                        <User className="w-3.5 h-3.5 text-brand-sky shrink-0" />                                         
                                                        <span className="truncate max-w-[180px]">{item.pimpinan}</span>                                  
                                                    </div>                                                                                               
                                                )}                                                                                                       
                                                {!item.lokasi && !item.pimpinan && (                                                                     
                                                    <span className="text-muted-foreground/60 italic">-</span>                                           
                                                )}                                                                                                       
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Kolom Status */}                                                                                         
                                            <td className="p-4 whitespace-nowrap">                                                                       
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${             
                                                    item.is_active                                                                                       
                                                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"                              
                                                        : "bg-muted text-muted-foreground border border-border"                                          
                                                }`}>                                                                                                     
                                                    {item.is_active ? "Aktif" : "Nonaktif"}                                                              
                                                </span>                                                                                                  
                                            </td>                                                                                                        
                                                                                                                                                         
                                            {/* Kolom Aksi Row */}                                                                                       
                                            <td className="p-4 whitespace-nowrap text-right">                                                            
                                                <KegiatanRowActions id={item.id} isActive={item.is_active} />                                            
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
                                    href={buildUrl(currentPage - 1, status, q)}                                                                          
                                    aria-disabled={currentPage <= 1}                                                                                     
                                    className={`p-1.5 rounded-lg border border-border text-foreground transition-colors ${                               
                                        currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted"                                           
                                    }`}                                                                                                                  
                                >                                                                                                                        
                                    <ChevronLeft className="w-4 h-4" />                                                                                  
                                </Link>                                                                                                                  
                                <Link                                                                                                                    
                                    href={buildUrl(currentPage + 1, status, q)}                                                                          
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