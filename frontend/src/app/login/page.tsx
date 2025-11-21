'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Force Light Mode on Login Page to ensure text is black and readable
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMsg(error.message)
    else router.refresh()
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setMsg('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMsg(error.message)
    else setMsg('Success! Check your email to confirm.')
    setLoading(false)
  }

  return (
    // Force white background on the container
    <div className="min-h-screen flex bg-white">
      
      {/* Left Side - Branding (Dark Blue) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-900 opacity-90" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <h1 className="text-5xl font-bold mb-6">Billing<br/>Engine.</h1>
            <p className="text-xl text-indigo-100 max-w-md">
                The complete usage-based billing infrastructure. 
                Secure, scalable, and ready for production.
            </p>
        </div>
      </div>

      {/* Right Side - Form (White Background, Black Text) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white text-gray-900">
        <div className="w-full max-w-md space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-2 text-gray-500">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="••••••••"
                        required
                    />
                    <div className="flex justify-end mt-1">
                        <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                {msg && <div className={`p-3 rounded-lg text-sm ${msg.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}

                <button disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200">
                    {loading ? 'Processing...' : 'Sign In'}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">New here?</span></div>
                </div>

                <button type="button" onClick={handleSignUp} disabled={loading} className="w-full bg-white text-gray-700 border border-gray-300 p-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                    Create an account
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}