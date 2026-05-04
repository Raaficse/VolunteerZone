'use client'

import { useState } from 'react'
import { Calendar, Users, MapPin, CheckCircle, FileText, Settings2 } from 'lucide-react'
import { DeleteEventButton, ManageRegistrationsModal, FinishEventButton } from '@/app/admin/components'

export function OrgEventCard({ event }: { event: any }) {
    const [isManageOpen, setIsManageOpen] = useState(false)
    const regs = event.event_registrations || []
    const isFull = regs.length >= event.max_volunteers
    const attendedCount = regs.filter((r: any) => r.attendance_status === 'present').length
    const isFinished = new Date(event.event_date) < new Date()

    return (
        <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden">
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider border ${event.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            event.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                            {event.status === 'pending' ? 'Pending Approval' : event.status}
                        </span>
                        {isFinished && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-wider border border-slate-200">Finished</span>
                        )}
                        <FinishEventButton id={event.id} isFinished={event.status === 'finished'} />
                        <DeleteEventButton id={event.id} />
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{event.title}</h3>


                <p className="text-slate-500 text-xs mb-5 line-clamp-2 leading-relaxed flex-1 italic">"{event.description}"</p>

                <div className="space-y-2.5 pt-4 border-t border-slate-50">
                    <div className="flex items-center text-[12px] text-slate-600 font-bold">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mr-3 shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        {new Date(event.event_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-[12px] text-slate-600 font-bold">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mr-3 shrink-0">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        {regs.length} / {event.max_volunteers} Reg.
                    </div>
                    <div className="flex items-center text-[12px] text-emerald-600 font-black pb-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center mr-3 shrink-0">
                            <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        {attendedCount} Attendee(s)
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-50">
                <button
                    onClick={() => setIsManageOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95 text-xs"
                >
                    <Settings2 className="w-4 h-4" />
                    MANAGE VOLUNTEERS
                </button>
            </div>

            <ManageRegistrationsModal
                isOpen={isManageOpen}
                onClose={() => setIsManageOpen(false)}
                eventTitle={event.title}
                registrations={regs}
            />
        </div>
    )
}
