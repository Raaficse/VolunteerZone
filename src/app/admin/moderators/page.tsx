'use client'

import { createClient } from '@/lib/supabase/client'
import { CreateModModal, DeleteModButton, EditModModal } from './components'
import { ShieldAlert, User, Mail, Calendar, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminModerators() {
    const [mods, setMods] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchMods = async () => {
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'moderator')
                .order('created_at', { ascending: false })
            
            setMods(data || [])
            setLoading(false)
        }

        fetchMods()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight">Moderators</h1>
                    <p className="text-slate-600 mt-2 font-medium">Create and manage moderator accounts for event validation.</p>
                </div>
                <div className="flex gap-3">
                    <CreateModModal />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Moderator Profile</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Contact</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Date Joined</th>
                                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Status</th>
                                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mods.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="p-16 text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                                                <ShieldAlert className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">No moderators found</h3>
                                            <p className="text-slate-500 font-medium max-w-sm mx-auto">You haven't added any moderators yet. Create a new moderator account to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                mods.map((mod) => (
                                    <tr key={mod.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{mod.full_name}</div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {mod.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 hidden md:table-cell">
                                            <div className="flex items-center text-sm font-medium text-slate-600">
                                                <Mail className="w-4 h-4 mr-2 text-slate-400" />
                                                {mod.email || 'Not provided'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 hidden sm:table-cell">
                                            <div className="flex items-center text-sm font-medium text-slate-600">
                                                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                                {new Date(mod.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right hidden lg:table-cell">
                                            <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-emerald-100">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end">
                                                <EditModModal mod={mod} />
                                                <DeleteModButton id={mod.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
