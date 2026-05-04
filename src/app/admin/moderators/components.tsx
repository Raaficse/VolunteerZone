'use client'

import { useState } from 'react'
import { Loader2, Plus, ShieldCheck, Mail, Lock, User, Trash2, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { createModerator, deleteModerator, updateModerator } from './actions'

export function CreateModModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await createModerator(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Moderator account created successfully!')
            setIsOpen(false)
        }
        setLoading(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all shadow-sm shadow-slate-900/10 hover:shadow-primary/20 hover:-translate-y-0.5"
            >
                <Plus className="w-5 h-5" />
                Add Moderator
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-slate-900 tracking-tight">New Moderator</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Create staff account</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 rounded-2xl transition-all shadow-sm">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input required name="full_name" placeholder="John Doe" className="pl-11 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium text-slate-900" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input required type="email" name="email" placeholder="mod@vms.com" className="pl-11 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium text-slate-900" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input required type="password" name="password" minLength={6} placeholder="Min. 6 characters" className="pl-11 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium text-slate-900" />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
                                <button type="submit" disabled={loading} className="flex-1 flex justify-center items-center px-4 py-3 border border-transparent rounded-2xl shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all disabled:opacity-50">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                    {loading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export function DeleteModButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this moderator?')) return

        setLoading(true)
        const res = await deleteModerator(id)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Moderator deleted successfully')
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Delete moderator"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    )
}

export function EditModModal({ mod }: { mod: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const fullName = formData.get('full_name') as string
        const res = await updateModerator(mod.id, fullName)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Moderator updated successfully!')
            setIsOpen(false)
        }
        setLoading(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm active:scale-95 mr-2"
                title="Edit moderator"
            >
                <Pencil className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-slate-900 tracking-tight">Edit Moderator</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Update account details</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 rounded-2xl transition-all shadow-sm">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input 
                                        required 
                                        name="full_name" 
                                        defaultValue={mod.full_name}
                                        placeholder="John Doe" 
                                        className="pl-11 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium text-slate-900" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Email Address (Read Only)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 opacity-50" />
                                    </div>
                                    <input 
                                        disabled 
                                        value={mod.email} 
                                        className="pl-11 block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl font-medium text-slate-500 cursor-not-allowed" 
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
                                <button type="submit" disabled={loading} className="flex-1 flex justify-center items-center px-4 py-3 border border-transparent rounded-2xl shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all disabled:opacity-50">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                    {loading ? 'Updating...' : 'Update Details'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

