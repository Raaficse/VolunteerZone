'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeartHandshake, LogOut, LayoutDashboard, Calendar, Users, History, User, ClipboardCheck, Building2, CheckSquare, ShieldCheck, Menu, X } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { useState } from 'react'

interface SidebarProps {
    role: 'admin' | 'volunteer' | 'organization'
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const adminLinks = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
        { name: 'Organizations', href: '/admin/organizations', icon: Building2 },
        { name: 'Applications', href: '/admin/applications', icon: ClipboardCheck },
        { name: 'Org Applications', href: '/admin/org-applications', icon: Building2 },
        { name: 'Approvals', href: '/admin/approvals', icon: CheckSquare },
        { name: 'Moderators', href: '/admin/moderators', icon: ShieldCheck },
    ]

    const volunteerLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Available Events', href: '/available-events', icon: Calendar },
        { name: 'My History', href: '/history', icon: History },
        { name: 'Profile', href: '/profile', icon: User },
    ]

    const organizationLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Events', href: '/my-events', icon: Calendar },
        { name: 'Profile', href: '/profile', icon: User },
    ]

    const links = role === 'admin' ? adminLinks : role === 'organization' ? organizationLinks : volunteerLinks

    return (
        <>
            {/* Mobile Toggle Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-6 z-50 border-b border-slate-800">
                <div className="flex items-center">
                    <HeartHandshake className="w-6 h-6 text-primary mr-2" />
                    <span className="font-bold text-white text-lg tracking-tight">Volunteer<span className="text-primary">Zone</span></span>
                </div>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Desktop & Mobile Drawer */}
            <div className={`
                w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col fixed inset-y-0 text-sm z-50 transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950 shrink-0">
                    <HeartHandshake className="w-6 h-6 text-primary mr-2" />
                    <span className="font-bold text-white text-lg tracking-tight">Volunteer<span className="text-primary">Zone</span></span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {links.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 shrink-0">
                    <button
                        onClick={async () => {
                            await logout()
                            window.location.href = '/'
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5 text-slate-400" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    )
}
