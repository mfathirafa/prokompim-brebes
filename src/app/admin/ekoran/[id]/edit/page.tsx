import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EkoranForm } from "../../ekoran-form"

export const metadata: Metadata = { title: "Edit E-Koran" }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEkoranPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: ekoran } = await sb
    .from("ekoran")
    .select("*")
    .eq("id", id)
    .single()

  if (!ekoran) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Edit E-Koran</h2>
        <p className="text-sm text-muted-foreground mt-1">Perbarui informasi edisi koran digital.</p>
      </div>
      <EkoranForm mode="edit" initialData={ekoran} />
    </div>
  )
}
