import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-slate-400 font-medium animate-pulse text-sm">Loading your dashboard...</p>
        </div>
    )
}
