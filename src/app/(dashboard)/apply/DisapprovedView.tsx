'use client'

import { submitApplication } from '../actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle, RefreshCcw, Loader2, ClipboardCheck, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import toast from 'react-hot-toast'

export default function DisapprovedView({
    userEmail,
    onRetry
}: {
    userEmail: string,
    onRetry: () => void
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleReset = async () => {
        setLoading(true)
        // We can just call onRetry which will likely just flip a state in the parent
        // but it's cleaner to just refresh the page context
        onRetry()
    }

    return (
        <div className="max-w-2xl mx-auto py-12 text-center">
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-red-100 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>

                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Disapproved</h1>

                <p className="text-lg text-slate-600 mb-10 leading-relaxed px-4">
                    Your volunteer application has been disapproved for some reason. If you believe there was an error or you provided incorrect information, please feel free to submit a new application.
                </p>

                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                        Submit New Application
                    </button>

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

                    <p className="text-sm text-slate-400">
                        Application for: <span className="text-slate-600 font-medium">{userEmail}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
