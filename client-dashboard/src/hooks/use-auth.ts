import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useAuth() {
  const { user, profile, loading, setUser, setProfile, setLoading, signOut } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        // Skip profile fetch for now to avoid blocking login
        // await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          // Skip profile fetch for now to avoid blocking login
          // await fetchProfile(session.user.id)
        } else {
          signOut()
          router.push('/auth/login')
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setLoading, signOut, router])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('Profile not found, creating basic profile:', error)
        // If profile doesn't exist, create a basic one or skip
        setProfile(null)
        return
      }
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  }

  const signOutUser = async () => {
    await supabase.auth.signOut()
    signOut()
    router.push('/auth/login')
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    isAuthenticated: !!user,
  }
}