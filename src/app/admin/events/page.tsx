'use client'

import { createClient } from '@/lib/supabase/client'
import { EventsHeader } from './components'
import { AdminEventCard } from './AdminEventCard'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminEventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select('*, event_registrations(*, users(full_name, phone))')
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
            <EventsHeader />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No events created</h3>
                        <p className="text-slate-500">Create your first event to start accepting volunteers.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <AdminEventCard key={event.id} event={event} />
                    ))
                )}
            </div>
        </div>
    )
}
