'use client'

import { createEvent, deleteEvent, updateEventStatus, updateRegistrationStatus } from '@/app/admin/actions'
import { useState } from 'react'
import { Loader2, Trash2, Users, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export function CreateEventModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await createEvent(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Event created!')
            onClose()
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-900">Create New Event</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Title</label>
                        <input required name="title" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea required rows={3} name="description" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Location</label>
                            <input required name="location" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Date & Time</label>
                            <input required type="datetime-local" name="event_date" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Max Volunteers</label>
                        <input required type="number" min="1" name="max_volunteers" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function DeleteEventButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)
    return (
        <button
            onClick={async (e) => {
                e.stopPropagation()
                if (!confirm('Are you sure you want to delete this event?')) return
                setLoading(true)
                await deleteEvent(id)
                toast.success("Event deleted")
                setLoading(false)
            }}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
            title="Delete event"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    )
}

export function FinishEventButton({ id, isFinished }: { id: string, isFinished: boolean }) {
    const [loading, setLoading] = useState(false)
    if (isFinished) return null

    return (
        <button
            onClick={async (e) => {
                e.stopPropagation()
                if (!confirm('Are you sure you want to finish this event? This action will mark this event as completed.')) return
                setLoading(true)
                await updateEventStatus(id, 'finished')
                toast.success("Event marked as finished")
                setLoading(false)
            }}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
            title="Finish event"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
        </button>
    )
}
export function RegistrationRow({ reg }: { reg: any }) {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(reg.attendance_status)
    const [role, setRole] = useState(reg.assigned_role || '')
    const [certUrl, setCertUrl] = useState(reg.certificate_url || '')

    const handleUpdate = async () => {
        setLoading(true)
        const res = await updateRegistrationStatus(reg.id, status, role, certUrl)
        if (res?.error) toast.error(res.error)
        else toast.success("Updated")
        setLoading(false)
    }

    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{reg.users?.full_name}</div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">{reg.users?.phone || 'No phone'}</div>
            </td>
            <td className="px-6 py-4">
                <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="Assign role..."
                    className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none w-full max-w-[150px]"
                />
            </td>
            <td className="px-6 py-4">
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                >
                    <option value="pending">⏳ Pending</option>
                    <option value="present">✅ Present</option>
                    <option value="absent">❌ Absent</option>
                </select>
            </td>
            <td className="px-6 py-4">
                <input
                    type="text"
                    value={certUrl}
                    onChange={e => setCertUrl(e.target.value)}
                    placeholder="Certificate URL..."
                    disabled={status !== 'present'}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none w-full disabled:opacity-30"
                />
            </td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={handleUpdate}
                    disabled={loading || (status === reg.attendance_status && role === (reg.assigned_role || ''))}
                    className="text-[11px] font-bold bg-slate-900 text-white px-4 py-2 rounded-xl disabled:opacity-30 hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'SAVE'}
                </button>
            </td>
        </tr>
    )
}

export function ManageRegistrationsModal({ isOpen, onClose, eventTitle, registrations }: { isOpen: boolean, onClose: () => void, eventTitle: string, registrations: any[] }) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-white/20 scale-in-center">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="font-black text-2xl text-slate-900 tracking-tight">{eventTitle}</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Volunteer Management Portal</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 rounded-2xl transition-all shadow-sm">✕</button>
                </div>
                <div className="flex-1 overflow-auto">
                    {registrations.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/80 sticky top-0 z-10 p-4 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Volunteer Info</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Role</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificate Link</th>
                                    <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {registrations.map(reg => (
                                    <RegistrationRow key={reg.id} reg={reg} />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center">
                            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold italic">No registrations found for this event yet.</p>
                        </div>
                    )}
                </div>
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">Close Window</button>
                </div>
            </div>
        </div>
    )
}
