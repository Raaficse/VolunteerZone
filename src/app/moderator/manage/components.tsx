'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateEventModal } from '@/app/admin/components'

export function ModeratorEventsHeader({ count }: { count: number }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Active Event Management
                    <span className="bg-emerald-100 text-emerald-600 text-xs px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest font-black">
                        {count} Events
                    </span>
                </h1>
                <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[11px]">Manage registrations, attendance, and completed event status.</p>
            </div>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/20 text-xs uppercase tracking-widest"
            >
                <Plus className="w-4 h-4" />
                CREATE EVENT
            </button>

            <CreateEventModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}
