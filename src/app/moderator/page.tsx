'use client'

import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Calendar, MapPin, Users, HeartHandshake, Loader2 } from 'lucide-react'
import { ApprovalButtons } from './components/ApprovalButtons'
import { useEffect, useState } from 'react'

export default function ModeratorDashboard() {
    const [pendingEvents, setPendingEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select(`
                    *,
                    users!events_created_by_fkey (
                        full_name,
                        role
                    )
                `)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
            
            setPendingEvents(data || [])
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
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Event Approval Queue
                    <span className="bg-amber-100 text-amber-600 text-xs px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest font-black">
                        {pendingEvents.length} Pending
                    </span>
                </h1>
                <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[11px]">Carefully review organization submissions before public rollout.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {pendingEvents && pendingEvents.length > 0 ? (
                    pendingEvents.map((event: any) => (
                        <div key={event.id} className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col hover:border-slate-900 transition-all duration-300">
                            <div className="p-8 pb-4 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                                            <HeartHandshake className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted By</p>
                                            <p className="font-black text-slate-900 uppercase tracking-tight">{event.users?.full_name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</p>
                                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase">{event.users?.role}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight uppercase">{event.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 italic">"{event.description}"</p>

                                <div className="space-y-3 pt-6 border-t border-slate-50">
                                    <div className="flex items-center text-[13px] text-slate-600 font-bold uppercase tracking-wide">
                                        <Calendar className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                                        {new Date(event.event_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </div>
                                    <div className="flex items-center text-[13px] text-slate-600 font-bold uppercase tracking-wide">
                                        <MapPin className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center text-[13px] text-slate-600 font-bold uppercase tracking-wide">
                                        <Users className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                                        {event.max_volunteers} Volunteers Required
                                    </div>
                                    {event.certificate_url && (
                                        <div className="flex items-center text-[13px] text-emerald-600 font-bold uppercase tracking-wide">
                                            <CheckCircle className="w-4 h-4 mr-3 text-emerald-400 shrink-0" />
                                            Certificate Included
                                        </div>
                                    )}
                                </div>
                            </div>

                            <ApprovalButtons eventId={event.id} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-full mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Queue is Clear</h2>
                        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">No pending event approvals at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
