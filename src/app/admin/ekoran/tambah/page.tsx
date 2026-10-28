import type { Metadata } from "next"
import { EkoranForm } from "../ekoran-form"

export const metadata: Metadata = { title: "Tambah E-Koran" }

export default function TambahEkoranPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Tambah Edisi E-Koran</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload edisi koran digital / majalah baru.</p>
      </div>
      <EkoranForm mode="create" />
    </div>
  )
}
