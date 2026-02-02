'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Eye, EyeOff, User, CheckCircle2, Circle } from 'lucide-react'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const passwordRequirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains a number', met: /\d/.test(password) },
        { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
    ]

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (!passwordRequirements.every(r => r.met)) {
            toast.error('Please meet all password requirements')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else {
            toast.success('Check your email to verify your account!')
            router.push('/login')
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-neutral-500"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-neutral-500"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-neutral-500"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {password.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold px-1">Security Standards</p>
                        {passwordRequirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                                {req.met ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                ) : (
                                    <Circle className="w-3 h-3 text-neutral-600" />
                                )}
                                <span className={req.met ? 'text-neutral-300' : 'text-neutral-500'}>{req.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Create Account'}
                </button>
            </form>

            <div className="flex items-center gap-2 px-1">
                <input type="checkbox" className="rounded-sm bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500/20 w-4 h-4" required />
                <p className="text-[11px] text-neutral-500">
                    I agree to the <Link href="/terms" title="title text" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" title="title text" className="text-blue-400 hover:underline">Privacy Policy</Link>
                </p>
            </div>

            <p className="text-center text-sm text-neutral-400">
                Already have an account?{' '}
                <Link href="/login" title="title text" className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
