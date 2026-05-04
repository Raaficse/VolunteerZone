'use client'

import { createClient } from '@/lib/supabase/client'
import ApplicationList from './ApplicationList'
import { ClipboardCheck, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchApplications = async () => {
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
            
            setApplications(data || [])
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
                    <h1 className="text-3xl font-bold text-slate-950">Volunteer Applications</h1>
                    <p className="text-slate-500 mt-1">Review and manage new volunteer joining requests.</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center gap-2 text-primary font-semibold">
                    <ClipboardCheck className="w-5 h-5" />
                    <span>{applications.length} Pending</span>
                </div>
            </div>

            <ApplicationList initialApplications={applications} />
        </div>
    )
}
