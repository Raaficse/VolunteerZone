'use client'

import { CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { updateEventStatus, deleteEvent } from '@/app/admin/actions'
import toast from 'react-hot-toast'

export function ApprovalButtons({ eventId }: { eventId: string }) {
    const [loading, setLoading] = useState<'approving' | 'rejecting' | null>(null)

    const handleAction = async (status: 'approved' | 'rejected') => {
        setLoading(status === 'approved' ? 'approving' : 'rejecting')
        const res = await updateEventStatus(eventId, status)
        
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success(`Event ${status} successfully!`)
        }
        setLoading(null)
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this event submission?')) return
        setLoading('rejecting') // reuse rejecting state visually if needed or add new
        const res = await deleteEvent(eventId)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Event deleted successfully!')
        }
        setLoading(null)
    }

    return (
        <div className="p-4 space-y-3 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleAction('approved')}
                    disabled={loading !== null}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white font-black rounded-[1.5rem] hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                    {loading === 'approving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    APPROVE
                </button>
                <button
                    onClick={() => handleAction('rejected')}
                    disabled={loading !== null}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-rose-100 text-rose-500 font-black rounded-[1.5rem] hover:bg-rose-50 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                >
                    {loading === 'rejecting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    REJECT
                </button>
            </div>
            
            <button
                onClick={handleDelete}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-200 text-slate-600 font-black rounded-[1.2rem] hover:bg-rose-600 hover:text-white transition-all text-[10px] uppercase tracking-widest disabled:opacity-30 group"
            >
                <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                DELETE SUBMISSION
            </button>
        </div>
    )
}
