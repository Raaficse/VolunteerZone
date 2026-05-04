import { createClient } from '@/lib/supabase/client'

export async function joinEvent(eventId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    // Check if fully booked
    const { data: event } = await supabase
        .from('events')
        .select('*, event_registrations(count)')
        .eq('id', eventId)
        .single()

    if (!event) return { error: 'Event not found' }
    const registeredCount = event.event_registrations?.[0]?.count || 0

    if (registeredCount >= event.max_volunteers) {
        return { error: 'Event is already full' }
    }

    const { error } = await supabase
        .from('event_registrations')
        .insert({
            event_id: eventId,
            volunteer_id: user.id,
            attendance_status: 'pending'
        })

    if (error) {
        if (error.code === '23505') return { error: 'You are already registered' }
        return { error: error.message }
    }
    return { success: true }
}

export async function cancelRegistration(registrationId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', registrationId)
        .eq('volunteer_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}

export async function updateProfile(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const skills = formData.get('skills') as string

    const { error } = await supabase
        .from('users')
        .update({ full_name, phone, skills })
        .eq('id', user.id)

    if (error) return { error: error.message }

    return { success: true }
}

export async function submitApplication(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    const experience = formData.get('experience') as string
    const motivation = formData.get('motivation') as string
    const dob = formData.get('dob') as string
    const gender = formData.get('gender') as string
    const blood_group = formData.get('blood_group') as string
    const phone = formData.get('phone') as string
    const nid_number = formData.get('nid_number') as string
    const district = formData.get('district') as string
    const institution = formData.get('institution') as string
    const available_days = formData.getAll('available_days').join(', ')
    const available_times = formData.get('available_times') as string

    const full_name = formData.get('full_name') as string

    const { error } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            full_name,
            experience,
            motivation,
            dob,
            gender,
            blood_group,
            phone,
            nid_number,
            district,
            institution,
            available_days,
            available_times,
            status: 'pending',
            role: 'volunteer'
        })

    if (error) return { error: error.message }

    return { success: true }
}
export async function submitOrgApplication(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    const org_type = formData.get('org_type') as string
    const registration_number = formData.get('registration_number') as string
    const website = formData.get('website') as string
    const address = formData.get('address') as string
    const contact_person = formData.get('contact_person') as string
    const designation = formData.get('designation') as string
    const phone = formData.get('phone') as string
    const description = formData.get('description') as string
    const mission = formData.get('mission') as string
    const full_name = formData.get('full_name') as string // Existing field used as Org Name here

    // Call the RPC for atomic transaction handling in the database
    const { error } = await supabase.rpc('submit_org_application', {
        p_full_name: full_name,
        p_phone: phone,
        p_org_type: org_type,
        p_registration_number: registration_number,
        p_website: website,
        p_address: address,
        p_contact_person: contact_person,
        p_designation: designation,
        p_description: description,
        p_mission: mission
    })

    if (error) return { error: error.message }

    return { success: true }
}
