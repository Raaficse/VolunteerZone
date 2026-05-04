'use client'

import { createClient } from '@/lib/supabase/client'
import ApplyContainer from './ApplyContainer'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function Page() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) {
                setLoading(false)
                return
            }
            setUser(authUser)

            const { data: profileData } = await supabase
                .from('users')
                .select('full_name, status, role')
                .eq('id', authUser.id)
                .single()
            
            setProfile(profileData)
            setLoading(false)
        }

        fetchData()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) return null

    return (
        <ApplyContainer
            userEmail={user.email!}
            userName={profile?.full_name || ''}
            initialStatus={profile?.status || 'unapplied'}
            role={profile?.role || 'volunteer'}
        />
    )
}
