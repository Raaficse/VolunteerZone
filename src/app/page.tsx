'use client'

import Link from 'next/link';
import { ArrowRight, Calendar, Users, HeartHandshake, Building2, ShieldCheck, ClipboardCheck, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <HeartHandshake className="w-8 h-8 text-primary" />
                        <span className="font-bold text-xl tracking-tight">Volunteer<span className="text-primary">Zone</span></span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/organization/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Organizations</Link>
                        <div className="h-4 w-[1px] bg-slate-200" />
                        <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Volunteers</Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Premium Mobile Nav Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-16 bg-white/80 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-6 space-y-4">
                            
                            <Link 
                                href="/organization/login" 
                                className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-transform"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="p-3 bg-purple-50 rounded-2xl">
                                    <Building2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Organizations</p>
                                    <p className="text-xs text-slate-500">Post events and manage NGO</p>
                                </div>
                            </Link>

                            <Link 
                                href="/login" 
                                className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-transform"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Volunteers</p>
                                    <p className="text-xs text-slate-500">Find opportunities & track impact</p>
                                </div>
                            </Link>

                            <div className="pt-4 px-2">
                                <Link 
                                    href="/register" 
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-transform"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    New Volunteer? Join Now
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1">
                <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 md:mb-8 leading-[1.2] md:leading-[1.1]">
                            The Bridge Between <span className="text-primary">Kindness</span> <br className="hidden sm:block" />
                            And <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">Real Impact</span>.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto px-2">
                            Empowering NGOs to reach talent and enabling volunteers to find their purpose. A unified platform for social change.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto px-10 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 text-lg">
                                Join as a Volunteer <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Comprehensive Platform Features</h2>
                            <p className="text-slate-500 mt-4 max-w-xl mx-auto px-4">Everything you need to manage volunteers and impact successfully.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    icon: <Calendar className="w-10 h-10 text-primary p-2 bg-primary/10 rounded-xl mb-4" />,
                                    title: "Smart Event Discovery",
                                    desc: "Intelligent matching for volunteers based on skills, location, and interests."
                                },
                                {
                                    icon: <Building2 className="w-10 h-10 text-purple-600 p-2 bg-purple-50 rounded-xl mb-4" />,
                                    title: "NGO Dashboards",
                                    desc: "Full autonomy for organizations to manage their own mission-driven events."
                                },
                                {
                                    icon: <ClipboardCheck className="w-10 h-10 text-blue-600 p-2 bg-blue-50 rounded-xl mb-4" />,
                                    title: "Application Tracking",
                                    desc: "Robust review system for both volunteer signups and organization partners."
                                },
                                {
                                    icon: <Users className="w-10 h-10 text-orange-500 p-2 bg-orange-50 rounded-xl mb-4" />,
                                    title: "Community Growth",
                                    desc: "Unified network connecting local talent with high-impact NGOs."
                                },
                                {
                                    icon: <ShieldCheck className="w-10 h-10 text-emerald-600 p-2 bg-emerald-50 rounded-xl mb-4" />,
                                    title: "Admin Governance",
                                    desc: "Professional oversight tools for platform administrators to ensure quality."
                                },
                                {
                                    icon: <HeartHandshake className="w-10 h-10 text-rose-500 p-2 bg-rose-50 rounded-xl mb-4" />,
                                    title: "Impact History",
                                    desc: "Automated digital records for volunteer contributions and attendance."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-6 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-center sm:text-left">
                                    <div className="flex justify-center sm:justify-start">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 py-12 text-slate-300">
                <div className="container mx-auto px-4 text-center">
                    <HeartHandshake className="w-8 h-8 mx-auto mb-6 text-slate-400" />
                    <p className="mb-4">© {new Date().getFullYear()} VolunteerZone. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
