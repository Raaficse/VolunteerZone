export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    full_name: string
                    phone: string | null
                    role: 'admin' | 'volunteer'
                    skills: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name: string
                    phone?: string | null
                    role?: 'admin' | 'volunteer'
                    skills?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    phone?: string | null
                    role?: 'admin' | 'volunteer'
                    skills?: string | null
                    created_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    location: string | null
                    event_date: string
                    max_volunteers: number
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    location?: string | null
                    event_date: string
                    max_volunteers?: number
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    location?: string | null
                    event_date?: string
                    max_volunteers?: number
                    created_by?: string | null
                    created_at?: string
                }
            }
            event_registrations: {
                Row: {
                    id: string
                    event_id: string
                    volunteer_id: string
                    assigned_role: string | null
                    attendance_status: 'pending' | 'present' | 'absent'
                    registered_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    volunteer_id: string
                    assigned_role?: string | null
                    attendance_status?: 'pending' | 'present' | 'absent'
                    registered_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    volunteer_id?: string
                    assigned_role?: string | null
                    attendance_status?: 'pending' | 'present' | 'absent'
                    registered_at?: string
                }
            }
        }
    }
}
