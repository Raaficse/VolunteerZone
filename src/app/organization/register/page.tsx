'use client'

import { signup, verifyOtp, resendOtp } from '@/app/auth/actions'
import Link from 'next/link'
import { Building2, Loader2, Key, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OrganizationRegisterPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [resending, setResending] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)
    const [email, setEmail] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        const emailValue = formData.get('email') as string
        setEmail(emailValue)
        const res = await signup(formData, 'organization')

        if (res?.error) {
            setError(res.error)
            setLoading(false)
        } else {
            setShowOtp(true)
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setVerifying(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        const code = formData.get('code') as string

        const res = await verifyOtp(email, code, 'signup')

        if (res?.error) {
            setError(res.error)
            setVerifying(false)
        } else {
            router.push('/dashboard')
        }
    }

    const handleResend = async () => {
        if (resendTimer > 0) return
        setResending(true)
        setError(null)
        const res = await resendOtp(email, 'signup')
        if (res?.error) {
            setError(res.error)
        } else {
            setResendTimer(60)
            const timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        setResending(false)
    }

    if (showOtp) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
                <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white py-12 px-8 shadow-2xl shadow-slate-200/50 sm:rounded-[2.5rem] sm:px-12 border border-slate-100">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Key className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Verify Organization</h2>
                        <p className="text-slate-500 text-center mb-8 text-sm font-medium">
                            We've sent a 6-digit verification code to <span className="font-bold text-slate-900">{email}</span>.
                        </p>

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Verification Code</label>
                                <input
                                    name="code"
                                    type="text"
                                    required
                                    inputMode="numeric"
                                    maxLength={6}
                                    className="block w-full text-center text-4xl font-bold tracking-[0.2em] py-5 border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-0 transition-all bg-slate-50 text-slate-900"
                                    placeholder="000000"
                                />
                            </div>

                            {error && (
                                <div className="text-xs font-bold text-rose-500 bg-rose-50 p-4 rounded-2xl border border-rose-100/50 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
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
                                onClick={() => setShowOtp(false)}
                                className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors flex items-center justify-center w-full uppercase tracking-widest gap-2"
                            >
                                ← Back to Registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Building2 className="w-12 h-12 text-primary" />
                </div>
                <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight px-2">Register Organization</h2>
                <p className="mt-2 text-center text-sm text-slate-600 px-4">
                    Join VolunteerZone to post events and find volunteers.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-5 shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-2xl sm:px-10 border border-slate-100 mx-auto w-full">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Organization Name</label>
                            <div className="mt-1">
                                <input
                                    name="full_name"
                                    type="text"
                                    required
                                    placeholder="e.g., Red Cross, Save the Children"
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email address</label>
                            <div className="mt-1">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
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
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Organization'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-slate-600">Already have an organization account? </span>
                        <Link href="/organization/login" className="font-medium text-primary hover:text-primary-dark">
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
