"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import type { User } from "@supabase/supabase-js"
import { Menu, LogOut, LayoutDashboard, Download } from "lucide-react"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<{ nama: string; role: string } | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    // 1. Scroll listener: ganti transparan -> solid saat scroll > 50px
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // 2. Supabase Auth Listener
    useEffect(() => {
        async function loadUser() {
            const { data: { user: currentUser } } = await supabase.auth.getUser()
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
        loadUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
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
            }
        )
        
        return () => subscription.unsubscribe()
    }, [supabase])

    // 3. Logout action
    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push("/")
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-primary/95 backdrop-blur-md shadow-md py-3 border-b border-white/10"
                    : "bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                {/* Brand Logo & Nama */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/logo.png"
                        alt="Logo Brebes"
                        width={40}
                        height={40}
                        priority
                        className="w-9 h-auto drop-shadow transition-transform group-hover:scale-105"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-white tracking-tight leading-tight">
                            {SITE_CONFIG.name}
                        </span>
                        <span className="text-[10px] text-white/75 font-medium tracking-wide">
                            Kabupaten Brebes
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                    {NAV_LINKS.map((link) => {
                        const isActive = 
                            pathname === link.href || 
                            (link.href !== "/" && pathname.startsWith(link.href))
                    
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-sm transition-colors font-medium",
                                isActive
                                    ? "text-brand-gold bg-white/15 font-semibold"
                                    : "text-white/85 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {link.label}
                        </Link>
                    )
                    })}
                </nav>

                {/* Desktop User Auth State */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 text-white hover:bg-white/15 rounded-full px-3 py-1.5 h-auto"
                                >
                                    <div className="w-7 h-7 rounded-full bg-brand-gold text-primary font-bold flex items-center justify-center text-xs">
                                        {(profile?.nama || user.email)?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium max-w-[120px] truncate">
                                        {profile?.nama || "Member"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <div>
                                        <p className="text-sm font-semibold leading-none">{profile?.nama || "Pengguna"}</p>
                                        <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                                        <span className="mt-1.5 inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-sky">
                                            Role: {profile?.role || "member"}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>

                                {profile?.role === "admin" && (
                                    <DropdownMenuItem
                                        render={<Link href="/admin" />}
                                        className="cursor-pointer flex items-center gap-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-brand-sky" />
                                        <span>Dashboard Admin</span>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                    render={<Link href="/download" />}
                                    className="cursor-pointer flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4 text-brand-sky" />
                                    <span>Dokumen Unduhan</span>
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Keluar (Logout)</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            render={<Link href="/login" />}
                            size="sm"
                            className="rounded-full bg-brand-gold hover:bg-brand-gold/90 text-zinc-950 font-semibold px-4 shadow"
                        >
                            Masuk
                        </Button>
                    )}
                </div>

                {/* Mobile Hamburger Menu (Sheet) */}
                <div className="md:hidden flex items-center">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger
                            className="p-2 text-white hover:bg-white/10 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Buka Menu"
                        >
                            <Menu className="w-6 h-6" />
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-primary text-white border-l-white/10 w-72 flex flex-col p-6">
                            <SheetHeader className="text-left pb-4 border-b border-white/10">
                                <SheetTitle className="flex items-center gap-2.5 text-white">
                                    <Image src="/logo.png" alt="Logo" width={28} height={28} className="w-7 h-auto" />
                                    <span className="font-bold text-base">{SITE_CONFIG.name}</span>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex-1 py-6 flex flex-col justify-between">
                                <nav className="flex flex-col space-y-2">
                                    {NAV_LINKS.map((link) => {
                                        const isActive = 
                                            pathname === link.href ||
                                            (link.href !== "/" && pathname.startsWith(link.href))

                                    return(
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "px-3 py-2 rounded-lg text-sm transition-colors",
                                                isActive
                                                   ? "bg-white/15 text-brand-gold font-semibold"    
                                                   : "text-white/80 hover:bg-white/10 hover:text-white"                                            
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                    })}
                                </nav>

                                {/* Mobile Auth Button */}
                                <div className="pt-6 border-t border-white/10">
                                    {user ? (
                                        <div className="space-y-3">
                                            <div className="px-3 py-2 bg-white/10 rounded-lg text-xs">
                                                <p className="font-semibold text-white truncate">{profile?.nama || user.email}</p>
                                                <p className="text-white/70 capitalize">Role: {profile?.role || "member"}</p>
                                            </div>
                                            {profile?.role === "admin" && (
                                                <Button
                                                    render={<Link href="/admin" />}
                                                    variant="outline"
                                                    className="w-full text-white border-white/30 bg-white/5 hover:bg-white/20"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    Dashboard Admin
                                                </Button>
                                            )}
                                            <Button
                                                variant="destructive"
                                                className="w-full"
                                                onClick={() => {
                                                    setMobileOpen(false)
                                                    handleLogout()
                                                }}
                                            >
                                                Keluar (Logout)
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            render={<Link href="/login" />}
                                            className="w-full bg-brand-gold hover:bg-brand-gold/90 text-zinc-950 font-semibold"
                                            onClick={() => setMobileOpen(false)}
                                        >   
                                            Masuk ke Akun
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                
                </div>
            </div>
        </header>
    )
}