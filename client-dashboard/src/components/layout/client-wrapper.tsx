'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Navigation from '@/components/ui/navigation'
import { useAWSAuth } from '@/hooks/use-aws-auth'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { logout } = useAWSAuth()
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        // Get user from localStorage or session
        const userData = localStorage.getItem('ecm_user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      localStorage.removeItem('ecm_user')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Ładowanie...</div>
      </div>
    )
  }

  return (
    <>
      {!isAuthPage && <Navigation user={user} onLogout={handleLogout} />}
      <main className={isAuthPage ? "pt-0" : "pt-16"}>
        {children}
      </main>
    </>
  )
}
