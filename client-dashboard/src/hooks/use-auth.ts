'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

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

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  })

  // Check if user is already authenticated
  useEffect(() => {
    // Force dev user in development mode
    if (process.env.NODE_ENV === 'development' && !isSupabaseConfigured()) {
      const defaultUser: AppUser = {
        id: 'dev-user-1',
        email: 'dev@ecm-digital.com',
        name: 'Tomasz Gnat',
        company: 'ECM Digital',
        role: 'client',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('dev_user', JSON.stringify(defaultUser))
      }
      
      setAuthState({
        isAuthenticated: true,
        user: defaultUser,
        isLoading: false,
        error: null
      })
      return
    }

    // Check for existing session
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (session?.user) {
          const appUser = await mapSupabaseUserToAppUser(session.user)
          setAuthState({
            isAuthenticated: true,
            user: appUser,
            isLoading: false,
            error: null
          })
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null
        })
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const appUser = await mapSupabaseUserToAppUser(session.user)
        setAuthState({
          isAuthenticated: true,
          user: appUser,
          isLoading: false,
          error: null
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign In
  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    // In development mode without Supabase, simulate success
    if (process.env.NODE_ENV === 'development' && !isSupabaseConfigured()) {
      const defaultUser: AppUser = {
        id: 'dev-user-1',
        email: email,
        name: 'Tomasz Gnat',
        company: 'ECM Digital',
        role: 'client',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('dev_user', JSON.stringify(defaultUser))
      }
      
      setAuthState({
        isAuthenticated: true,
        user: defaultUser,
        isLoading: false,
        error: null
      })
      
      return { success: true, user: defaultUser }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user) {
        const appUser = await mapSupabaseUserToAppUser(data.user)
        setAuthState({
          isAuthenticated: true,
          user: appUser,
          isLoading: false,
          error: null
        })
        
        return { success: true, user: appUser }
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error: any) {
      const errorMessage = getSupabaseErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Sign Up
  const signUp = useCallback(async (email: string, password: string, name: string, company?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
            role: 'client'
          }
        }
      })
      
      if (error) throw error
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { 
        success: true, 
        message: 'Account created successfully. Please check your email for verification.' 
      }
    } catch (error: any) {
      const errorMessage = getSupabaseErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Forgot Password
  const forgotPassword = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: true, message: 'Password reset link sent to your email.' }
    } catch (error: any) {
      const errorMessage = getSupabaseErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Update Password
  const updatePassword = useCallback(async (newPassword: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: true, message: 'Password updated successfully.' }
    } catch (error: any) {
      const errorMessage = getSupabaseErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dev_user')
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
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

// Helper function to map Supabase user to AppUser
async function mapSupabaseUserToAppUser(user: User): Promise<AppUser> {
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || '',
    company: user.user_metadata?.company || '',
    role: user.user_metadata?.role || 'client',
    isEmailVerified: !!user.email_confirmed_at,
    createdAt: user.created_at,
    lastLoginAt: user.last_sign_in_at || undefined,
  }
}

// Helper function to get user-friendly error messages
function getSupabaseErrorMessage(error: any): string {
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password'
  } else if (error.message?.includes('Email not confirmed')) {
    return 'Please verify your email address'
  } else if (error.message?.includes('User not found')) {
    return 'User not found'
  } else if (error.message?.includes('User already registered')) {
    return 'User already exists'
  } else if (error.message?.includes('Password')) {
    return 'Password must be at least 6 characters'
  } else {
    return error.message || 'An unexpected error occurred'
  }
}
