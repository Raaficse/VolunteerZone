'use client'

import { login } from '@/app/auth/actions'
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ModsLoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        const res = await login(formData)
        
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        } else if (res?.redirectUrl) {
            router.push(res.redirectUrl)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h2 className="mt-8 text-center text-3xl md:text-4xl font-black text-slate-900 tracking-tight px-2">MODERATOR PORTAL</h2>
                <p className="mt-2 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs px-4">Verify Events & Manage Impact</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/50 rounded-[2rem] sm:rounded-[2.5rem] sm:px-12 border border-slate-200/60 mx-auto w-full">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mod Credentials</label>
                            <div className="mt-2">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="mod@vms.com"
                                    required
                                    className="appearance-none block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium text-slate-900 shadow-inner"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Token</label>
                                <Link 
                                    href="/forgot-password" 
                                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="mt-2 relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="appearance-none block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium text-slate-900 shadow-inner pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-xs font-bold text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-center gap-2">
                                <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-3 py-4 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-slate-900 hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                VERIFY & LOG IN
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
