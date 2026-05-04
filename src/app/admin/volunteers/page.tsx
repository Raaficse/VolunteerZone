'use client'

import { createClient } from '@/lib/supabase/client'
import { Search, Loader2 } from 'lucide-react'
import VolunteerActionButtons from './VolunteerActionButtons'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AdminVolunteersPage() {
    const [volunteers, setVolunteers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()
    const supabase = createClient()
    
    const query = searchParams.get('query') || ''

    useEffect(() => {
        setSearchQuery(query)
        const fetchVolunteers = async () => {
            setLoading(true)
            let supabaseQuery = supabase
                .from('users')
                .select('*, event_registrations(*, events(*))')
                .eq('role', 'volunteer')
                .order('created_at', { ascending: false })

            if (query) {
                supabaseQuery = supabaseQuery.or(`full_name.ilike.%${query}%,skills.ilike.%${query}%`)
            }

            const { data } = await supabaseQuery
            setVolunteers(data || [])
            setLoading(false)
        }

        fetchVolunteers()
    }, [supabase, query])

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const newQuery = formData.get('query') as string
        const params = new URLSearchParams(searchParams.toString())
        if (newQuery) {
            params.set('query', newQuery)
        } else {
            params.delete('query')
        }
        router.push(`?${params.toString()}`)
    }

    if (loading && volunteers.length === 0) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Volunteers</h1>
                <p className="text-slate-600 mt-2">Manage and view the platform's volunteer base.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <form onSubmit={handleSearch} className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            name="query"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or skills..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </form>
                </div>

                {volunteers.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No volunteers found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 text-sm text-slate-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Name & Contact</th>
                                    <th className="px-6 py-4">Skills</th>
                                    <th className="px-6 py-4">Events History</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {volunteers.map((vol) => (
                                    <tr key={vol.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{vol.full_name}</div>
                                            <div className="text-sm text-slate-500">{vol.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {vol.skills ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {vol.skills.split(',').map((skill: string, i: number) => (
                                                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-dark border border-slate-200">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">None listed</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-slate-900 font-medium">{vol.event_registrations?.length || 0} Registrations</div>
                                            <div className="text-slate-500 text-xs mt-1">
                                                {vol.event_registrations?.filter((r: any) => r.attendance_status === 'present').length || 0} Attended
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(vol.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <VolunteerActionButtons userId={vol.id} currentStatus={vol.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
