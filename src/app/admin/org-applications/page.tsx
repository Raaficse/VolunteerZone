'use client'

import { createClient } from '@/lib/supabase/client'
import OrgApplicationList, { OrgApplication } from './OrgApplicationList'
import { Building2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function OrgApplicationsPage() {
    const [applications, setApplications] = useState<OrgApplication[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchApplications = async () => {
            const { data } = await supabase
                .from('users')
                .select('*, organization_profiles(*)')
                .eq('status', 'pending')
                .eq('role', 'organization')
                .order('created_at', { ascending: false })
            
            setApplications((data as unknown as OrgApplication[]) || [])
            setLoading(false)
        }

        fetchApplications()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-950">Organization Applications</h1>
                    <p className="text-slate-500 mt-1">Review and manage new organization partnership requests.</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center gap-2 text-primary font-semibold">
                    <Building2 className="w-5 h-5" />
                    <span>{applications.length} Pending</span>
                </div>
            </div>

            <OrgApplicationList initialApplications={applications} />
        </div>
    )
}
