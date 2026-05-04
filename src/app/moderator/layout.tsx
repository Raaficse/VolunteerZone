'use client'

import { ShieldCheck, LogOut, LayoutDashboard, CheckSquare, Loader2, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/app/auth/actions'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ModeratorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'moderator') {
                router.push('/dashboard')
                return
            }
            setIsLoading(false)
        }
        checkUser()
    }, [router, supabase])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-6 z-30 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="font-black text-sm tracking-widest uppercase">Moderator</span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Moderator Sidebar */}
            <div className={`
                w-72 bg-slate-900 text-white flex flex-col fixed h-screen z-30 transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 pb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/10 rounded-2xl">
                            <ShieldCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none">MODERATOR</h1>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Verify System Access</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <Link
                        href="/moderator"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all text-sm border-2 ${pathname === '/moderator' ? 'bg-white text-slate-900 border-white shadow-xl shadow-white/10' : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'}`}
                    >
                        <CheckSquare className="w-5 h-5" />
                        APPROVE QUEUE
                    </Link>
                    <Link
                        href="/moderator/manage"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all text-sm border-2 ${pathname === '/moderator/manage' ? 'bg-white text-slate-900 border-white shadow-xl shadow-white/10' : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        MANAGE EVENTS
                    </Link>
                </nav>

                <div className="p-8">
                    <button
                        onClick={async () => {
                            await logout()
                            window.location.href = '/'
                        }}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-rose-600/10 text-rose-500 font-black rounded-2xl hover:bg-rose-600 hover:text-white transition-all text-xs border border-rose-500/20 shadow-lg shadow-rose-500/5"
                    >
                        <LogOut className="w-4 h-4" />
                        SECURE LOGOUT
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 p-6 lg:p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white min-h-screen pt-24 lg:pt-10">
                {children}
            </main>
        </div>
    )
}
