'use client'

import { createClient } from '@/lib/supabase/client'
import { Calendar, CheckCircle, Clock, XCircle, FileText, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            const { data } = await supabase
                .from('event_registrations')
                .select('*, events(*)')
                .eq('volunteer_id', user.id)
                .order('registered_at', { ascending: false })
            
            setHistory(data || [])
            setLoading(false)
        }

        fetchHistory()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Participation History</h1>
                <p className="text-slate-600 mt-2">Review your past and upcoming volunteer commitments.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {history.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        You have no participation history.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 text-sm">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-slate-600 bg-slate-50/50">
                            <div className="col-span-3">Event</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-3">Role</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2 text-right">Certificate</div>
                        </div>

                        {history.map((reg) => {
                            const eventDate = new Date(reg.events?.event_date || '')
                            const isPast = eventDate < new Date()

                            let StatusIcon = Clock
                            let statusColor = "text-yellow-600 bg-yellow-50 border-yellow-200"
                            let statusText = "Pending"

                            if (reg.attendance_status === 'present') {
                                StatusIcon = CheckCircle
                                statusColor = "text-green-700 bg-green-50 border-green-200"
                                statusText = "Present"
                            } else if (reg.attendance_status === 'absent') {
                                StatusIcon = XCircle
                                statusColor = "text-red-700 bg-red-50 border-red-200"
                                statusText = "Absent"
                            } else if (isPast && reg.attendance_status === 'pending') {
                                statusColor = "text-slate-600 bg-slate-100 border-slate-200"
                                statusText = "Unmarked"
                            }

                            const hasCertificate = reg.attendance_status === 'present' && reg.events?.certificate_url

                            return (
                                <div key={reg.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50/50 transition-colors">
                                    <div className="col-span-3 font-medium text-slate-900">
                                        {reg.events?.title}
                                    </div>
                                    <div className="col-span-2 text-slate-600 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                        {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="col-span-3 text-slate-600">
                                        {reg.assigned_role || <span className="text-slate-400 italic">Not Assigned</span>}
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                                            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                                            {statusText}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        {reg.certificate_url ? (
                                            <a
                                                href={reg.certificate_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-primary hover:text-primary-dark font-bold hover:underline gap-1.5"
                                            >
                                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                Download
                                            </a>
                                        ) : (
                                            <span className="text-slate-300 text-xs italic">Not Available</span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
