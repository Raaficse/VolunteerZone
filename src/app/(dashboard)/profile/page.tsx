'use client'

import { createClient } from '@/lib/supabase/client'
import { ProfileView } from './components'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [certifications, setCertifications] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            
            if (!user) {
                setLoading(false)
                return
            }

            const { data: userProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            setProfile(userProfile)
            setLoading(false)
        }

        fetchProfile()
    }, [supabase])

    if (loading) {
         return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!profile) return null

    const isOrg = profile.role === 'organization'

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    {isOrg ? 'Organization Profile' : 'Volunteer Profile'}
                </h1>
                <p className="text-slate-600 mt-2">
                    {isOrg ? 'Your organization details and partnership information.' : 'Your personal information and volunteer details.'}
                </p>
            </div>

            <ProfileView initialData={profile} />
        </div>
    )
}

