'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LayoutDashboard, CreditCard, Key, Settings, LogOut, 
  Menu, ChevronLeft, ChevronRight, Bell, User 
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Force Dark Mode Class
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single()
      setProfile(data)
    }
    checkUser()

    const handleUpdate = () => checkUser()
    window.addEventListener('profile-updated', handleUpdate)

    const savedSidebar = localStorage.getItem('sidebarState')
    if (savedSidebar !== null) setSidebarOpen(savedSidebar === 'open')

    return () => window.removeEventListener('profile-updated', handleUpdate)
  }, [router])

  const toggleSidebar = () => {
      const newState = !isSidebarOpen
      setSidebarOpen(newState)
      localStorage.setItem('sidebarState', newState ? 'open' : 'closed')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: CreditCard },
    { name: 'API Keys', href: '/keys', icon: Key },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen flex bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* SIDEBAR */}
      <aside 
        className={`
          fixed md:static z-30 h-screen bg-slate-900 border-r border-slate-800
          transition-all duration-300 flex flex-col justify-between
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          ${!isSidebarOpen ? '-translate-x-full md:translate-x-0' : ''} 
        `}
      >
        <div>
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 relative">
             <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'justify-center w-full'}`}>
                <div className="min-w-[32px] h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
                {isSidebarOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap">Engine</span>}
             </div>
             {isSidebarOpen && (
               <button onClick={toggleSidebar} className="hidden md:block p-1 rounded hover:bg-slate-800 text-slate-400">
                 <ChevronLeft size={20} />
               </button>
             )}
          </div>
          
          {/* Navigation */}
          <nav className="p-3 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                    ${!isSidebarOpen && 'justify-center'}
                  `}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <item.icon size={20} />
                  {isSidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
            {/* User Profile */}
            {isSidebarOpen && (
              <Link href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors mb-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-slate-700">
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <User size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </Link>
            )}
            {!isSidebarOpen && (
              <Link href="/settings" className="flex justify-center mb-4">
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm border border-slate-700">
                    <User size={20} />
                 </div>
              </Link>
            )}

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors
                ${!isSidebarOpen && 'justify-center'}
              `}
              title="Sign Out"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span>Sign Out</span>}
            </button>
        </div>
      </aside>

      {/* EXPAND BUTTON */}
      {!isSidebarOpen && (
        <button 
            onClick={toggleSidebar}
            className="fixed z-40 top-5 left-[4.5rem] p-1.5 bg-slate-800 border border-slate-700 text-indigo-400 rounded-full shadow-md hidden md:flex hover:bg-slate-700 transition-transform hover:scale-105"
        >
            <ChevronRight size={16} />
        </button>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-900">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
          <span className="font-bold text-lg text-white">BillingEngine</span>
          <button onClick={toggleSidebar} className="text-slate-400"><Menu size={24}/></button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900 text-white">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}