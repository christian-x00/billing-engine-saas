'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    })

    if (error) setMsg('Error: ' + error.message)
    else setMsg('Check your email for the reset link.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-500">Enter your email to receive a recovery link.</p>
        </div>
        
        <form onSubmit={handleReset} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)}
                    placeholder="name@company.com"
                    // FIX: Added 'text-gray-900' and 'bg-white' to force visibility
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
                    required
                />
            </div>

            {msg && (
                <div className={`p-3 rounded-lg text-sm font-medium ${msg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {msg}
                </div>
            )}

            <button 
                disabled={loading} 
                className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70"
            >
                {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                ← Back to Login
            </Link>
        </div>
      </div>
    </div>
  )
}