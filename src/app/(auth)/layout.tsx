import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 px-4 py-12">
            {/* Header Identitas & Logo */}
            <div className="mb-6 flex flex-col items-center text-center">
                <Link href="/" className="inline-flex items-center gap-3 group">
                    <div className="relative w-12 h-12">
                        <Image 
                            src="/logo.png"
                            alt="Logo Brebes"
                            fill
                            sizes="48px"
                            className="object-contain transition-transform group-hover:scale-105"
                            priority
                        />
                    </div>
                    <div className="text-left">
                        <h1 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                            Prokompim Brebes
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">
                            Portal Bagian Protokol & Komunikasi Pimpinan
                        </p>
                    </div>
                </Link>
            </div>

            {/* Konten Form Auth */}
            <div className="w-full max-w-md">
                {children}
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Bagian Prokompim Setda Kabupaten Brebes.</p>
            </div>
        </div>
    );
}