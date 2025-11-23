'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, BookOpen, Shield, Users, FileText, Globe, Zap } from 'lucide-react'

export const BrandLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="url(#nav_paint0_linear)" />
    <path d="M16 6L24 10V22L16 26L8 22V10L16 6Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M8 10L16 14L24 10" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 26V14" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="nav_paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#A855F7" />
      </linearGradient>
    </defs>
  </svg>
)

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect Scroll for styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo />
          <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">BillingEngine</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
            
            {/* Product Dropdown (Simulated via Group Hover) */}
            <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition py-6">
                    Product <ChevronDown size={14}/>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[400px] bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-4 grid grid-cols-2 gap-4">
                    <a href="#features" className="p-3 rounded-lg hover:bg-slate-50 transition-colors group/item">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={18} className="text-orange-500"/>
                            <span className="font-bold text-slate-900 text-sm">Features</span>
                        </div>
                        <p className="text-xs text-slate-500">Core billing capabilities.</p>
                    </a>
                    <a href="#pricing" className="p-3 rounded-lg hover:bg-slate-50 transition-colors group/item">
                        <div className="flex items-center gap-2 mb-1">
                            <CreditCard size={18} className="text-green-500"/>
                            <span className="font-bold text-slate-900 text-sm">Pricing</span>
                        </div>
                        <p className="text-xs text-slate-500">Plans for every stage.</p>
                    </a>
                </div>
            </div>

            {/* Company Dropdown */}
            <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition py-6">
                    Company <ChevronDown size={14}/>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[400px] bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-4 grid grid-cols-2 gap-4">
                    <Link href="/company/about" className="p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <Users size={18} className="text-blue-500"/>
                            <span className="font-bold text-slate-900 text-sm">About</span>
                        </div>
                        <p className="text-xs text-slate-500">Our mission & team.</p>
                    </Link>
                    <Link href="/company/blog" className="p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen size={18} className="text-purple-500"/>
                            <span className="font-bold text-slate-900 text-sm">Blog</span>
                        </div>
                        <p className="text-xs text-slate-500">Latest news & guides.</p>
                    </Link>
                    <Link href="/company/careers" className="p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe size={18} className="text-indigo-500"/>
                            <span className="font-bold text-slate-900 text-sm">Careers</span>
                        </div>
                        <p className="text-xs text-slate-500">Join our team.</p>
                    </Link>
                </div>
            </div>

            {/* Legal Dropdown */}
            <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition py-6">
                    Legal <ChevronDown size={14}/>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[200px] bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2 flex flex-col">
                    <Link href="/legal/privacy" className="px-4 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                        <Shield size={14}/> Privacy
                    </Link>
                    <Link href="/legal/terms" className="px-4 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                        <FileText size={14}/> Terms
                    </Link>
                    <Link href="/legal/security" className="px-4 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                        <Lock size={14}/> Security
                    </Link>
                </div>
            </div>

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
        <div className="md:hidden fixed top-20 left-0 w-full bg-white border-b border-slate-100 p-6 space-y-6 shadow-2xl h-[calc(100vh-80px)] overflow-y-auto">
            <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product</p>
                <a href="#features" className="block text-lg font-medium text-slate-800" onClick={()=>setIsMenuOpen(false)}>Features</a>
                <a href="#pricing" className="block text-lg font-medium text-slate-800" onClick={()=>setIsMenuOpen(false)}>Pricing</a>
            </div>
            <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company</p>
                <Link href="/company/about" className="block text-lg font-medium text-slate-800">About</Link>
                <Link href="/company/blog" className="block text-lg font-medium text-slate-800">Blog</Link>
                <Link href="/company/careers" className="block text-lg font-medium text-slate-800">Careers</Link>
            </div>
            <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal</p>
                <Link href="/legal/privacy" className="block text-lg font-medium text-slate-800">Privacy</Link>
                <Link href="/legal/terms" className="block text-lg font-medium text-slate-800">Terms</Link>
            </div>
            <div className="pt-6 border-t border-slate-100">
                <Link href="/login" className="block w-full bg-indigo-600 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg">Get Started</Link>
                <Link href="/login" className="block w-full text-slate-600 text-center py-4 font-medium">Log In</Link>
            </div>
        </div>
      )}
    </nav>
  )
}

// Simple Lock icon since I forgot to import it in the main list
function Lock({size}:{size:number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> }
// Simple CreditCard icon
function CreditCard({size, className}:{size:number, className?:string}) { return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> }