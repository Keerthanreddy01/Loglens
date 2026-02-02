'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else {
            setSubmitted(true)
            toast.success('Reset link sent to your email!')
        }
    }

    if (submitted) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Check your email</h2>
                <p className="text-sm text-neutral-400">
                    We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-neutral-200 transition-all mt-4"
                >
                    Try another email
                </button>
                <Link href="/login" title="title text" className="flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-2">
                <h2 className="text-xl font-bold text-white">Forgot password?</h2>
                <p className="text-sm text-neutral-400">No worries, we'll send you reset instructions.</p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-neutral-500"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Send Reset Link'}
                </button>
            </form>

            <Link href="/login" title="title text" className="flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to login
            </Link>
        </div>
    )
}
