'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [userStatus, setUserStatus] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()
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
                .select('role, status')
                .eq('id', user.id)
                .single()

            const role = user.email === 'raaficse@gmail.com' ? 'admin' : profile?.role
            const status = profile?.status || 'unapplied'

            if (role === 'admin') {
                router.push('/admin')
                return
            }

            // Status-based redirection logic (CSR)
            if ((status === 'unapplied' || status === 'disapproved') && pathname !== '/apply') {
                router.push('/apply')
                return
            }
            if (status === 'pending' && pathname !== '/pending') {
                router.push('/pending')
                return
            }
            if (status === 'approved' && (pathname === '/apply' || pathname === '/pending')) {
                router.push('/dashboard')
                return
            }

            setUserRole(role)
            setUserStatus(status)
            setLoading(false)
        }

        checkUser()
    }, [router, supabase, pathname])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    const isApproved = userStatus === 'approved'

    return (
        <div className="flex h-screen bg-slate-50">
            {isApproved && <Sidebar role={userRole as 'volunteer' | 'organization'} />}
            <main className={`flex-1 overflow-y-auto ${isApproved ? 'lg:ml-64 px-4 sm:px-8 py-8 pt-16 lg:pt-8' : 'flex flex-col items-center px-4 py-8'}`}>
                <div className={`${isApproved ? 'container mx-auto' : 'w-full max-w-2xl my-auto'}`}>
                    {children}
                </div>
            </main>
        </div>
    )
}
