'use client'

import { submitOrgApplication } from '@/app/(dashboard)/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Building2, Globe, MapPin, User, FileText, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrgApplyForm({
    userEmail,
    userName
}: {
    userEmail: string,
    userName: string
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [agreed, setAgreed] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!agreed) {
            toast.error('You must agree to the declaration to continue.')
            return
        }

        const formData = new FormData(e.currentTarget)
        const phone = formData.get('phone') as string

        if (phone.length < 11) {
            toast.error('Mobile number must be at least 11 digits.')
            return
        }

        setLoading(true)
        const res = await submitOrgApplication(formData)

        if (res?.error) {
            toast.error(res.error)
            setLoading(false)
        } else {
            toast.success('Organization application submitted successfully!')
            router.push('/pending') // Or an organization specific pending page
            router.refresh()
        }
    }

    const orgTypes = [
        'Non-Profit Organization (NGO)',
        'Social Enterprise',
        'Charitable Trust',
        'Community Group',
        'Government Agency',
        'Educational Institution',
        'Corporate Social Responsibility (CSR) Wing'
    ]

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-primary p-8 text-white relative">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Organization Application</h1>
                            <p className="text-primary-light opacity-90">Partner with VolunteerZone to scale your impact.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                    {/* Organization Details */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Building2 className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-slate-800">Organization Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Official Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    defaultValue={userName}
                                    required
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Type</label>
                                <select
                                    name="org_type"
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm bg-white"
                                >
                                    <option value="">Select Type</option>
                                    {orgTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                                <input
                                    type="text"
                                    name="registration_number"
                                    required
                                    placeholder="e.g., NGO Reg No or Trade License"
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Official Website</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Globe className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="website"
                                        placeholder="https://example.org"
                                        className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Official Email Address</label>
                                <input
                                    type="email"
                                    disabled
                                    value={userEmail}
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 sm:text-sm cursor-not-allowed"
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Headquarters/Office Address</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <textarea
                                        name="address"
                                        required
                                        rows={2}
                                        className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Person Details */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-slate-800">Contact Person Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="contact_person"
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    required
                                    placeholder="e.g., Executive Director, Manager"
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Contact Number (11 Digits)</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="e.g., 01712345678"
                                    required
                                    maxLength={11}
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Mission & Impact */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <FileText className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-slate-800">About the Organization</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Brief Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={3}
                                    placeholder="Tell us about your organization's core activities..."
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mission & Vision</label>
                                <textarea
                                    name="mission"
                                    required
                                    rows={3}
                                    placeholder="What is the main goal or vision of your organization?"
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Declaration */}
                    <section className="pt-6 border-t border-slate-100">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Declaration
                            </h3>
                            <ul className="text-sm text-slate-600 space-y-3 list-disc pl-5">
                                <li>The organization is legally registered and authorized to operate.</li>
                                <li>We agree to provide a safe and respectful environment for volunteers.</li>
                                <li>All information provided in this application is accurate and verifiable.</li>
                                <li>We understand that VolunteerZone reserves the right to review and approve/reject applications based on platform policies.</li>
                            </ul>
                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-1 w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary"
                                    />
                                    <span className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">
                                        I hereby declare that all information provided is true and our organization agrees to the terms above.
                                    </span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 flex items-center justify-center gap-3 text-lg font-bold text-white bg-primary hover:bg-primary-dark rounded-2xl shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Building2 className="w-6 h-6" />}
                            Submit Organization Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
