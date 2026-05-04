'use client'

import { User, Phone, MapPin, Calendar, Heart, Shield, GraduationCap, Clock, ClipboardList, FileText, Download } from 'lucide-react'

interface ProfileProps {
    initialData: any
}

export function ProfileView({ initialData }: ProfileProps) {
    if (!initialData) return null

    const InfoItem = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string | null, className?: string }) => (
        <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3 transition-all hover:bg-slate-100/50 ${className}`}>
            <div className="bg-white p-2 rounded-xl shadow-sm">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-900 leading-snug">{value || 'Not provided'}</p>
            </div>
        </div>
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Personal Info */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Personal Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem icon={User} label="Full Name" value={initialData.full_name} />
                    <InfoItem icon={Phone} label="Phone Number" value={initialData.phone} />
                    <InfoItem icon={Heart} label="Blood Group" value={initialData.blood_group} />
                    <InfoItem icon={Calendar} label="Date of Birth" value={initialData.dob} />
                    <InfoItem icon={User} label="Gender" value={initialData.gender} className="capitalize" />
                    <InfoItem icon={Shield} label="Identity (NID/BC)" value={initialData.nid_number} />
                </div>
            </section>

            {/* Location & Organization */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Location & Institution</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={MapPin} label="District/City" value={initialData.district} />
                    <InfoItem icon={GraduationCap} label="Organization / Institution" value={initialData.institution} />
                </div>
            </section>

            {/* Availability */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Clock className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Availability</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={Calendar} label="Available Days" value={initialData.available_days} />
                    <InfoItem icon={Clock} label="Preferred Times" value={initialData.available_times} />
                </div>
            </section>

            {/* Experience & Motivation */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Volunteer Background</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {initialData.experience || 'No previous experience provided.'}
                        </p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Motivation to Join</p>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {initialData.motivation || 'No motivation details provided.'}
                        </p>
                    </div>
                </div>
            </section>

        </div>
    )
}
