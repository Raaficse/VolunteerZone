'use client'

import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Calendar, MapPin, HeartHandshake, Loader2 } from 'lucide-react'
import { updateEventStatus } from '@/app/admin/actions'
import { useEffect, useState } from 'react'

export default function AdminApprovalsPage() {
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

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        await updateEventStatus(id, status)
        setPendingEvents(prev => prev.filter(e => e.id !== id))
    }

    if (loading) {
         return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
                        Event Approvals
                        <span className="bg-amber-100 text-amber-600 text-[10px] px-2.5 py-1 rounded-lg border border-amber-200 uppercase tracking-widest font-black shrink-0">
                            {pendingEvents.length} Waiting
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px] opacity-70">Review and verify organization events before they go live.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingEvents && pendingEvents.length > 0 ? (
                    pendingEvents.map((event: any) => (
                        <div key={event.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden">
                            <div className="p-6 pb-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            <HeartHandshake className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-xs leading-none">{event.users?.full_name}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ORGANIZATION</p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight uppercase tracking-tight line-clamp-2">{event.title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 italic">"{event.description}"</p>

                                <div className="space-y-2 pt-4 border-t border-slate-50 mt-auto">
                                    <div className="flex items-center text-[11px] text-slate-600 font-bold uppercase">
                                        <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-[11px] text-slate-600 font-bold uppercase">
                                        <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                                        {event.location}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-2 gap-2 bg-slate-50 border-t border-slate-100">
                                <button onClick={() => handleAction(event.id, 'approved')} className="w-full flex items-center justify-center gap-1.5 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-emerald-600 transition-all text-[10px] uppercase tracking-widest">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    APPROVE
                                </button>
                                <button onClick={() => handleAction(event.id, 'rejected')} className="w-full flex items-center justify-center gap-1.5 py-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all text-[10px] uppercase tracking-widest">
                                    <XCircle className="w-3.5 h-3.5" />
                                    REJECT
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <CheckCircle className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <h2 className="text-xl font-black text-slate-900 uppercase">All clear!</h2>
                        <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">No events are awaiting approval.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
