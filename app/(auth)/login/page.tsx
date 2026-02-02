'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { CircuitBackground } from '@/components/auth/circuit-background'

// Custom SVGs for social icons to match premium look
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c3.15 0 5.79-1.05 7.72-2.83l-3.57-2.77c-.98.66-2.23 1.06-3.75 1.06-2.88 0-5.32-1.95-6.19-4.56H2.18v2.85c1.92 3.82 5.85 6.45 10.42 6.45z" />
        <path fill="#FBBC05" d="M5.81 14.34c-.23-.69-.35-1.43-.35-2.2s.12-1.51.35-2.2V7.1H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.9l3.63-2.56z" />
        <path fill="#EA4335" d="M12 5.38c1.72 0 3.26.59 4.47 1.76l3.35-3.35C17.79 1.83 15.15 1 12 1 7.43 1 3.5 3.63 1.58 7.45l3.63 2.56c.88-2.61 3.32-4.63 6.19-4.63z" />
    </svg>
)

const AppleIcon = () => (
    <svg viewBox="0 0 384 512" className="w-5 h-5 fill-white">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.1-77.5-19.1-36.9 0-103.4 18-146.1 124.5C33.9 444.5 105.9 480 155.1 480c36.2 0 49.3-22.3 93.3-22.3 43.6 0 55.4 22.3 93.7 22.3 49.1 0 119.5-35.1 154.4-123.6-1.5-.9-2.9-1.8-4.4-2.7zM285.4 97c0-23 11-44.4 28.5-59.4-22.9-1.5-44.6 11.2-58.8 30.2-14.2 18.9-18.4 41.6-14.5 61.3 23.4 1.8 45-10 59.2-28.8 1.4-1.1 2.9-2.2 4.3-3.3z" />
    </svg>
)

const XIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
    </svg>
)

export default function LoginPage() {
    const [loginState, setLoginState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [userName, setUserName] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoginState('loading')

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setLoginState('error')
            toast.error(error.message)
            // Reset error after animation
            setTimeout(() => setLoginState('idle'), 2000)
        } else {
            const name = data.user?.email?.split('@')[0] || 'Member'
            setUserName(name)
            setLoginState('success')

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/dashboard')
                router.refresh()
            }, 3000)
        }
    }

    const handleOAuth = async (provider: 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) toast.error(error.message)
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4">
            <CircuitBackground isError={loginState === 'error'} />

            <AnimatePresence mode="wait">
                {loginState === 'success' ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-50 text-center space-y-4"
                    >
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-bold tracking-tight text-white mb-2"
                        >
                            Welcome back, {userName}
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-neutral-400 text-lg"
                        >
                            Initializing your log intelligence environment...
                        </motion.p>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring' }}
                            className="flex justify-center pt-8"
                        >
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-2 h-2 rounded-full bg-blue-500"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="login-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-[420px] relative z-10"
                    >
                        {/* Logo Orb Area */}
                        <div className="flex justify-center mb-8">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/20"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-2 rounded-full border border-blue-500/10"
                                />
                                <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                                    <div className="w-10 h-10 rounded-full border-t-2 border-white/40 animate-spin-slow" />
                                    <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                                <p className="text-sm text-neutral-400">
                                    Don't have an account yet?{' '}
                                    <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                                        Sign up
                                    </Link>
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="email address"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-12 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-light"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-12 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-light"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loginState === 'loading'}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] disabled:opacity-50"
                                >
                                    {loginState === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/[0.05]" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold">
                                    <span className="bg-[#0a0a0a] px-3 text-neutral-600">OR</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => { }}
                                    className="flex items-center justify-center h-12 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all"
                                >
                                    <AppleIcon />
                                </button>
                                <button
                                    onClick={() => handleOAuth('google')}
                                    className="flex items-center justify-center h-12 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all"
                                >
                                    <GoogleIcon />
                                </button>
                                <button
                                    onClick={() => { }}
                                    className="flex items-center justify-center h-12 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all"
                                >
                                    <XIcon />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
