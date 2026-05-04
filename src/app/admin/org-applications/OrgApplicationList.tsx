'use client'

import { useState } from 'react'
import { updateApplicationStatus, deleteUser } from '@/app/admin/actions'
import { Check, X, Loader2, Building2, Globe, MapPin, User, FileText, Phone, Calendar, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export interface OrgApplication {
    id: string
    full_name: string | null
    status: string | null
    phone: string | null
    created_at: string
    organization_profiles: {
        org_type: string | null
        registration_number: string | null
        website: string | null
        address: string | null
        contact_person: string | null
        designation: string | null
        description: string | null
        mission: string | null
    } | null
}

export default function OrgApplicationList({ initialApplications }: { initialApplications: OrgApplication[] }) {
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
            toast.success(`Organization ${status} successfully`)
            setApplications(applications.filter(app => app.id !== userId))
            setProcessingId(null)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this organization? This will remove them from Auth and Database.')) return
        setDeletingId(userId)
        const res = await deleteUser(userId)
        if (res?.error) {
            toast.error(res.error)
            setDeletingId(null)
        } else {
            toast.success('Organization deleted successfully')
            setApplications(applications.filter(app => app.id !== userId))
            setDeletingId(null)
        }
    }

    if (applications.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No pending organization applications</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">There are no new organization partner requests to review at this time.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6">
            {applications.map((app) => {
                const profile = app.organization_profiles
                const orgData = {
                    org_type: profile?.org_type || 'N/A',
                    registration_number: profile?.registration_number || 'N/A',
                    website: profile?.website || '',
                    address: profile?.address || 'N/A',
                    contact_person: profile?.contact_person || 'N/A',
                    designation: profile?.designation || 'N/A',
                    description: profile?.description || 'N/A',
                    mission: profile?.mission || 'N/A'
                }

                return (
                    <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                                <div className="flex-1 space-y-6">
                                    {/* Header Section */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                            <Building2 className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-950">{app.full_name || 'Anonymous Organization'}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-primary">
                                                    <Globe className="w-4 h-4" />
                                                    <a href={orgData.website} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                                                        Website
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{app.phone || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Org Quick Info Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                        <div className="flex gap-3">
                                            <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Type</p>
                                                <p className="text-sm font-semibold text-slate-700">{orgData.org_type}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Reg No</p>
                                                <p className="text-sm font-semibold text-slate-700">{orgData.registration_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address</p>
                                                <p className="text-sm font-semibold text-slate-700 line-clamp-1">{orgData.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Person */}
                                    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contact Person</p>
                                                <p className="text-sm font-bold text-slate-900">{orgData.contact_person}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Designation</p>
                                            <p className="text-sm font-semibold text-slate-700">{orgData.designation}</p>
                                        </div>
                                    </div>

                                    {/* Detailed Content Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-primary" />
                                                Description
                                            </h4>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">"{orgData.description}"</p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-primary" />
                                                Mission & Vision
                                            </h4>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{orgData.mission}</p>
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
                )
            })}
        </div>
    )
}
