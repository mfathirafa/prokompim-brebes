"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword]= useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // 1. Validasi Nama
        if (nama.trim().length < 3) {
            setError("Nama lengkap harus memiliki minimal 3 karakter.");
            return;
        }

        // 2. Validasi Format Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Format alamat email tidak valid.");
            return;
        }

        // 3. Validasi Panjang Password
        if (password.length < 8) {
            setError("Kata sandi harus memiliki minimal 8 karakter.");
            return;
        }

        // 4. Validasi Kesamaan Konfirmasi Password
        if (password !== confirmPassword) {
            setError("Konfirmasi kata sandi tidak cocok dengab kata sandi.");
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient()
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nama: nama.trim(),
                    },
                },
            });

            if (signUpError) {
                if (
                    signUpError.message.toLowerCase().includes("user already registered") ||
                    signUpError.message.toLowerCase().includes("already exists")
                ) {
                    setError("Email ini sudah terdaftar. Silahkan masuk atau gunakan email lain.");
                } else {
                    setError(signUpError.message || "Gagal melakukan pendaftaran akun. Silahkan coba lagi.");
                }
                setLoading(false);
                return;
            }

            // Berhasil daftar: arahkan ke halaman login dengan notifikasi sukses
            router.push("/login?registered=true");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan yang tidak terduga. Silahkan coba lagi."
            );
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl border border-border bg-card shadow-lg">
            <CardHeader className="text-center space-y-1 pb-4">
                <CardTitle className="text-xl font-bold tracking-tight text-foreground normal-case">
                    Daftar Akun Baru
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    Lengkapi formulir di bawah untuk membuat akun publik Prokompim.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Alert Pesan Error */}
                {error && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form Pendaftaran */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="space-y-1.5">
                        <Label htmlFor="nama" className="text-xs font-semibold text-foreground">
                            Nama Lengkap
                        </Label>
                        <Input 
                            id="nama"
                            type="text"
                            autoComplete="name"
                            placeholder="Contoh: Budi Santoso"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            disabled={loading}
                            className="bg-background/60 focus:bg-background"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                            Alamat Email
                        </Label>
                        <Input 
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="bg-background/60 focus:bg-background"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                            Kata Sandi (Min. 8 karakter)
                        </Label>
                        <Input 
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Minimal 8 karakter"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="bg-background/60 focus:bg-background"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                            Ulangi Kata Sandi
                        </Label>
                        <Input 
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Ulangi kata sandi di atas"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            className="bg-background/60 focus:bg-background"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-10 transition-colors gap-2 cursor-pointer mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Mendaftarkan...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                <span>Daftar Akun</span>
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-border/50 pt-4 pb-2 text-xs text-muted-foreground">
                <p>
                    Sudah memiliki akun?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                    >
                        Masuk di sini
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}