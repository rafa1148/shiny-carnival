import Link from 'next/link'
import { Hotel } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
                        <Hotel className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-surface-900">HoteliaOS</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors">
                        Log in
                    </Link>
                    <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-all shadow-sm hover:shadow-md">
                        Start Free Trial
                    </Link>
                </div>
            </div>
        </nav>
    )
}
