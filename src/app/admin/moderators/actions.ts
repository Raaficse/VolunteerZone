import { createClient as createJSClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export async function createModerator(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string

    // Check if the current user is an admin
    const supabaseSsr = createClient()
    const { data: { user: currentUser } } = await supabaseSsr.auth.getUser()
    
    if (!currentUser) return { error: 'Unauthorized' }
    
    // We check admin status (raaficse@gmail.com is our superadmin condition, or role 'admin')
    const { data: profile } = await supabaseSsr.from('users').select('role').eq('id', currentUser.id).single()
    const role = currentUser.email === 'raaficse@gmail.com' ? 'admin' : profile?.role
    
    if (role !== 'admin') return { error: 'Unauthorized. Only admins can create moderators.' }

    // Use a fresh Supabase JS client for creating the account.
    // This is to avoid writing the new session into the Next.js cookies,
    // which would otherwise replace the admin's currently authenticated session.
    const supabase = createJSClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'moderator'
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function deleteModerator(modId: string) {
    const supabase = createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return { error: 'Unauthorized' }

    const { error } = await supabase.rpc('delete_moderator', { mod_id: modId })
    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function updateModerator(modId: string, fullName: string) {
    const supabase = createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return { error: 'Unauthorized' }

    // Check admin status
    const { data: profile } = await supabase.from('users').select('role').eq('id', currentUser.id).single()
    const role = currentUser.email === 'raaficse@gmail.com' ? 'admin' : profile?.role
    
    if (role !== 'admin') return { error: 'Unauthorized. Only admins can update moderators.' }

    const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', modId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
