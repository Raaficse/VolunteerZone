'use client'

import { createClient } from '@/lib/supabase/client'
import { AdminEventCard } from '@/app/admin/events/AdminEventCard'
import { Calendar, Loader2 } from 'lucide-react'
import { ModeratorEventsHeader } from './components'
import { useEffect, useState } from 'react'

export default function ModeratorManageEventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select('*, event_registrations(*, users(full_name, phone))')
                .neq('status', 'pending')
                .order('event_date', { ascending: false })
            
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
        <div className="max-w-7xl mx-auto space-y-10">
            <ModeratorEventsHeader count={events.length} />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events && events.length > 0 ? (
                    events.map((event) => (
                        <AdminEventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-full mx-auto mb-6">
                            <Calendar className="w-12 h-12 text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">No Events Managed</h2>
                        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Events will appear here once they are approved from the queue.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
