import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { link } from "fs";

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-primary text-white border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Kolom 1: Identitas Brand & Pemka Brebes */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                        <Image 
                            src="/logo.png"
                            alt="Logo Kabupaten Brebes"
                            width={48}
                            height={48}
                            className="w-11 h-auto drop-shadow"
                        />
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">{SITE_CONFIG.name}</h3>
                            <p className="text-xs text-white/80 font-medium">Kabupaten Brebes</p>
                        </div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed max-w-md">
                        {SITE_CONFIG.fullName}. Menyajikan rilis berita resmi pimpinan, dokumentasi kegiatan protokoler, dan layanan informasi dokumen daerah.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        <a 
                            href={SITE_CONFIG.social.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a 
                            href={SITE_CONFIG.social.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a 
                            href={SITE_CONFIG.social.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                            aria-label="Youtube"
                        >
                            <Youtube className="w-4 h-4" />
                        </a>
                        <a 
                            href={SITE_CONFIG.social.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Kolom 2: Tautan Navigasi Cepat */}
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold mb-4">
                        Navigasi Cepat
                    </h4>
                    <ul className="space-y-2 text-sm">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-white/80 hover:text-brand-gold transition-colors inline-block py-0.5"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Kolom 3: Kontak & Alamat Resmi */}
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold mb-4">
                        Kontak Resmi
                    </h4>
                    <ul className="space-y-3 text-sm text-white/80">
                        <li className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                            <span>{SITE_CONFIG.address}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>{SITE_CONFIG.phone}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                            <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors">
                                {SITE_CONFIG.email}
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Baris Bawah / Copyright */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
                <p>
                    © {currentYear} {SITE_CONFIG.name}. Pemerintah Kabupaten Brebes. All rights reserved.
                </p>
                <p className="text-white/40">
                    Portal Rilis Berita & Layanan Protokoler
                </p>
            </div>
            </div>
        </footer>
    )
}