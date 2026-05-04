'use client'

import { forgotPassword, resendRecoveryOtp, verifyRecoveryOtp } from '@/app/auth/actions'
import { useState } from 'react'
import Link from 'next/link'
import { KeyRound, Loader2, ArrowLeft, Key } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [resending, setResending] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [showOtp, setShowOtp] = useState(false)
    const [email, setEmail] = useState('')
    const router = useRouter()

    const startResendTimer = () => {
        setResendTimer(60)
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) { clearInterval(timer); return 0 }
                return prev - 1
            })
        }, 1000)
    }

    const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        const emailValue = formData.get('email') as string
        setEmail(emailValue)
        const res = await forgotPassword(emailValue)
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        } else {
            setShowOtp(true)
            setLoading(false)
            startResendTimer()
        }
    }

    const handleResend = async () => {
        if (resendTimer > 0) return
        setResending(true)
        setError(null)
        const res = await resendRecoveryOtp(email)
        if (res?.error) {
            setError(res.error)
        } else {
            startResendTimer()
        }
        setResending(false)
    }

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setVerifying(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        const code = formData.get('code') as string
        const res = await verifyRecoveryOtp(email, code)
        if (res?.error) {
            setError(res.error)
            setVerifying(false)
        } else {
            router.push('/auth/reset-password')
        }
    }

    // ── OTP STEP ──────────────────────────────────────────────────────────────
    if (showOtp) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-12 px-5 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-100 mx-auto w-full">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Key className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Check Your Email</h2>
                        <p className="text-slate-500 text-center mb-8 text-sm">
                            We've sent a 6-digit recovery code to <span className="font-bold text-slate-900">{email}</span>.
                        </p>

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Recovery Code</label>
                                <input
                                    name="code"
                                    type="text"
                                    required
                                    inputMode="numeric"
                                    maxLength={6}
                                    className="block w-full text-center text-4xl font-bold tracking-[0.2em] py-4 border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-0 transition-all bg-slate-50 text-slate-900"
                                    placeholder="000000"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={verifying}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-xs font-black text-white bg-slate-900 hover:bg-black transition-all active:scale-95 disabled:opacity-50 tracking-[0.2em] uppercase"
                            >
                                {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CONFIRM'}
                            </button>
                        </form>

                        <div className="mt-8 text-center space-y-4">
                            <p className="text-sm text-slate-500">
                                Didn't receive the code?{' '}
                                <button
                                    onClick={handleResend}
                                    disabled={resending || resendTimer > 0}
                                    className="text-primary font-bold hover:text-primary-dark transition-colors disabled:opacity-50 disabled:text-slate-400"
                                >
                                    {resending ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Get a new code'}
                                </button>
                            </p>
                            <button
                                onClick={() => { setShowOtp(false); setError(null) }}
                                className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-center w-full"
                            >
                                ← Try a different email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ── EMAIL STEP ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-14 h-14 bg-white rounded-[1.6rem] shadow-xl shadow-primary/10 flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                        <KeyRound className="w-7 h-7 text-primary" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-slate-900 px-2">Forgot Password?</h2>
                <p className="mt-2 text-center text-sm text-slate-600 px-4">
                    Enter your email and we'll send you a 6-digit recovery code.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-5 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-100 mx-auto w-full">
                    <form className="space-y-6" onSubmit={handleSendCode}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email address</label>
                            <div className="mt-1">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Recovery Code'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors gap-1.5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
