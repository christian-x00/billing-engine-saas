import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Shield, Lock, Server, Eye } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield size={32}/>
                </div>
                <h1 className="text-4xl font-bold mb-6">Enterprise-Grade Security</h1>
                <p className="text-xl text-slate-500">Security is not an afterthought. It is our core product feature.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50">
                    <Lock className="text-indigo-600 mb-4" size={32}/>
                    <h3 className="text-xl font-bold mb-2">Encryption Everywhere</h3>
                    <p className="text-slate-600">All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Your API keys are hashed using bcrypt before storage.</p>
                </div>
                <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50">
                    <Server className="text-indigo-600 mb-4" size={32}/>
                    <h3 className="text-xl font-bold mb-2">Isolated Infrastructure</h3>
                    <p className="text-slate-600">We use Row Level Security (RLS) in PostgreSQL to ensure tenant data isolation. Your data lives in its own logical partition.</p>
                </div>
                <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50">
                    <Eye className="text-indigo-600 mb-4" size={32}/>
                    <h3 className="text-xl font-bold mb-2">Audit Logging</h3>
                    <p className="text-slate-600">Every action in the dashboard is logged. We provide comprehensive audit trails for compliance requirements.</p>
                </div>
                <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50">
                    <Shield className="text-indigo-600 mb-4" size={32}/>
                    <h3 className="text-xl font-bold mb-2">SOC 2 Type II</h3>
                    <p className="text-slate-600">Our infrastructure provider (AWS) is SOC 2 Type II certified. We are currently undergoing our own certification process.</p>
                </div>
            </div>

            <div className="bg-indigo-900 rounded-3xl p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Found a vulnerability?</h2>
                <p className="text-indigo-200 mb-8 max-w-xl mx-auto">We run a private bug bounty program. If you believe you have found a security issue, please contact our security team immediately.</p>
                <a href="mailto:Christian.onlinedigital@gmail.com" className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Contact Security</a>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}