import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={`${inter.variable} font-sans min-h-screen bg-canvas flex items-center justify-center p-4`}>
            {children}
        </div>
    )
}
