'use client'

import { useState } from 'react'
import { updateApplicationStatus, deleteUser } from '@/app/admin/actions'
import { Check, X, Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface VolunteerActionProps {
    userId: string
    currentStatus: string
}

export default function VolunteerActionButtons({ userId, currentStatus }: VolunteerActionProps) {
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleAction = async (newStatus: 'approved' | 'disapproved') => {
        setLoading(true)
        const res = await updateApplicationStatus(userId, newStatus)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success(`User set to ${newStatus}`)
            setStatus(newStatus)
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) return
        setIsDeleting(true)
        const res = await deleteUser(userId)
        if (res?.error) {
            toast.error(res.error)
            setIsDeleting(false)
        } else {
            toast.success('User deleted successfully')
        }
    }

    return (
        <div className="flex items-center gap-2">
            {status !== 'approved' && (
                <button
                    onClick={() => handleAction('approved')}
                    disabled={loading || isDeleting}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Approve Volunteer"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
            )}
            {status !== 'disapproved' && (
                <button
                    onClick={() => handleAction('disapproved')}
                    disabled={loading || isDeleting}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Disapprove Volunteer"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                </button>
            )}
            <button
                onClick={handleDelete}
                disabled={loading || isDeleting}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete User Permanently"
            >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            </button>
            {status === 'approved' && <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">Active</span>}
            {status === 'disapproved' && <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-100 text-rose-700">Disabled</span>}
        </div>
    )
}
