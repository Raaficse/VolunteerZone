'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateEventModal, DeleteEventButton } from '@/app/admin/components'

export function EventsHeader() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Manage Events</h1>
                <p className="text-slate-600 mt-2">Create new events and view current ones.</p>
            </div>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
                <Plus className="w-5 h-5 mr-2" />
                New Event
            </button>

            <CreateEventModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}
