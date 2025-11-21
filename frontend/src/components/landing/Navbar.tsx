'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export const BrandLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="url(#paint0_linear)" />
    <path d="M16 6L24 10V22L16 26L8 22V10L16 6Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M8 10L16 14L24 10" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 26V14" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#A855F7" />
      </linearGradient>
    </defs>
  </svg>
)

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo />
          <span className="font-bold text-xl tracking-tight text-slate-900">BillingEngine</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Features</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Pricing</a>
          <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Contact</a>
          <div className="h-4 w-px bg-slate-200"></div>
          <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-indigo-600">Sign In</Link>
          <Link href="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-500/25">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-4 shadow-xl absolute w-full">
          <a href="#features" className="block text-lg font-medium text-slate-600" onClick={()=>setIsMenuOpen(false)}>Features</a>
          <a href="#pricing" className="block text-lg font-medium text-slate-600" onClick={()=>setIsMenuOpen(false)}>Pricing</a>
          <Link href="/login" className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-bold">Sign In</Link>
        </div>
      )}
    </nav>
  )
}