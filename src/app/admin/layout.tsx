"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ADMIN_SIDEBAR_LINKS } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    LayoutDashboard,
    Newspaper,
    Download,
    Trophy,
    Calendar,
    Camera,
    MessageSquare,
    Users,
    Menu,
    LogOut,
    ExternalLink
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

// Map icon Lucide sesuai nama icon di ADMIN_SIDEBAR_LINKS
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Newspaper,
    Download,
    Trophy,
    Calendar,
    Camera,
    MessageSquare,
    Users,
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<{ nama: string; role: string } | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    // Ambil user auth & data profile dari tabel profiles
    useEffect(() => {
        async function loadAdminProfile() {
            const {
                data: { user: currentUser },
            } = await supabase.auth.getUser()

            setUser(currentUser)

            if (currentUser) {
                const { data } = await supabase
                    .from("profiles")
                    .select("nama, role")
                    .eq("id", currentUser.id)
                    .single()

                if (data) setProfile(data)
            }
        }

        loadAdminProfile()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null
            setUser(currentUser)
            if (currentUser) {
                const { data } = await supabase
                    .from("profiles")
                    .select("nama, role")
                    .eq("id", currentUser.id)
                    .single()
                setProfile(data)
            } else {
                setProfile(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    // Aksi Logout 
    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            await supabase.auth.signOut()
            router.push("/")
            router.refresh()
        } catch (err) {
            console.error("Gagal logout:", err)
            setIsLoggingOut(false)
        }
    }

    // Cek active state route saat ini
    const isLinkActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin"
        }
        return pathname.startsWith(href)
    }

    const currentNav = ADMIN_SIDEBAR_LINKS.find((link) => isLinkActive(link.href))
    const currentPageTitle = currentNav?.label ?? "Panel Admin"

    // Render isi navigasi sidebar (dipakai oleh desktop & mobile sheet)
    const renderSidebarContent = (onLinkClick?: () => void) => (
        <div className="flex flex-col h-full justify-between">
            <div>
                {/* Brand Logo & Nama */}
                <div className="p-5 border-b border-border/60">
                    <Link
                        href="/admin"
                        onClick={onLinkClick}
                        className="flex items-center gap-3 group"
                    >
                        <Image 
                            src="/logo.png"
                            alt="Logo Brebes"
                            width={36}
                            height={36}
                            priority
                            className="w-9 h-auto drop-shadow transition-transform group-hover:scale-105"
                        />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground tracking-tight leading-tight">
                                Admin Prokompim
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium">
                                Setda Kab. Brebes
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Menu Navigasi */}
                <nav className="p-3 space-y-1">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Menu Utama
                    </div>
                    {ADMIN_SIDEBAR_LINKS.map((link) => {
                        const Icon = ICON_MAP[link.icon] || LayoutDashboard
                        const active = isLinkActive(link.href)

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onLinkClick}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all",
                                    active
                                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground border-l-2 border-transparent"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />      
                                <span>{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Bagian Bawah: Link Web Publik & Logout */}
            <div className="p-3 border-t border-border/60 space-y-1">
                <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Lihat Website
                    </span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                        Live
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
                >   
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>{isLoggingOut ? "Keluar..." : "Keluar (Logout)"}</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* Sidebar Desktop (w-64) */}
            <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-40 bg-muted/30 border-r border-border">
                {renderSidebarContent()}
            </aside>

            {/* Area Konten Kanan */}
            <div className="flex-1 flex flex-col md:pl-64 min-w-0">
                {/* Topbar */}
                <header className="sticky top-0  z-30 h-16 border-b border-border bg-background/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Hamburger Sheet Mobile */}
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger
                                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                                aria-label="Buka Menu Sidebar"
                            >
                                <Menu className="w-5 h-5" />
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="p-0 w-64 bg-muted/30 border-r border-border flex flex-col"
                            >
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Navigasi Admin</SheetTitle>
                                </SheetHeader>
                                {renderSidebarContent(() => setMobileOpen(false))}
                            </SheetContent>
                        </Sheet>

                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                                {currentPageTitle}
                            </h1>
                            <p className="text-[11px] text-muted-foreground hidden sm:block">
                                Panel Administrasi Portal Humas & Komunikasi Pimpinan
                            </p>
                        </div>
                    </div>

                    {/* User Profil Info */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-foreground leading-tight">
                                {profile?.nama || "Administrator"}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-tight truncate max-w-[180px]">
                                {user?.email || "admin@brebeskab.go.id"}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs shadow-sm ring-2 ring-primary/20">
                            {(profile?.nama || user?.email || "A")?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Konten Halaman */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}