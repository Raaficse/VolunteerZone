'use client'

import { Clock, HeartHandshake, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'

export default function PendingPage() {
    return (
        <div className="max-w-2xl mx-auto py-12 text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-100">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Clock className="w-10 h-10 text-amber-500" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Under Review</h1>

                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Your application is currently under review. Our team will contact you as soon as possible.
                    Once your application is approved, your dashboard will appear here.
                </p>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <HeartHandshake className="w-5 h-5" />
                        <span>Thank you for choosing VolunteerZone</span>
                    </div>

                    <button 
                        onClick={async () => {
                            await logout()
                            window.location.href = '/'
                        }}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
