'use client'

import { createClient } from '@/lib/supabase/client'
import { Search, Building2, Globe, Phone, MapPin, Mail, Loader2 } from 'lucide-react'
import VolunteerActionButtons from '../volunteers/VolunteerActionButtons'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AdminOrganizationsPage() {
    const [organizations, setOrganizations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()
    const supabase = createClient()
    
    const query = searchParams.get('query') || ''

    useEffect(() => {
        setSearchQuery(query)
        const fetchOrganizations = async () => {
            setLoading(true)
            let supabaseQuery = supabase
                .from('users')
                .select('*, organization_profiles(*)')
                .eq('role', 'organization')
                .order('created_at', { ascending: false })

            if (query) {
                supabaseQuery = supabaseQuery.ilike('full_name', `%${query}%`)
            }

            const { data } = await supabaseQuery
            setOrganizations(data || [])
            setLoading(false)
        }

        fetchOrganizations()
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

    if (loading && organizations.length === 0) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Organizations</h1>
                <p className="text-slate-600 mt-2">Manage and view the platform's partner organizations.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <form onSubmit={handleSearch} className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            name="query"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by organization name..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </form>
                </div>

                {organizations.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No organizations found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 text-sm text-slate-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Organization & Contact</th>
                                    <th className="px-6 py-4">Type & Details</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {organizations.map((org) => {
                                    const profile = org.organization_profiles
                                    return (
                                        <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                        <Building2 className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{org.full_name}</div>
                                                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                            {org.email || 'No email'}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 border-t border-slate-100 pt-1 border-dashed w-fit">
                                                            {profile?.website && (
                                                                <a
                                                                    href={profile.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-primary flex items-center gap-1"
                                                                >
                                                                    <Globe className="w-3 h-3" />
                                                                    Website
                                                                </a>
                                                            )}
                                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />
                                                                {org.phone || 'No phone'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div className="font-medium text-slate-900">{profile?.org_type || 'N/A'}</div>
                                                <div className="text-xs text-slate-500 mt-1">Reg: {profile?.registration_number || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div className="flex items-start gap-1">
                                                    <MapPin className="w-3 h-3 text-slate-400 mt-1 shrink-0" />
                                                    <span className="line-clamp-2">{profile?.address || 'No address'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(org.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <VolunteerActionButtons userId={org.id} currentStatus={org.status} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
