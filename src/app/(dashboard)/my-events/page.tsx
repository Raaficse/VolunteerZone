'use client'

import { createClient } from '@/lib/supabase/client'
import { Calendar, Loader2 } from 'lucide-react'
import { OrgEventsHeader } from './OrgEventsHeader'
import { OrgEventCard } from './OrgEventCard'
import { useEffect, useState } from 'react'

export default function OrgEventsDashboard() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchEvents = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            const { data } = await supabase
                .from('events')
                .select('*, event_registrations(*, users(full_name, phone))')
                .eq('created_by', user.id)
                .order('event_date', { ascending: true })
            
            setEvents(data || [])
            setLoading(false)
        }

        fetchEvents()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <OrgEventsHeader />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(events.length === 0) ? (
                    <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-primary/40" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Host your first event</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Start making an impact by creating opportunities for volunteers to join your mission.
                        </p>
                    </div>
                ) : (
                    events.map((event) => (
                        <OrgEventCard key={event.id} event={event} />
                    ))
                )}
            </div>
        </div>
    )
}
