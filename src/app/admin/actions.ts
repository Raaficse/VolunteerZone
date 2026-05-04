import { createClient } from '@/lib/supabase/client'

export async function createEvent(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    const { data: profile } = await supabase.from('users').select('full_name, role').eq('id', user.id).single()
    const isAdmin = user.email === 'raaficse@gmail.com'
    const isMod = profile?.role === 'moderator'
    const status = (isAdmin || isMod) ? 'approved' : 'pending'
    const org_name = (isAdmin || isMod) ? 'VolunteerZone' : (profile?.full_name || 'VolunteerZone')

    const errorMsg = await supabase.from('events').insert({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        location: formData.get('location') as string,
        event_date: formData.get('event_date') as string,
        max_volunteers: parseInt(formData.get('max_volunteers') as string),
        created_by: user.id,
        status,
        org_name
    }).then((res: any) => res.error?.message)

    if (errorMsg) return { error: errorMsg }

    return { success: true }
}

export async function updateEventStatus(eventId: string, status: 'approved' | 'rejected' | 'finished') {
    const supabase = createClient()
    const errorMsg = await supabase.from('events').update({ status }).eq('id', eventId).then((res: any) => res.error?.message)

    if (errorMsg) return { error: errorMsg }

    return { success: true }
}

export async function deleteEvent(eventId: string) {
    const supabase = createClient()
    const errorMsg = await supabase.from('events').delete().eq('id', eventId).then((res: any) => res.error?.message)

    if (errorMsg) return { error: errorMsg }

    return { success: true }
}

export async function updateRegistrationStatus(regId: string, status: string, role: string, certificateUrl?: string) {
    const supabase = createClient()
    const errorMsg = await supabase.from('event_registrations').update({
        attendance_status: status as any,
        assigned_role: role,
        certificate_url: certificateUrl
    }).eq('id', regId).then((res: any) => res.error?.message)

    if (errorMsg) return { error: errorMsg }

    return { success: true }
}

export async function updateApplicationStatus(userId: string, status: 'approved' | 'disapproved') {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId)
        .select()

    if (error) return { error: error.message }
    if (!data || data.length === 0) return { error: 'Failed to update user status. You may not have permission or the user does not exist.' }

    return { success: true }
}

export async function deleteUser(userId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    // Call the RPC that handles deletion with SECURITY DEFINER
    const { error } = await supabase.rpc('delete_user_by_admin', {
        target_user_id: userId
    })

    if (error) return { error: error.message }

    return { success: true }
}
