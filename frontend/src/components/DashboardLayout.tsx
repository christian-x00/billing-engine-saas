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
    // Force Light Mode
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme')

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()
      setProfile(profileData)
    }
    checkUser()

    const handleUpdate = () => checkUser()
    window.addEventListener('profile-updated', handleUpdate)

    const savedSidebar = localStorage.getItem('sidebarState')
    if (savedSidebar !== null) {
        setSidebarOpen(savedSidebar === 'open')
    }

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
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      
      {/* SIDEBAR */}
      <aside 
        className={`
          fixed md:static z-30 h-screen bg-slate-50 border-r border-slate-200
          transition-all duration-300 flex flex-col justify-between
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          ${!isSidebarOpen ? '-translate-x-full md:translate-x-0' : ''} 
        `}
      >
        <div>
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 relative">
             <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'justify-center w-full'}`}>
                <div className="min-w-[32px] h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
                {isSidebarOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap">Engine</span>}
             </div>
             {isSidebarOpen && (
               <button onClick={toggleSidebar} className="hidden md:block p-1 rounded hover:bg-slate-200 text-slate-500">
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
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                      : 'text-slate-600 hover:bg-slate-100'}
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
        <div className="p-4 border-t border-slate-200 space-y-2">
            {/* User Profile Card */}
            {isSidebarOpen && (
              <Link href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-100 transition-colors mb-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-slate-200">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </Link>
            )}

            {!isSidebarOpen && (
              <Link href="/settings" className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
              </Link>
            )}

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors
                ${!isSidebarOpen && 'justify-center'}
              `}
              title="Sign Out"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span>Sign Out</span>}
            </button>
        </div>
      </aside>

      {/* EXPAND BUTTON (When Sidebar Closed) */}
      {!isSidebarOpen && (
        <button 
            onClick={toggleSidebar}
            className="fixed z-40 top-5 left-[4.5rem] p-1.5 bg-slate-50 border border-slate-200 text-indigo-600 rounded-full shadow-md hidden md:flex hover:bg-slate-100 transition-transform hover:scale-105"
            title="Expand Sidebar"
        >
            <ChevronRight size={16} />
        </button>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar (Mobile + Notifications) */}
        <header className="md:flex h-16 bg-slate-50 border-b border-slate-200 items-center justify-between px-4 sticky top-0 z-20 hidden">
          <div className="hidden md:block flex-1"></div>
          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Mobile Header (Visible only on mobile) */}
        <header className="md:hidden h-16 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4">
          <span className="font-bold text-lg">BillingEngine</span>
          <button onClick={toggleSidebar} className="text-slate-600">
            <Menu size={24}/>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/20 z-20 md:hidden" 
            onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}