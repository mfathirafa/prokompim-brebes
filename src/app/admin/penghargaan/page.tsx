import Link from "next/link"                                                                                                                         
    import { createClient } from "@/lib/supabase/server"                                                                                                 
    import { formatDate } from "@/lib/utils"                                                                                                             
    import { ADMIN_ITEMS_PER_PAGE } from "@/lib/constants"                                                                                               
    import { PenghargaanRowActions } from "./penghargaan-actions"                                                                                        
    import { Plus, Trophy, ChevronLeft, ChevronRight, Search, Building2 } from "lucide-react"                                                            
                                                                                                                                                         
    export const metadata = {                                                                                                                            
        title: "Kelola Penghargaan | Admin Prokompim",                                                                                                   
    }                                                                                                                                                    
                                                                                                                                                         
    interface AdminPenghargaanPageProps {                                                                                                                
        searchParams: Promise<{                                                                                                                          
            status?: string                                                                                                                              
            tingkat?: string                                                                                                                             
            page?: string                                                                                                                                
            q?: string                                                                                                                                   
        }>                                                                                                                                               
    }                                                                                                                                                    
                                                                                                                                                         
    export default async function AdminPenghargaanPage({ searchParams }: AdminPenghargaanPageProps) {                                                    
        const { status = "", tingkat = "", page = "1", q = "" } = await searchParams                                                                     
        const currentPage = Math.max(1, parseInt(page, 10) || 1)                                                                                         
        const supabase = await createClient()                                                                                                            
                                                                                                                                                         
        // 1. Hitung total per status                                                                                                                    
        const [{ count: countAll }, { count: countActive }, { count: countInactive }] =                                                                  
            await Promise.all([                                                                                                                          
                supabase.from("penghargaan").select("*", { count: "exact", head: true }),                                                                
                supabase.from("penghargaan").select("*", { count: "exact", head: true }).eq("is_active", true),                                          
                supabase.from("penghargaan").select("*", { count: "exact", head: true }).eq("is_active", false),                                         
            ])                                                                                                                                           
                                                                                                                                                         
        // 2. Query data penghargaan                                                                                                                     
        const from = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE                                                                                            
        const to = from + ADMIN_ITEMS_PER_PAGE - 1                                                                                                       
                                                                                                                                                         
        let query = supabase                                                                                                                             
            .from("penghargaan")                                                                                                                         
            .select("id, judul, deskripsi, instansi_pemberi, penerima, tingkat, tanggal, is_active, created_at", {                                       
                count: "exact",                                                                                                                          
            })                                                                                                                                           
            .order("tanggal", { ascending: false })                                                                                                      
            .range(from, to)                                                                                                                             
                                                                                                                                                         
        if (status === "active") query = query.eq("is_active", true)                                                                                     
        if (status === "inactive") query = query.eq("is_active", false)                                                                                  
        if (tingkat) query = query.eq("tingkat", tingkat)                                                                                                
        if (q) {                                                                                                                                         
            query = query.or(`judul.ilike.%${q}%,instansi_pemberi.ilike.%${q}%,penerima.ilike.%${q}%`)                                                   
        }                                                                                                                                                
                                                                                                                                                         
        const { data: penghargaanList, count = 0 } = await query                                                                                         
        const totalPages = Math.ceil((count || 0) / ADMIN_ITEMS_PER_PAGE)                                                                                
                                                                                                                                                         
        const tabs = [                                                                                                                                   
            { label: "Semua", value: "", count: countAll || 0 },                                                                                         
            { label: "Aktif", value: "active", count: countActive || 0 },                                                                                
            { label: "Nonaktif", value: "inactive", count: countInactive || 0 },                                                                         
        ]                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <div className="space-y-6">                                                                                                                  
                {/* Header Halaman */}                                                                                                                   
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">                                                     
                    <div>                                                                                                                                
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">                                       
                            <Trophy className="w-6 h-6 text-brand-gold" />                                                                               
                            Kelola Penghargaan                                                                                                           
                        </h1>                                                                                                                            
                        <p className="text-xs text-muted-foreground mt-0.5">                                                                             
                            Kelola daftar prestasi, penghargaan, dan apresiasi yang diraih Pemkab Brebes                                                 
                        </p>                                                                                                                             
                    </div>                                                                                                                               
                    <Link                                                                                                                                
                        href="/admin/penghargaan/tambah"                                                                                                 
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-   
  semibold hover:bg-primary/90 transition-colors shadow-sm"                                                                                              
                    >                                                                                                                                    
                        <Plus className="w-4 h-4" />                                                                                                     
                        <span>Tambah Penghargaan</span>                                                                                                  
                    </Link>                                                                                                                              
                </div>                                                                                                                                   
                                                                                                                                                         
                {/* Filter Tabs & Search */}                                                                                                             
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-2 rounded-2xl border border-border">           
                    {/* Tabs Status */}                                                                                                                  
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">                                                               
                        {tabs.map((tab) => {                                                                                                             
                            const isActive = status === tab.value                                                                                        
                            return (                                                                                                                     
                                <Link                                                                                                                    
                                    key={tab.label}                                                                                                      
                                    href={`/admin/penghargaan?status=${tab.value}${q ? `&q=${q}` : ""}`}                                                 
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors 
  ${                                                                                                                                                     
                                        isActive                                                                                                         
                                            ? "bg-primary text-primary-foreground shadow-xs"                                                             
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"                                               
                                    }`}                                                                                                                  
                                >                                                                                                                        
                                    <span>{tab.label}</span>                                                                                             
                                    <span                                                                                                                
                                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${                                                            
                                            isActive                                                                                                     
                                                ? "bg-primary-foreground/20 text-primary-foreground"                                                     
                                                : "bg-muted text-muted-foreground"                                                                       
                                        }`}                                                                                                              
                                    >                                                                                                                    
                                        {tab.count}                                                                                                      
                                    </span>                                                                                                              
                                </Link>                                                                                                                  
                            )                                                                                                                            
                        })}                                                                                                                              
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Form Pencarian */}                                                                                                               
                    <form method="GET" action="/admin/penghargaan" className="relative sm:w-64">                                                         
                        {status && <input type="hidden" name="status" value={status} />}                                                                 
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />                                    
                        <input                                                                                                                           
                            type="text"                                                                                                                  
                            name="q"                                                                                                                     
                            defaultValue={q}                                                                                                             
                            placeholder="Cari penghargaan..."                                                                                            
                            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2     
  focus:ring-primary/20 focus:border-primary transition-all"                                                                                             
                        />                                                                                                                               
                    </form>                                                                                                                              
                </div>                                                                                                                                   
                                                                                                                                                         
                {/* Tabel Data */}                                                                                                                       
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">                                                     
                    <div className="overflow-x-auto">                                                                                                    
                        <table className="w-full text-left text-xs">                                                                                     
                            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase font-semibold">                         
                                <tr>                                                                                                                     
                                    <th className="px-6 py-4">Penghargaan &amp; Instansi</th>                                                            
                                    <th className="px-6 py-4">Tingkat</th>                                                                               
                                    <th className="px-6 py-4">Tanggal</th>                                                                               
                                    <th className="px-6 py-4">Status</th>                                                                                
                                    <th className="px-6 py-4 text-right">Aksi</th>                                                                       
                                </tr>                                                                                                                    
                            </thead>                                                                                                                     
                            <tbody className="divide-y divide-border/60">                                                                                
                                {penghargaanList && penghargaanList.length > 0 ? (                                                                       
                                    penghargaanList.map((item) => (                                                                                      
                                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">                                               
                                            <td className="px-6 py-4">                                                                                   
                                                <div className="space-y-1 max-w-md">                                                                     
                                                    <p className="font-semibold text-foreground text-sm leading-snug">                                   
                                                        {item.judul}                                                                                     
                                                    </p>                                                                                                 
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">                                    
                                                        <Building2 className="w-3.5 h-3.5 shrink-0 text-brand-sky" />                                    
                                                        <span className="truncate">{item.instansi_pemberi}</span>                                        
                                                    </div>                                                                                               
                                                </div>                                                                                                   
                                            </td>                                                                                                        
                                            <td className="px-6 py-4">                                                                                   
                                                <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-gold/15 text-brand-   
  gold border border-brand-gold/30">                                                                                                                     
                                                    {item.tingkat || "Nasional"}                                                                         
                                                </span>                                                                                                  
                                            </td>                                                                                                        
                                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">                                           
                                                {formatDate(item.tanggal)}                                                                               
                                            </td>                                                                                                        
                                            <td className="px-6 py-4 whitespace-nowrap">                                                                 
                                                <span                                                                                                    
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${             
                                                        item.is_active                                                                                   
                                                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"                          
                                                            : "bg-muted text-muted-foreground border border-border"                                      
                                                    }`}                                                                                                  
                                                >                                                                                                        
                                                    {item.is_active ? "Aktif" : "Nonaktif"}                                                              
                                                </span>                                                                                                  
                                            </td>                                                                                                        
                                            <td className="px-6 py-4 text-right">                                                                        
                                                <PenghargaanRowActions id={item.id} isActive={item.is_active} />                                         
                                            </td>                                                                                                        
                                        </tr>                                                                                                            
                                    ))                                                                                                                   
                                ) : (                                                                                                                    
                                    <tr>                                                                                                                 
                                        <td colSpan={5} className="py-12 text-center text-muted-foreground">                                             
                                            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />                                                       
                                            <p className="text-sm font-semibold">Tidak ada data penghargaan ditemukan</p>                                
                                            <p className="text-xs mt-0.5">Coba ubah kata kunci pencarian atau filter status</p>                          
                                        </td>                                                                                                            
                                    </tr>                                                                                                                
                                )}                                                                                                                       
                            </tbody>                                                                                                                     
                        </table>                                                                                                                         
                    </div>                                                                                                                               
                                                                                                                                                         
                    {/* Paginasi */}                                                                                                                     
                    {totalPages > 1 && (                                                                                                                 
                        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20 text-xs">                         
                            <span className="text-muted-foreground">                                                                                     
                                Halaman {currentPage} dari {totalPages} (Total {count} data)                                                             
                            </span>                                                                                                                      
                            <div className="flex items-center gap-1">                                                                                    
                                <Link                                                                                                                    
                                    href={`/admin/penghargaan?page=${Math.max(1, currentPage - 1)}${status ? `&status=${status}` : ""}${q ? `&q=${q}` :  
  ""}`}                                                                                                                                                  
                                    className={`p-1.5 rounded-lg border border-border hover:bg-muted ${                                                  
                                        currentPage <= 1 ? "opacity-50 pointer-events-none" : ""                                                         
                                    }`}                                                                                                                  
                                >                                                                                                                        
                                    <ChevronLeft className="w-4 h-4" />                                                                                  
                                </Link>                                                                                                                  
                                <Link                                                                                                                    
                                    href={`/admin/penghargaan?page=${Math.min(totalPages, currentPage + 1)}${status ? `&status=${status}` : ""}${q ?     
  `&q=${q}` : ""}`}                                                                                                                                      
                                    className={`p-1.5 rounded-lg border border-border hover:bg-muted ${                                                  
                                        currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""                                                
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