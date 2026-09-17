"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get("registered") === "true";
    const redirectPath = searchParams.get("redirect") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Validasi Sisi Klien
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Format alaman email tidak valid.");
            return;
        }

        if (!password) {
            setError("Kata sandi tidak boleh kosong.");
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                if (authError.message.toLowerCase().includes("Invalid login credentials")) {
                    setError("Email atau kata sandi salah. SIlahkan periksa kembali.")
                } else {
                    setError(authError.message || "Terjadi kesalahan saat masuk. Coba lagi nanti.");
                }
                setLoading(false);
                return;
            }

            // Berhasil login: arahkan ke halaman tujuan dan refresh session
            router.push(redirectPath);
            router.refresh();
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan yang tidak terduga. Silahkan coba lagi."
            );
            setLoading(false);
        }
    };

    return(
        <Card className="rounded-2xl border border-border bg-card shadow-lg">
            <CardHeader className="text-center space-y-1 pb-4">
                <CardTitle className="text-xl font-bold tracking-tight text-foreground normal-case">
                    Masuk ke Akun Anda
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    Silahkan masukkan kredensial akun terdaftar Anda untuk melanjutkan.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Alert Sukses Registrasi */}
                {isRegistered && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Pendaftaran berhasil! Silahkan masuk menggunakan akun baru anda.</span>
                    </div>
                )}

                {/* Alert Pesan Error */}
                {error && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form Input */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                                Kata Sandi
                            </Label>
                        </div>
                        <Input 
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <span>Masuk</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-border/50 pt-4 pb-2 text-xs text-muted-foreground">
                <p>
                    Belum memiliki akun?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                    >
                        Daftar sekarang
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="text-center py-12 text-sm text-muted-foreground">
                    Memuat formulir masuk...
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}