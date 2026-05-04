'use client'

import { createClient } from '@/lib/supabase/client'
import { Calendar, MapPin, Users, FileText, Loader2 } from 'lucide-react'
import { EventActionButton } from '../components'
import { useEffect, useState } from 'react'

export default function DashboardEvents() {
    const [events, setEvents] = useState<any[]>([])
    const [registrations, setRegistrations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            
            // Fetch all upcoming events & user's registrations
            const { data: eventsData } = await supabase
                .from('events')
                .select('*, event_registrations(*), users(full_name, role)')
                .eq('status', 'approved')
                .order('event_date', { ascending: true })
                .gte('event_date', new Date().toISOString())

            const { data: registrationsData } = await supabase
                .from('event_registrations')
                .select('*')
                .eq('volunteer_id', user?.id || '')
            
            setEvents(eventsData || [])
            setRegistrations(registrationsData || [])
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

    const regMap = new Map(registrations.map(r => [r.event_id, r.id]))

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Available Events</h1>
                <p className="text-slate-600 mt-2">Browse and join upcoming volunteer opportunities.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {events.length === 0 ? (
                    <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No upcoming events</h3>
                        <p className="text-slate-500">Check back later for new opportunities.</p>
                    </div>
                ) : (
                    events.map((event) => {
                        const registeredCount = event.event_registrations?.length || 0
                        const isFull = registeredCount >= event.max_volunteers
                        const isRegistered = regMap.has(event.id)
                        const registrationId = regMap.get(event.id)

                        return (
                            <div key={event.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden">
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2.5 bg-primary/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        {isFull && !isRegistered && (
                                            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-rose-100">Full</span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 line-clamp-1">
                                        By {event.users?.role === 'admin' || !event.users ? 'VolunteerZone' : event.users.full_name || 'Organization'}
                                    </p>
                                    <p className="text-slate-500 text-xs mb-5 line-clamp-2 leading-relaxed flex-1 italic">"{event.description}"</p>

                                    <div className="space-y-2.5 pt-4 border-t border-slate-50">
                                        <div className="flex items-center text-[13px] text-slate-600 font-medium">
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mr-3 shrink-0">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            {new Date(event.event_date).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                        <div className="flex items-center text-[13px] text-slate-600 font-medium">
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mr-3 shrink-0">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center text-[13px] text-slate-600 font-medium pb-2">
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mr-3 shrink-0">
                                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            {registeredCount} / {event.max_volunteers}
                                        </div>
                                        <div className="flex items-center text-[13px] text-slate-600 font-bold pb-2">
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mr-3 shrink-0">
                                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            Certificate: <span className={`ml-1.5 px-2 py-0.5 rounded-md text-[9px] uppercase font-black tracking-widest ${event.certificate_url ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>{event.certificate_url ? 'YES' : 'NO'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50/50 border-t border-slate-50">
                                    <EventActionButton
                                        eventId={event.id}
                                        isRegistered={isRegistered}
                                        registrationId={registrationId}
                                        isFull={isFull}
                                    />
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
