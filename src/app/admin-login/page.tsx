'use client'

import { login } from '@/app/auth/actions'
import Link from 'next/link'
import { HeartHandshake, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
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
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-primary/20 p-3 rounded-full">
                        <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-white tracking-tight px-2">Admin Access</h2>
                <p className="mt-2 text-center text-sm text-slate-400 px-4">
                    Secure management portal for VolunteerZone administrators
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-slate-800 py-8 px-5 shadow-2xl rounded-2xl sm:px-10 border border-slate-700 mx-auto w-full">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Admin Email</label>
                            <div className="mt-1">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@volunteerzone.org"
                                    className="appearance-none block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg shadow-sm text-white placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="appearance-none block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg shadow-sm text-white placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Management Portal'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <Link href="/" className="font-medium text-slate-400 hover:text-white flex items-center justify-center gap-2">
                            Back to main site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
