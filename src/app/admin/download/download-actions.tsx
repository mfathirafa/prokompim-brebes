 "use client"                                                                                                                                         
                                                                                                                                                         
    import { useState, useTransition } from "react"                                                                                                      
    import Link from "next/link"                                                                                                                         
    import { toggleDownloadStatus, deleteDownload, getAdminDownloadUrl } from "./actions"                                                                
    import {                                                                                                                                             
        Pencil,                                                                                                                                          
        Trash2,                                                                                                                                          
        CheckCircle2,                                                                                                                                    
        XCircle,                                                                                                                                         
        Loader2,                                                                                                                                         
        FileDown,                                                                                                                                        
    } from "lucide-react"                                                                                                                                
                                                                                                                                                         
    interface DownloadRowActionsProps {                                                                                                                  
        id: string                                                                                                                                       
        isActive: boolean                                                                                                                                
    }                                                                                                                                                    
                                                                                                                                                         
    export function DownloadRowActions({ id, isActive }: DownloadRowActionsProps) {                                                                      
        const [isPending, startTransition] = useTransition()                                                                                             
        const [actionType, setActionType] = useState<"toggle" | "delete" | "preview" | null>(null)                                                       
                                                                                                                                                         
        const handlePreviewDownload = async () => {                                                                                                      
            setActionType("preview")                                                                                                                     
            try {                                                                                                                                        
                const { url } = await getAdminDownloadUrl(id)                                                                                            
                window.open(url, "_blank", "noopener,noreferrer")                                                                                        
            } catch (err) {                                                                                                                              
                alert(err instanceof Error ? err.message : "Gagal mengunduh file.")                                                                      
            } finally {                                                                                                                                  
                setActionType(null)                                                                                                                      
            }                                                                                                                                            
        }                                                                                                                                                
                                                                                                                                                         
        const handleToggle = () => {                                                                                                                     
            setActionType("toggle")                                                                                                                      
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    await toggleDownloadStatus(id, isActive)                                                                                             
                } catch (err) {                                                                                                                          
                    alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengubah status.")                                                
                } finally {                                                                                                                              
                    setActionType(null)                                                                                                                  
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        const handleDelete = () => {                                                                                                                     
            const confirmed = window.confirm(                                                                                                            
                "Apakah Anda yakin ingin menghapus dokumen ini beserta file fisiknya di storage? Tindakan ini permanen."                                 
            )                                                                                                                                            
            if (!confirmed) return                                                                                                                       
                                                                                                                                                         
            setActionType("delete")                                                                                                                      
            startTransition(async () => {                                                                                                                
                try {                                                                                                                                    
                    await deleteDownload(id)                                                                                                             
                } catch (err) {                                                                                                                          
                    alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus dokumen.")                                              
                } finally {                                                                                                                              
                    setActionType(null)                                                                                                                  
                }                                                                                                                                        
            })                                                                                                                                           
        }                                                                                                                                                
                                                                                                                                                         
        return (                                                                                                                                         
            <div className="flex items-center justify-end gap-1.5">                                                                                      
                {/* Pratinjau / Unduh File */}                                                                                                           
                <button                                                                                                                                  
                    type="button"                                                                                                                        
                    onClick={handlePreviewDownload}                                                                                                      
                    disabled={isPending || actionType === "preview"}                                                                                     
                    title="Unduh / Pratinjau File"                                                                                                       
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer              
  disabled:opacity-50"                                                                                                                                   
                >                                                                                                                                        
                    {actionType === "preview" ? (                                                                                                        
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />                                                                        
                    ) : (                                                                                                                                
                        <FileDown className="w-4 h-4" />                                                                                                 
                    )}                                                                                                                                   
                </button>                                                                                                                                
                                                                                                                                                         
                {/* Toggle Status Aktif / Nonaktif */}                                                                                                   
                <button                                                                                                                                  
                    type="button"                                                                                                                        
                    onClick={handleToggle}                                                                                                               
                    disabled={isPending}                                                                                                                 
                    title={isActive ? "Nonaktifkan Dokumen" : "Aktifkan Dokumen"}                                                                        
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
                    href={`/admin/download/${id}/edit`}                                                                                                  
                    title="Edit Dokumen"                                                                                                                 
                    className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"                                                      
                >                                                                                                                                        
                    <Pencil className="w-4 h-4" />                                                                                                       
                </Link>                                                                                                                                  
                                                                                                                                                         
                {/* Tombol Hapus */}                                                                                                                     
                <button                                                                                                                                  
                    type="button"                                                                                                                        
                    onClick={handleDelete}                                                                                                               
                    disabled={isPending}                                                                                                                 
                    title="Hapus Dokumen"                                                                                                                
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