import PublicLayout from '@/components/PublicLayout'
import { Shield } from 'lucide-react'

export default function SecurityPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-8">
            <Shield className="text-green-600" size={32} />
            <h1 className="text-3xl font-bold">Security</h1>
        </div>
        <div className="space-y-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg mb-2">Data Encryption</h3>
                <p className="text-slate-600">All data is encrypted at rest using AES-256 and in transit using TLS 1.3.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg mb-2">Infrastructure</h3>
                <p className="text-slate-600">Our infrastructure is hosted on AWS and Supabase, certified for SOC 2 and ISO 27001 compliance.</p>
            </div>
        </div>
      </div>
    </PublicLayout>
  )
}