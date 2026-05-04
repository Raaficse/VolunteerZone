'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import OrgApplyForm from './OrgApplyForm'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function OrgApplyPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            
            if (!authUser) {
                router.push('/organization/login')
                return
            }
            
            setUser(authUser)

            const { data: profileData } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single()

            setProfile(profileData)

            if (profileData?.status === 'approved' && profileData?.role === 'organization') {
                router.push('/dashboard')
                return
            }

            if (profileData?.status === 'pending' && profileData?.role === 'organization') {
                router.push('/dashboard/pending')
                return
            }

            setLoading(false)
        }

        checkUser()
    }, [router, supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <OrgApplyForm userEmail={user.email!} userName={profile?.full_name || ''} />
        </div>
    )
}
