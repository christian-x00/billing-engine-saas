'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'

// Reusing the BrandLogo from your main page (simplified here)
const BrandLogo = () => (
  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
)

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo />
            <span className="font-bold text-xl tracking-tight">BillingEngine</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/company/about" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">About</Link>
            <Link href="/company/blog" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Blog</Link>
            <Link href="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all">
              Sign In
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4 text-white">
                        <BrandLogo />
                        <span className="font-bold text-xl">BillingEngine</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                        The modern standard for metered billing infrastructure.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Company</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/company/about" className="hover:text-indigo-400">About</Link></li>
                        <li><Link href="/company/blog" className="hover:text-indigo-400">Blog</Link></li>
                        <li><Link href="/company/careers" className="hover:text-indigo-400">Careers</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Legal</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/legal/privacy" className="hover:text-indigo-400">Privacy</Link></li>
                        <li><Link href="/legal/terms" className="hover:text-indigo-400">Terms</Link></li>
                        <li><Link href="/legal/security" className="hover:text-indigo-400">Security</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                <p>&copy; {new Date().getFullYear()} BillingEngine Inc.</p>
            </div>
        </div>
      </footer>
    </div>
  )
}