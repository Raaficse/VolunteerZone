'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get('code')
            const next = searchParams.get('next') ?? '/login'

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code)
                if (!error) {
                    router.push(next)
                    return
                }
            }
            router.push('/login')
        }

        handleAuthCallback()
    }, [router, searchParams, supabase])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    )
}
