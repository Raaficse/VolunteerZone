'use client';
import { useEffect } from 'react';
import { app } from '@/lib/firebase/client';

export function FirebaseInit() {
    useEffect(() => {
        if (app) {
            console.log('Firebase App initialized on client:', app.name);
        }
    }, []);
    return null;
}
