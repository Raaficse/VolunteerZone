'use client'

import { createClient } from '@/lib/supabase/client'
import { Calendar, CheckCircle2, Star, Clock, Users, PlusCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RoleBasedDashboard() {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [data, setData] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            const { data: userProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            setProfile(userProfile)

            if (userProfile?.role === 'organization') {
                const { data: myEvents } = await supabase
                    .from('events')
                    .select('*, event_registrations(*)')
                    .eq('created_by', userProfile.id)
                setData(myEvents)
            } else {
                const { data: registrations } = await supabase
                    .from('event_registrations')
                    .select('*, events(*)')
                    .eq('volunteer_id', userProfile.id)
                    .order('registered_at', { ascending: false })
                    .limit(5)
                setData(registrations)
            }

            setLoading(false)
        }

        fetchDashboardData()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!profile) return null

    if (profile.role === 'organization') {
        return <OrganizationDashboard profile={profile} myEvents={data} />
    }

    return <VolunteerDashboard profile={profile} registrations={data} />
}

function VolunteerDashboard({ profile, registrations }: { profile: any, registrations: any }) {
    const upcomingRegistrations = registrations?.filter(
        (reg: any) => new Date(reg.events?.event_date || '') > new Date()
    ) || []

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0] || 'Volunteer'}!</h1>
                <p className="text-slate-600 mt-2 font-medium">Here is your volunteer activity overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Upcoming Events</p>
                        <p className="text-2xl font-bold text-slate-900">{upcomingRegistrations.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Events Completed</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {registrations?.filter((r: any) => r.attendance_status === 'present').length || 0}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                        <Star className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Skills Listed</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {profile?.skills ? profile.skills.split(',').length : 0}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">Your Upcoming Events</h2>
                    <Link href="/available-events" className="text-sm font-bold text-primary hover:text-primary-dark">
                        Find More Events
                    </Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {upcomingRegistrations.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 italic">
                            You haven't registered for any upcoming events yet.
                        </div>
                    ) : (
                        upcomingRegistrations.map((reg: any) => (
                            <div key={reg.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <h3 className="font-bold text-slate-900">{reg.events?.title}</h3>
                                    <div className="flex items-center text-sm text-slate-500 mt-1 font-medium">
                                        <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                                        {new Date(reg.events?.event_date || '').toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                        Registered
                                    </span>
                                    {reg.assigned_role && (
                                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-tighter">Role: {reg.assigned_role}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

function OrganizationDashboard({ profile, myEvents }: { profile: any, myEvents: any }) {
    const totalRegistrations = myEvents?.reduce((acc: number, event: any) => acc + (event.event_registrations?.length || 0), 0) || 0
    const totalAttended = myEvents?.reduce((acc: number, event: any) => acc + (event.event_registrations?.filter((r: any) => r.attendance_status === 'present').length || 0), 0) || 0
    const upcomingEventsCount = myEvents?.filter((e: any) => new Date(e.event_date) > new Date()).length || 0

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Control Panel</h1>
                <p className="text-slate-600 mt-2 font-medium">Welcome, {profile?.full_name}. Oversee your impact and mission.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Events</p>
                        <p className="text-3xl font-bold text-slate-900">{upcomingEventsCount}</p>
                    </div>
                </div>
                <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                        <Users className="w-7 h-7 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Reach</p>
                        <p className="text-3xl font-bold text-slate-900">{totalRegistrations}</p>
                    </div>
                </div>
                <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Impact Rate</p>
                        <p className="text-3xl font-bold text-slate-900">
                            {totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col justify-between items-start space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">Launch a New Impact Event</h2>
                        <p className="text-primary-foreground/80 mt-2 font-medium">Ready to reach more volunteers and expand your mission's influence?</p>
                    </div>
                    <Link href="/my-events" className="flex items-center px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Create Event
                    </Link>
                </div>

                <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-900/10 flex flex-col justify-between items-start space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">Manage Active Volunteers</h2>
                        <p className="text-slate-400 mt-2 font-medium">Verify attendance and assign specialized roles for your ongoing events.</p>
                    </div>
                    <Link href="/my-events" className="flex items-center px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700 active:scale-95">
                        View Registrations
                    </Link>
                </div>
            </div>
        </div>
    )
}
