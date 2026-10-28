"use client"

import { useState } from "react"
import { toggleEkoranActive, deleteEkoran } from "./actions"
import { Eye, EyeOff, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface EkoranActionsProps {
  id: string
  isActive: boolean
  judul: string
}

export function EkoranActions({ id, isActive, judul }: EkoranActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    await toggleEkoranActive(id, !isActive)
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus edisi "${judul}"? Tindakan ini tidak dapat dibatalkan.`)) return
    setLoading(true)
    const result = await deleteEkoran(id)
    if (result.error) {
      alert("Gagal menghapus: " + result.error)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={loading}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        title={isActive ? "Nonaktifkan" : "Aktifkan"}
      >
        {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
        title="Hapus"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  )
}
