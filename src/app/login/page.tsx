'use client'

import { login } from '@/app/auth/actions'
import Link from 'next/link'
import { HeartHandshake, Loader2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <HeartHandshake className="w-12 h-12 text-primary" />
                </div>
                <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight px-2">Volunteer Login</h2>
                <p className="mt-2 text-center text-sm text-slate-600 px-4">
                    Enter your volunteer credentials to access the portal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-5 shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-2xl sm:px-10 border border-slate-100 mx-auto w-full">
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <Link 
                                    href="/forgot-password" 
                                    className="text-[11px] font-bold text-primary hover:text-primary-dark uppercase tracking-widest transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
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
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <div className="text-sm">
                            <span className="text-slate-600">Don't have an account? </span>
                            <Link href="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
                                Register here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
