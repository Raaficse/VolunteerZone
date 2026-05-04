'use client'

import { useState } from 'react'
import ApplyForm from './ApplyForm'
import OrgApplyForm from '@/app/organization/apply/OrgApplyForm'
import DisapprovedView from './DisapprovedView'

interface ApplyContainerProps {
    userEmail: string
    userName: string
    initialStatus: string
    role: 'volunteer' | 'organization'
}

export default function ApplyContainer({
    userEmail,
    userName,
    initialStatus,
    role
}: ApplyContainerProps) {
    // Local state to handle 'disapproved' -> 'unapplied' transition without full page refresh
    const [status, setStatus] = useState(initialStatus)

    if (status === 'disapproved') {
        return (
            <DisapprovedView
                userEmail={userEmail}
                onRetry={() => setStatus('unapplied')}
            />
        )
    }

    if (role === 'organization') {
        return <OrgApplyForm userEmail={userEmail} userName={userName} />
    }

    return <ApplyForm userEmail={userEmail} userName={userName} />
}
