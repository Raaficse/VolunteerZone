'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateEventModal } from '@/app/admin/components'

export function OrgEventsHeader() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">NGO Dashboard</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage your community events and track volunteer impact.</p>
            </div>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 active:scale-95 text-lg"
            >
                <Plus className="w-6 h-6 mr-3" />
                Launch Event
            </button>

            <CreateEventModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}
