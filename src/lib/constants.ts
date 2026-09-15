export const SITE_CONFIG = {
    name: "Prokompim Brebes",
    fullName: "Bagian Protokol dan Komunikasi Pimpinan Kabupaten Brebes",
    description: "Website resmi Bagian Protokol dan Komunikasi Pimpinan Sekretariat Daerah Kabupaten Brebes",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000",
    address: "Jl. A. Yani No. 1, Brebes, Jawa Tengah 52212",
    phone: "(0283) 671032",
    email: "prokompim@brebeskab.go.id",
    social: {
        facebook: "https://facebook.com/prokompimbrebes",
        instagram: "https://instagram.com/prokompimbrebes",
        youtube: "https://youtube.com/prokompimbrebes",
        twitter: "https://twitter.com/prokompimbrebes",
    },
}

export const NAV_LINKS = [
    { label: "Beranda", href: "/" },
    { label: "Berita", href: "/berita" },
    { label: "Liputan", href: "/liputan" },
    { label: "Download", href: "/download" },
    { label: "Penghargaan", href: "/penghargaan" },
    { label: "Kegiatan", href: "/kegiatan" },
    { label: "E-Koran", href: "/e-koran" },
]

export const ADMIN_SIDEBAR_LINKS = [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Berita", href: "/admin/berita", icon: "Newspaper" },
    { label: "Download", href: "/admin/download", icon: "Download" },
    { label: "Penghargaan", href: "/admin/penghargaan", icon: "Trophy" },
    { label: "Kegiatan", href: "/admin/kegiatan", icon: "Calendar" },
    { label: "Liputan", href:"/admin/liputan", icon: "Camera" },
    { label: "Komentar", href:"/admin/komentar", icon: "MessageSquare" },
    { label: "Pengguna", href: "/admin/users", icon: "Users" },
]

export const STORAGE_BUCKETS = {
    BERITA: "berita-images",
    PENGHARGAAN: "penghargaan-images",
    LIPUTAN: "liputan-photos",
    DOWNLOAD: "download-files", // Private bucket
    EKORAN: "ekoran-files", // Private bucket
} as const

export const ITEMS_PER_PAGE = 9
export const ADMIN_ITEMS_PER_PAGE = 10