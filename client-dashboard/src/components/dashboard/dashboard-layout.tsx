'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useUnreadMessages } from '@/hooks/use-unread-messages'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile, signOut } = useAuth()
  const unreadCount = useUnreadMessages()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: t('dashboard.navigation.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('dashboard.navigation.projects'), href: '/dashboard/projects', icon: FolderOpen },
    { name: t('dashboard.navigation.communication'), href: '/dashboard/messages', icon: MessageSquare },
    { name: t('dashboard.navigation.documents'), href: '/dashboard/documents', icon: FileText },
    { name: t('dashboard.navigation.invoices'), href: '/dashboard/invoices', icon: CreditCard },
    { name: t('dashboard.navigation.analytics'), href: '/dashboard/analytics', icon: BarChart3 },
    { name: t('dashboard.navigation.settings'), href: '/dashboard/settings', icon: Settings },
  ]

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="text-xl font-bold text-white">ECM Digital</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center justify-between px-3 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white group transition-all duration-200"
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  {item.name}
                </div>
                {item.name === t('dashboard.navigation.communication') && unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-red-500 text-white text-xs border-0 px-2 py-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </a>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-slate-700">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  {getInitials(profile?.contact_person || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.contact_person || 'Użytkownik'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {profile?.company_name || user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2"
                title="Wyloguj się"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {t('dashboard.status.online')}
              </Badge>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100/50 p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/75 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}