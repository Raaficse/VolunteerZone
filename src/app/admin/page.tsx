'use client'

import { createClient } from '@/lib/supabase/client'
import { Users, Calendar, Clock, Building2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        volCount: 0,
        orgCount: 0,
        totalEvents: 0,
        upcomingEvents: 0
    })
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchStats = async () => {
            const { count: volCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'volunteer')

            const { count: orgCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'organization')

            const { data: events } = await supabase
                .from('events')
                .select('event_date')

            const totalEvents = events?.length || 0
            const upcomingEvents = events?.filter(e => new Date(e.event_date) > new Date()).length || 0

            setStats({
                volCount: volCount || 0,
                orgCount: orgCount || 0,
                totalEvents,
                upcomingEvents
            })
            setLoading(false)
        }

        fetchStats()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600 mt-2">Overview of platform activities and statistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Volunteers</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.volCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Organizations</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.orgCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Events</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalEvents}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Upcoming Events</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.upcomingEvents}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
