import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Heart, Zap, Globe, Mail, Search } from 'lucide-react'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-24">
            <h1 className="text-5xl font-extrabold tracking-tight mb-8">Join the mission.</h1>
            <p className="text-xl text-slate-500 leading-relaxed">
                We are a remote-first team building the financial infrastructure for the next generation of software companies.
            </p>
        </div>

        {/* Values */}
        <div className="bg-slate-50 py-20 mb-24">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-red-500"><Heart size={32}/></div>
                    <h3 className="text-xl font-bold mb-2">Obsess over Customers</h3>
                    <p className="text-slate-500">We don't just build software; we solve painful financial problems for real people.</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-yellow-500"><Zap size={32}/></div>
                    <h3 className="text-xl font-bold mb-2">Ship Fast, High Quality</h3>
                    <p className="text-slate-500">We deploy to production multiple times a day. Speed is a feature.</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-blue-500"><Globe size={32}/></div>
                    <h3 className="text-xl font-bold mb-2">Work from Anywhere</h3>
                    <p className="text-slate-500">We care about your output, not your timezone. 100% remote since day one.</p>
                </div>
            </div>
        </div>

        {/* NO OPEN POSITIONS STATE */}
        <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">Open Positions</h2>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                    <Search size={40}/>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No open roles right now</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    We are currently fully staffed, but we are always looking for exceptional talent. 
                    Join our talent pool to be notified when new roles open up.
                </p>
                
                <div className="flex w-full max-w-md gap-3">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <Mail size={18}/> Notify Me
                    </button>
                </div>
                <p className="text-xs text-slate-400 mt-4">We respect your privacy. No spam.</p>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}