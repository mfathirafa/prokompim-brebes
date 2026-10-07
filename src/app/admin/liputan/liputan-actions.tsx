"use client"                                                                                                                                         
                                                                                                                                                         
    import { useState, useTransition } from "react"                                                                                                      
    import Link from "next/link"                                                                                                                         
    import { toggleLiputanStatus, deleteLiputan } from "./actions"                                                                                       
    import { Pencil, Trash2, CheckCircle2, XCircle, Loader2, Eye } from "lucide-react"                                                                   
                                                                                                                                                         
    interface LiputanRowActionsProps {                                                                                                                   
        id: string                                                                                                                                       
        isActive: boolean                                                                                                                                
    }                                                                                                                                                    
                                                                                                                                                         
    export function LiputanRowActions({ id, isActive }: LiputanRowActionsProps) {                                                                        
        const [isPending, startTransition] = useTransition()                                                                                             
        const [actionType, setActionType] = useState<"toggle" | "delete" | null>(null)                                                                   
                                                                                                                                                         
        const handleToggle = () => {                                                                                                                     
            setActionType("toggle")                                                                                                                      
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    await toggleLiputanStatus(id, isActive)                                                                                              
                } catch (err) {                                                                                                                          
                    alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengubah status.")                                                
                } finally {                                                                                                                              
                    setActionType(null)                                                                                                                  
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        const handleDelete = () => {                                                                                                                     
            const confirmed = window.confirm(                                                                                                            
                "Apakah Anda yakin ingin menghapus album liputan ini beserta semua foto di dalamnya? Tindakan ini permanen."                             
            )                                                                                                                                            
            if (!confirmed) return                                                                                                                       
                                                                                                                                                         
            setActionType("delete")                                                                                                                      
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    await deleteLiputan(id)                                                                                                              
                } catch (err) {                                                                                                                          
                    alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus liputan.")                                              
                } finally {                                                                                                                              
                    setActionType(null)                                                                                                                  
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <div className="flex items-center justify-end gap-1.5">                                                                                      
                {/* Pratinjau Publik */}                                                                                                                 
                <Link                                                                                                                                    
                    href={`/liputan/${id}`}                                                                                                              
                    target="_blank"                                                                                                                      
                    title="Lihat Halaman Publik"                                                                                                         
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"                            
                >                                                                                                                                        
                    <Eye className="w-4 h-4" />                                                                                                          
                </Link>                                                                                                                                  
                                                                                                                                                         
                {/* Toggle Status Aktif / Nonaktif */}                                                                                                   
                <button                                                                                                                                  
                    type="button"                                                                                                                        
                    onClick={handleToggle}                                                                                                               
                    disabled={isPending}                                                                                                                 
                    title={isActive ? "Nonaktifkan Liputan" : "Aktifkan Liputan"}                                                                        
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${                                                 
                        isActive                                                                                                                         
                            ? "text-emerald-600 hover:bg-emerald-500/10"                                                                                 
                            : "text-amber-600 hover:bg-amber-500/10"                                                                                     
                    }`}                                                                                                                                  
                >                                                                                                                                        
                    {isPending && actionType === "toggle" ? (                                                                                            
                        <Loader2 className="w-4 h-4 animate-spin" />                                                                                     
                    ) : isActive ? (                                                                                                                     
                        <CheckCircle2 className="w-4 h-4" />                                                                                             
                    ) : (                                                                                                                                
                        <XCircle className="w-4 h-4" />                                                                                                  
                    )}                                                                                                                                   
                </button>                                                                                                                                
                                                                                                                                                         
                {/* Tombol Edit */}                                                                                                                      
                <Link                                                                                                                                    
                    href={`/admin/liputan/${id}/edit`}                                                                                                   
                    title="Edit Liputan"                                                                                                                 
                    className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"                                                      
                >                                                                                                                                        
                    <Pencil className="w-4 h-4" />                                                                                                       
                </Link>                                                                                                                                  
                                                                                                                                                         
                {/* Tombol Hapus */}                                                                                                                     
                <button                                                                                                                                  
                    type="button"                                                                                                                        
                    onClick={handleDelete}                                                                                                               
                    disabled={isPending}                                                                                                                 
                    title="Hapus Liputan"                                                                                                                
                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"           
                >                                                                                                                                        
                    {isPending && actionType === "delete" ? (                                                                                            
                        <Loader2 className="w-4 h-4 animate-spin" />                                                                                     
                    ) : (                                                                                                                                
                        <Trash2 className="w-4 h-4" />                                                                                                   
                    )}                                                                                                                                   
                </button>                                                                                                                                
            </div>                                                                                                                                       
        )                                                                                                                                                
    }         