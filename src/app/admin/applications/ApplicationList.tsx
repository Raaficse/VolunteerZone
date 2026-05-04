'use client'

import { useState } from 'react'
import { updateApplicationStatus, deleteUser } from '@/app/admin/actions'
import { Check, X, Loader2, User, Phone, Briefcase, MessageSquare, Calendar, ShieldCheck, MapPin, GraduationCap, Droplet, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Application {
    id: string
    full_name: string | null
    status: string | null
    experience: string | null
    motivation: string | null
    dob: string | null
    gender: string | null
    blood_group: string | null
    phone: string | null
    nid_number: string | null
    district: string | null
    institution: string | null
    available_days: string | null
    available_times: string | null
    created_at: string
}

export default function ApplicationList({ initialApplications }: { initialApplications: Application[] }) {
    const [applications, setApplications] = useState(initialApplications)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleAction = async (userId: string, status: 'approved' | 'disapproved') => {
        setProcessingId(userId)
        const res = await updateApplicationStatus(userId, status)
        if (res?.error) {
            toast.error(res.error)
            setProcessingId(null)
        } else {
            toast.success(`Application ${status} successfully`)
            setApplications(applications.filter(app => app.id !== userId))
            setProcessingId(null)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this applicant? This will remove them from Auth and Database.')) return
        setDeletingId(userId)
        const res = await deleteUser(userId)
        if (res?.error) {
            toast.error(res.error)
            setDeletingId(null)
        } else {
            toast.success('Applicant deleted successfully')
            setApplications(applications.filter(app => app.id !== userId))
            setDeletingId(null)
        }
    }

    if (applications.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No pending applications</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">There are no new volunteer applications to review at this time.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6">
            {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                            <div className="flex-1 space-y-6">
                                {/* Header Section */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <User className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-950">{app.full_name || 'Anonymous'}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                <span>{app.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Droplet className="w-4 h-4 text-rose-500" />
                                                <span className="font-semibold text-rose-600">{app.blood_group || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <div className="flex gap-3">
                                        <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">DOB & Gender</p>
                                            <p className="text-sm font-semibold text-slate-700 capitalize">
                                                {app.dob || 'Unknown'} ({app.gender || 'N/A'})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">NID / Birth Cert</p>
                                            <p className="text-sm font-semibold text-slate-700">{app.nid_number || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Location</p>
                                            <p className="text-sm font-semibold text-slate-700">{app.district || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                                <GraduationCap className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">Education / Organization</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed font-medium">{app.institution || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                                                <Briefcase className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">Experience</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">{app.experience || 'No experience provided.'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                                                <MessageSquare className="w-5 h-5 text-purple-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">Motivation</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">{app.motivation || 'No motivation provided.'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                                <Calendar className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">Availability</h4>
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {app.available_days ? (
                                                        app.available_days.split(',').map((day, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] font-bold text-slate-500 rounded uppercase">
                                                                {day.trim()}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Not specified</span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-semibold text-slate-500">Times: <span className="text-slate-700">{app.available_times || 'N/A'}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Sidebar */}
                            <div className="flex xl:flex-col gap-3 shrink-0 xl:w-48 pt-2">
                                <button
                                    onClick={() => handleAction(app.id, 'approved')}
                                    disabled={processingId === app.id || deletingId === app.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(app.id, 'disapproved')}
                                    disabled={processingId === app.id || deletingId === app.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-rose-600 border-2 border-rose-100 text-sm font-bold rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
                                    Disapprove
                                </button>
                                <button
                                    onClick={() => handleDelete(app.id)}
                                    disabled={processingId === app.id || deletingId === app.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-400 border-2 border-slate-100 text-sm font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {deletingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
