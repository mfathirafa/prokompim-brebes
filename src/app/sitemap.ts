import { createClient } from "@/lib/supabase/server"
import { SITE_CONFIG } from "@/lib/constants"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const base = SITE_CONFIG.url.replace(/\/$/, "")

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/berita`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/liputan`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/download`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/kegiatan`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/penghargaan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/e-koran`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/profil`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  // Dynamic: Berita
  const { data: beritaList } = await supabase
    .from("berita")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(500)

  const beritaPages: MetadataRoute.Sitemap = (beritaList ?? []).map((b) => ({
    url: `${base}/berita/${b.slug}`,
    lastModified: new Date(b.updated_at ?? b.published_at ?? new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Dynamic: Liputan
  const { data: liputanList } = await supabase
    .from("liputan")
    .select("id, updated_at")
    .order("created_at", { ascending: false })
    .limit(200)

  const liputanPages: MetadataRoute.Sitemap = (liputanList ?? []).map((l) => ({
    url: `${base}/liputan/${l.id}`,
    lastModified: new Date(l.updated_at ?? new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...beritaPages, ...liputanPages]
}
