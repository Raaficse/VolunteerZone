'use client'

import { joinEvent, cancelRegistration } from './actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ActionButtonProps {
    eventId: string
    isRegistered: boolean
    registrationId?: string
    isFull: boolean
}

export function EventActionButton({ eventId, isRegistered, registrationId, isFull }: ActionButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleJoin = async () => {
        setLoading(true)
        const res = await joinEvent(eventId)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Successfully registered for the event!')
        }
        setLoading(false)
    }

    const handleCancel = async () => {
        if (!registrationId) return
        setLoading(true)
        const res = await cancelRegistration(registrationId)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Registration cancelled.')
        }
        setLoading(false)
    }

    if (isRegistered) {
        return (
            <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-center font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cancel Registration'}
            </button>
        )
    }

    if (isFull) {
        return (
            <button
                disabled
                className="w-full py-2.5 rounded-lg text-center font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
            >
                Event Full
            </button>
        )
    }

    return (
        <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-center font-medium bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Event'}
        </button>
    )
}
