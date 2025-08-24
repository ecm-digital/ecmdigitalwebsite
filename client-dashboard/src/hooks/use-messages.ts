import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Message } from '@/types/database'

export function useMessages(projectId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const { user } = useAuthStore()

  // Fetch messages for a project
  const fetchMessages = useCallback(async (pId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(*)
        `)
        .eq('project_id', pId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Send a new message
  const sendMessage = async (content: string, attachments?: any[], senderId?: string) => {
    if (!user || !projectId || !content.trim()) return

    setSending(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          project_id: projectId,
          sender_id: senderId || user.id,
          content: content.trim(),
          attachments: attachments || []
        }])
        .select(`
          *,
          sender:profiles(*)
        `)
        .single()

      if (error) throw error

      // Add message to local state immediately for optimistic updates
      setMessages(prev => [...prev, data])

      return { success: true, data }
    } catch (error) {
      console.error('Error sending message:', error)
      return { success: false, error }
    } finally {
      setSending(false)
    }
  }

  // Send chatbot message (for AI responses)
  const sendChatbotMessage = async (content: string, isVoice: boolean = false) => {
    if (!projectId || !content.trim()) return

    // Create a chatbot user ID (or use a system user)
    const chatbotUserId = 'chatbot-system-user'

    const result = await sendMessage(content, [], chatbotUserId)

    if (result.success) {
      // Mark as bot message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === result.data.id
            ? { ...msg, is_bot: true, is_voice: isVoice }
            : msg
        )
      )
    }

    return result
  }

  // Mark messages as read
  const markAsRead = async (messageIds: string[]) => {
    if (!user || messageIds.length === 0) return

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', messageIds)
        .is('read_at', null)

      if (error) throw error

      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          messageIds.includes(msg.id) 
            ? { ...msg, read_at: new Date().toISOString() }
            : msg
        )
      )
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    if (!projectId || !user) return

    fetchMessages(projectId)

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles(*)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages(prev => {
              // Avoid duplicates (in case of optimistic updates)
              const exists = prev.some(msg => msg.id === data.id)
              return exists ? prev : [...prev, data]
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === payload.new.id
                ? { ...msg, ...payload.new }
                : msg
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, user, fetchMessages])

  // Get unread messages count
  const unreadCount = messages.filter(msg => 
    !msg.read_at && msg.sender_id !== user?.id
  ).length

  // Get latest message
  const latestMessage = messages[messages.length - 1]

  return {
    messages,
    loading,
    sending,
    sendMessage,
    sendChatbotMessage,
    markAsRead,
    unreadCount,
    latestMessage,
    refetch: () => projectId && fetchMessages(projectId)
  }
}