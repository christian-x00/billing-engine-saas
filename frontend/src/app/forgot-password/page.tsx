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
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    })

    if (error) setMsg('Error: ' + error.message)
    else setMsg('Check your email for the reset link.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-500 mb-6">Enter your email to receive a recovery link.</p>
        
        <form onSubmit={handleReset} className="space-y-4">
            <input 
                type="email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
            />
            {msg && <p className="text-sm text-indigo-600">{msg}</p>}
            <button disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-500">
                {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>
        <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}