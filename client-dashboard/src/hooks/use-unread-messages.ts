import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) return

    const fetchUnreadCount = async () => {
      try {
        // Get all projects for the user
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('client_id', user.id)

        if (!projects || projects.length === 0) {
          setUnreadCount(0)
          return
        }

        const projectIds = projects.map(p => p.id)

        // Count unread messages across all user's projects
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .in('project_id', projectIds)
          .is('read_at', null)
          .neq('sender_id', user.id) // Exclude own messages

        setUnreadCount(count || 0)
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchUnreadCount()

    // Subscribe to message changes
    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          // Refetch count when messages change
          fetchUnreadCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return unreadCount
}