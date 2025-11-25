'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Capture intended plan from URL
    const plan = searchParams.get('plan')
    if (plan) {
        localStorage.setItem('intendedPlan', plan)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMsg(error.message)
    else {
        // If there is a plan, go to settings to pay. Else dashboard.
        if (localStorage.getItem('intendedPlan')) {
            router.push('/settings')
        } else {
            router.push('/')
        }
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setMsg('')
    const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: `${window.location.origin}/settings` }
    })
    if (error) setMsg(error.message)
    else setMsg('Success! Check your email to confirm.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-white text-gray-900 font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-900 opacity-90" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <h1 className="text-5xl font-bold mb-6">Billing<br/>Engine.</h1>
            <p className="text-xl text-indigo-100 max-w-md">The complete usage-based billing infrastructure.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-2 text-gray-500">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter your email" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" required />
                    <div className="flex justify-end mt-1"><Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">Forgot password?</Link></div>
                </div>

                {msg && <div className={`p-3 rounded-lg text-sm ${msg.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}

                <button disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200">
                    {loading ? 'Processing...' : 'Sign In'}
                </button>

                <button type="button" onClick={handleSignUp} disabled={loading} className="w-full bg-white text-gray-700 border border-gray-300 p-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                    Create an account
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense fallback={<div>Loading...</div>}><LoginContent /></Suspense>
}