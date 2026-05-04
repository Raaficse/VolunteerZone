import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-8">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
            </div>
            <p className="mt-4 text-emerald-900/60 font-medium animate-pulse">
                Loading ...
            </p>
        </div>
    )
}
