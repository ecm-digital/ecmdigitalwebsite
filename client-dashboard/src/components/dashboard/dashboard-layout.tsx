'use client'

import { ReactNode } from 'react'
import { useAWSAuth } from '@/hooks/use-aws-auth'
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
  Menu,
  Bell,
  Search,
  CalendarIcon,
  Bot
} from 'lucide-react'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAWSAuth()
  const unreadCount = useUnreadMessages()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: t('dashboard.navigation.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('dashboard.navigation.projects'), href: '/dashboard/projects', icon: FolderOpen },
    { name: t('dashboard.navigation.communication'), href: '/dashboard/messages', icon: MessageSquare },
    { name: t('dashboard.navigation.documents'), href: '/dashboard/documents', icon: FileText },
    { name: t('dashboard.navigation.invoices'), href: '/dashboard/invoices', icon: CreditCard },
    { name: t('dashboard.navigation.calendar'), href: '/dashboard/calendar', icon: CalendarIcon },
    { name: 'AI Asystent', href: '/ai-assistant', icon: Bot },
    { name: t('dashboard.navigation.analytics'), href: '/dashboard/analytics', icon: BarChart3 },
    { name: t('dashboard.navigation.settings'), href: '/dashboard/settings', icon: Settings },
  ]

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between px-8 border-b border-slate-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ECM Digital</h1>
                <p className="text-xs text-slate-400">Panel Klienta</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-6 py-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center justify-between px-4 py-4 text-sm font-medium text-slate-300 rounded-2xl hover:bg-gradient-to-r hover:from-slate-800/80 hover:to-slate-700/80 hover:text-white transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-slate-800/50 rounded-xl mr-3 group-hover:bg-blue-500/20 transition-all duration-300">
                    <item.icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  {item.name}
                </div>
                {item.name === t('dashboard.navigation.communication') && unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs border-0 px-2 py-1 rounded-full shadow-lg">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </a>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-slate-700/50 p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-slate-600 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || user?.email || 'User'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.role === 'admin' ? 'Administrator' : 'Klient'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Szukaj projektów, dokumentów..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 rounded-xl hover:bg-slate-100"
              >
                <Bell className="h-5 w-5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.role === 'admin' ? 'Administrator' : 'Klient'}
                  </p>
                </div>
                <Avatar className="h-10 w-10 ring-2 ring-slate-200 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}