import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/Toaster';
import { FirebaseInit } from '@/components/FirebaseInit';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'VolunteerZone',
    description: 'Manage NGO events and volunteers seamlessly',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
                <NextTopLoader color="#10b981" showSpinner={false} />
                <FirebaseInit />
                {children}
                <Toaster />
            </body>
        </html>
    );
}
