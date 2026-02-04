"use client";

import { Button } from "@/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8 text-center bg-zinc-950 border border-white/5 p-12 rounded-sm shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-8 p-4 rounded-sm bg-white/5 border border-white/10">
                        <Sparkles className="w-8 h-8 text-amber-500" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight mb-4">Welcome back</h1>
                    <p className="text-zinc-500 text-sm mb-12 max-w-xs mx-auto">
                        Sign in to your LogLens account to continue managing your infrastructure.
                    </p>

                    <Link href="/api/auth/login" className="w-full">
                        <Button className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-sm font-bold uppercase tracking-widest text-xs transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Sign in with AuthKit
                        </Button>
                    </Link>

                    <div className="mt-8 pt-8 border-t border-white/5 w-full text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                        Secure authentication provided by WorkOS
                    </div>
                </div>
            </div>
        </div>
    );
}

