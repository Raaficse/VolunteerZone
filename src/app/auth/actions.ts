import { createClient } from '@/lib/supabase/client'

export async function login(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: signInData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    const authUser = signInData.user

    if (!authUser) {
        return { error: 'Login failed: Could not retrieve user' }
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single()

    const role = authUser.email === 'raaficse@gmail.com' ? 'admin' : profile?.role

    let redirectUrl = '/dashboard'
    if (role === 'admin') {
        redirectUrl = '/admin'
    } else if (role === 'moderator') {
        redirectUrl = '/moderator'
    }

    return { success: true, redirectUrl }
}

export async function signup(formData: FormData, role: 'volunteer' | 'organization' = 'volunteer') {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
                role: role,
            },
        }
    }

    const { data: signUpData, error } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    if (signUpData?.user?.identities?.length === 0) {
        return { error: 'An account with this email already exists. Please sign in instead.' }
    }

    return { success: true }
}

export async function verifyOtp(email: string, token: string, type: 'signup' | 'recovery') {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function resendOtp(email: string, type: 'signup' | 'email_change') {
    const supabase = createClient()

    const { error } = await supabase.auth.resend({
        type,
        email,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    return { success: true }
}

export async function forgotPassword(email: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function resendRecoveryOtp(email: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function verifyRecoveryOtp(email: string, token: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function updatePassword(password: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
