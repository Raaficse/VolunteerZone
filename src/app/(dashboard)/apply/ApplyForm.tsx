'use client'

import { submitApplication } from '../actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ClipboardCheck, Info, ShieldCheck } from 'lucide-react'
import DatePicker from '@/components/DatePicker'
import toast from 'react-hot-toast'

export default function ApplyForm({
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

        if (phone.length !== 11) {
            toast.error('Mobile number must be exactly 11 digits.')
            return
        }

        setLoading(true)
        const res = await submitApplication(formData)

        if (res?.error) {
            toast.error(res.error)
            setLoading(false)
        } else {
            toast.success('Application submitted successfully!')
            router.push('/pending')
            router.refresh()
        }
    }

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    const districts = [
        'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh',
        'Gazipur', 'Narayanganj', 'Comilla', 'Noakhali', 'Brahmanbaria', 'Chandpur', 'Feni', 'Lakshmipur',
        'Cox\'s Bazar', 'Khagrachhari', 'Rangamati', 'Bandarban', 'Jessore', 'Kushtia', 'Magura', 'Meherpur',
        'Narail', 'Chuadanga', 'Jhenaidah', 'Satkhira', 'Bogra', 'Joypurhat', 'Naogaon', 'Natore',
        'Pabna', 'Sirajganj', 'Chapai Nawabganj', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat',
        'Nilphamari', 'Panchagarh', 'Thakurgaon', 'Habiganj', 'Maulvibazar', 'Sunamganj', 'Bagerhat',
        'Jhalokati', 'Pirojpur', 'Bhola', 'Patuakhali', 'Barguna', 'Netrokona', 'Sherpur', 'Jamalpur',
        'Kishoreganj', 'Tangail', 'Faridpur', 'Gopalganj', 'Madaripur', 'Rajbari', 'Shariatpur', 'Manikganj', 'Munshiganj'
    ]
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-primary p-8 text-white relative">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <ClipboardCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Volunteer Application</h1>
                            <p className="text-primary-light opacity-90">Join the VolunteerZone community and make an impact.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                    {/* Basic Information */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Info className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-slate-800">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    defaultValue={userName}
                                    required
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    disabled
                                    value={userEmail}
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 sm:text-sm cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                <DatePicker
                                    name="dob"
                                    required
                                    placeholder="Select your birth date"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                <div className="flex gap-6 py-3">
                                    {['Male', 'Female', 'Other'].map((g) => (
                                        <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g.toLowerCase()}
                                                required
                                                className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                            />
                                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                                <select
                                    name="blood_group"
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm bg-white"
                                >
                                    <option value="">Select Group</option>
                                    {bloodGroups.map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number (11 Digits)</label>
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

                    {/* Verification & Location */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-slate-800">Identity & Location</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">NID / Birth Certificate Number</label>
                                <input
                                    type="text"
                                    name="nid_number"
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current District/City</label>
                                <select
                                    name="district"
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm bg-white"
                                >
                                    <option value="">Select District</option>
                                    {districts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Educational Institution / Organization</label>
                                <input
                                    type="text"
                                    name="institution"
                                    required
                                    placeholder="e.g., University Name or Workplace"
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Availability & Skills */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <ClipboardCheck className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-slate-800">Experience & Availability</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Previous Experience</label>
                                <textarea
                                    name="experience"
                                    required
                                    rows={3}
                                    placeholder="Describe any previous volunteer work or relevant skills..."
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Available Days</label>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {days.map((day) => (
                                        <label key={day} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                name="available_days"
                                                value={day}
                                                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                                            />
                                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time of Day</label>
                                <input
                                    type="text"
                                    name="available_times"
                                    placeholder="e.g., Morning, Evening, All Day..."
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Why do you want to join us?</label>
                                <textarea
                                    name="motivation"
                                    required
                                    rows={3}
                                    placeholder="What motivates you to volunteer with VolunteerZone?"
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
                                <li>All information provided above is true and accurate to the best of my knowledge.</li>
                                <li>I will follow the rules, regulations, and code of conduct of VolunteerZone.</li>
                                <li>I am volunteering my time and skills willingly without any expectation of financial profit.</li>
                                <li>I understand that VolunteerZone reserves the right to terminate my volunteer status if I violate any policies.</li>
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
                                        I hereby declare that all information provided is true and I agree to the terms above.
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
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ClipboardCheck className="w-6 h-6" />}
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
