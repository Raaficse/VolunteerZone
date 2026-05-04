'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
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

            const role = user.email === 'raaficse@gmail.com' ? 'admin' : profile?.role

            if (role !== 'admin') {
                router.push('/dashboard')
                return
            }
            setLoading(false)
        }

        checkAuth()
    }, [supabase, router])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar role="admin" />
            <main className="flex-1 lg:ml-64 overflow-y-auto pt-16 lg:pt-0">
                <div className="container mx-auto px-4 sm:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
