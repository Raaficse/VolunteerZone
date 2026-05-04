'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select('*, event_registrations(*)')
                .order('event_date', { ascending: true })
                .gte('event_date', new Date().toISOString())
            
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
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Upcoming Events</h1>

                {events.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-slate-900 mb-2">No upcoming events</h3>
                        <p className="text-slate-500">Check back later for new volunteer opportunities.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => {
                            const registeredCount = event.event_registrations?.length || 0
                            const isFull = registeredCount >= event.max_volunteers

                            return (
                                <div key={event.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
                                    <p className="text-slate-600 mb-4 line-clamp-3 flex-1">{event.description}</p>

                                    <div className="space-y-2 mb-6 text-sm text-slate-600">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                                            {new Date(event.event_date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-primary" />
                                            {registeredCount} / {event.max_volunteers} Volunteers
                                        </div>
                                    </div>

                                    <Link
                                        href={isFull ? '#' : `/dashboard/events`}
                                        className={`w-full py-2.5 rounded-lg text-center font-medium transition-colors ${isFull
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark text-white'
                                            }`}
                                    >
                                        {isFull ? 'Event Full' : 'Volunteer Now'}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
