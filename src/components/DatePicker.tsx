'use client'

import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import 'react-day-picker/dist/style.css'

interface DatePickerProps {
    name: string
    required?: boolean
    placeholder?: string
}

export default function DatePicker({ name, required, placeholder = 'Select date' }: DatePickerProps) {
    const [selected, setSelected] = useState<Date>()
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 bg-white border rounded-xl cursor-pointer transition-all duration-200 ${isOpen ? 'border-primary ring-4 ring-primary/10 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
            >
                <CalendarIcon className={`w-4 h-4 ${isOpen ? 'text-primary' : 'text-slate-400'}`} />
                <span className={`text-sm ${selected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                    {selected ? format(selected, 'PPP') : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-200 text-slate-400 ${isOpen ? 'rotate-180 text-primary' : ''}`} />

                {/* Hidden input for form submission */}
                <input
                    type="hidden"
                    name={name}
                    value={selected ? format(selected, 'yyyy-MM-dd') : ''}
                    required={required}
                />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1.5 p-5 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 origin-top">
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={(date) => {
                            setSelected(date)
                            setIsOpen(false)
                        }}
                        captionLayout="dropdown"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                        classNames={{
                            // Layout
                            months: "flex flex-col space-y-4",
                            month: "space-y-4",
                            month_caption: "flex justify-start items-center gap-3 mb-6 pr-20 relative", // Added padding right to make room for arrows
                            caption_label: "hidden",
                            dropdowns: "flex gap-2 items-center",
                            dropdown: "relative z-10",

                            // Navigation
                            nav: "flex items-center gap-1.5 absolute -right-2 top-0.5", // Fine-tuned position
                            button_previous: "h-8 w-8 bg-slate-50 border border-slate-200 rounded-lg hover:bg-white hover:border-primary hover:text-primary transition-all active:scale-95 flex items-center justify-center text-slate-500",
                            button_next: "h-8 w-8 bg-slate-50 border border-slate-200 rounded-lg hover:bg-white hover:border-primary hover:text-primary transition-all active:scale-95 flex items-center justify-center text-slate-500",

                            // Grid Structure
                            month_grid: "w-full",
                            weekdays: "grid grid-cols-7 mb-3",
                            weekday: "text-slate-400 text-center font-bold text-[11px] uppercase tracking-wider h-8 flex items-center justify-center",
                            weeks: "space-y-1.5",
                            week: "grid grid-cols-7",
                            day: "h-9 w-9 p-0 font-medium text-xs rounded-xl transition-all flex items-center justify-center text-slate-600 hover:bg-primary/10 hover:text-primary active:scale-90 cursor-pointer",
                            selected: "bg-primary text-white hover:bg-primary hover:text-white rounded-xl font-bold shadow-lg shadow-primary/25 scale-110",
                            today: "bg-slate-100 text-slate-950 font-bold",
                            outside: "text-slate-300 opacity-20",
                            disabled: "text-slate-300 opacity-50 text-decoration-line-through",
                            hidden: "invisible",
                        }}
                        components={{
                            Chevron: (props) => props.orientation === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
                        }}
                    />
                    <style jsx global>{`
                        /* Reset rdp defaults that might interfere */
                        .rdp-months { display: block !important; }
                        .rdp-month { width: auto !important; margin: 0 !important; }
                        .rdp-month_grid { width: 100% !important; border-collapse: collapse !important; }
                        .rdp-weekdays { display: grid !important; }
                        .rdp-week { display: grid !important; }
                        
                        /* Premium Dropdown Styling - More Forceful */
                        select.rdp-dropdown {
                            appearance: none !important;
                            background-color: #f8fafc !important;
                            border: 1px solid #e2e8f0 !important;
                            border-radius: 10px !important;
                            padding: 8px 32px 8px 12px !important;
                            font-size: 14px !important;
                            font-weight: 700 !important;
                            color: #1e293b !important;
                            cursor: pointer !important;
                            transition: all 0.2s !important;
                            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") !important;
                            background-repeat: no-repeat !important;
                            background-position: right 10px center !important;
                            background-size: 14px !important;
                            outline: none !important;
                        }
                        select.rdp-dropdown:hover {
                            border-color: #cbd5e1 !important;
                            background-color: #ffffff !important;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
                        }
                        select.rdp-dropdown:focus {
                            border-color: #22c55e !important;
                            background-color: #ffffff !important;
                            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12) !important;
                        }
                        
                        /* Fix for the day focus ring */
                        .rdp-day:focus-visible {
                            outline: none !important;
                        }
                    `}</style>
                </div>
            )}
        </div>
    )
}
