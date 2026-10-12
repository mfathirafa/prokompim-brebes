"use client"                                                                                                                                         
                                                                                                                                                         
    import { useState, useTransition } from "react"                                                                                                      
    import Link from "next/link"                                                                                                                         
    import { togglePenghargaanStatus, deletePenghargaan } from "./actions"                                                                               
    import { Pencil, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react"                                                                        
                                                                                                                                                         
    interface PenghargaanRowActionsProps {                                                                                                               
        id: string                                                                                                                                       
        isActive: boolean                                                                                                                                
    }                                                                                                                                                    
                                                                                                                                                         
    export function PenghargaanRowActions({ id, isActive }: PenghargaanRowActionsProps) {                                                                
        const [isPending, startTransition] = useTransition()                                                                                             
        const [actionType, setActionType] = useState<"toggle" | "delete" | null>(null)                                                                   
                                                                                                                                                         
        const handleToggle = () => {                                                                                                                     
            setActionType("toggle")                                                                                                                      
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    await togglePenghargaanStatus(id, isActive)                                                                                          
                } catch (err) {                                                                                                                          
                    alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengubah status.")                                                
                } finally {                                                                                                                              
                    setActionType(null)                                                                                                                  
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        const handleDelete = () => {                                                                                                                     
            const confirmed = window.confirm(                                                                                                            
                "Apakah Anda yakin ingin menghapus data penghargaan ini? Tindakan ini permanen."                                                         
            )                                                                                                                                            
            if (!confirmed) return                                                                                                                       
                                                                                                                                                         
            setActionType("delete")                                                                                                                      
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    await deletePenghargaan(id)                                                                                                          
                } catch (err) {                                                                                                                          
                    alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus data.")                                                 
                } finally {                                                                                                                              
                    setActionType(null)                                                                                                                  
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <div className="flex items-center justify-end gap-1.5">                                                                                      
                {/* Toggle Status Aktif/Nonaktif */}                                                                                                     
                <button                                                                                                                                  
                    type="button"                                                                                                                        
                    onClick={handleToggle}                                                                                                               
                    disabled={isPending}                                                                                                                 
                    title={isActive ? "Nonaktifkan Penghargaan" : "Aktifkan Penghargaan"}                                                                
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
                    href={`/admin/penghargaan/${id}/edit`}                                                                                               
                    title="Edit Penghargaan"                                                                                                             
                    className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"                                                      
                >                                                                                                                                        
                    <Pencil className="w-4 h-4" />                                                                                                       
                </Link>                                                                                                                                  
                                                                                                                                                         
                {/* Tombol Hapus */}                                                                                                                     
                <button                                                                                                                                  
                    type="button"                                                                                                                        
                    onClick={handleDelete}                                                                                                               
                    disabled={isPending}                                                                                                                 
                    title="Hapus Penghargaan"                                                                                                            
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