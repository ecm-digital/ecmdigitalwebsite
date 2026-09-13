'use client'

import { useState, useEffect, useCallback } from 'react'

export interface AppUser {
  id: string
  email: string
  name?: string
  company?: string
  role: 'client' | 'admin' | 'manager'
  isEmailVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: AppUser | null
  isLoading: boolean
  error: string | null
}

const DEV_USER_KEY = 'dev_user'

function createDemoUser(email = 'dev@ecm-digital.com'): AppUser {
  return {
    id: 'dev-user-1',
    email,
    name: 'Tomasz Gnat',
    company: 'ECM Digital',
    role: 'client',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  }
}

function readStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(DEV_USER_KEY)
    return raw ? (JSON.parse(raw) as AppUser) : null
  } catch {
    return null
  }
}

function storeUser(user: AppUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEV_USER_KEY, JSON.stringify(user))
  }
}

function clearStoredUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEV_USER_KEY)
  }
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const stored = readStoredUser()
    const user = stored ?? createDemoUser()

    if (!stored) {
      storeUser(user)
    }

    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false,
      error: null,
    })
  }, [])

  const signIn = useCallback(async (email: string, _password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    const user = createDemoUser(email)
    storeUser(user)

    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false,
      error: null,
    })

    return { success: true, user }
  }, [])

  const signUp = useCallback(
    async (email: string, _password: string, name: string, company?: string) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

      const user: AppUser = {
        ...createDemoUser(email),
        name,
        company,
      }
      storeUser(user)

      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      })

      return {
        success: true,
        message: 'Account created successfully (demo mode).',
      }
    },
    []
  )

  const forgotPassword = useCallback(async (_email: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: false, error: null }))
    return {
      success: true,
      message: 'Password reset is unavailable in demo mode.',
    }
  }, [])

  const updatePassword = useCallback(async (_newPassword: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: false, error: null }))
    return {
      success: true,
      message: 'Password updated successfully (demo mode).',
    }
  }, [])

  const signOut = useCallback(async () => {
    clearStoredUser()
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...authState,
    signIn,
    signUp,
    forgotPassword,
    updatePassword,
    signOut,
    clearError,
  }
}
