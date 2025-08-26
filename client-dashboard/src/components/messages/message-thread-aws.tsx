'use client'

import { useEffect, useRef, useState } from 'react'
import { useMessagesAWS } from '@/hooks/use-messages-aws'
import { MessageBubbleAWS } from './message-bubble-aws'
import { MessageInputAWS } from './message-input-aws'
import { ChatbotComponentAWS } from './chatbot-component-aws'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  MessageSquare,
  Bot,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface MessageThreadAWSProps {
  projectId: string
}

export function MessageThreadAWS({ projectId }: MessageThreadAWSProps) {
  const {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead
  } = useMessagesAWS(projectId)

  const [isChatbotMode, setIsChatbotMode] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessageIds = messages
        .filter(msg => !msg.read_at && msg.sender_id !== 'current-user-id')
        .map(msg => msg.id)
      
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds)
      }
    }
  }, [messages, markAsRead])

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(new Date(message.created_at), 'yyyy-MM-dd')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, typeof messages>)

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Dzisiaj'
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Wczoraj'
    } else {
      return format(date, 'dd MMMM yyyy', { locale: pl })
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Ładowanie wiadomości...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Wiadomości projektu</CardTitle>
              <p className="text-sm text-gray-500">
                {messages.length} wiadomości
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isChatbotMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsChatbotMode(!isChatbotMode)}
              className="flex items-center space-x-2"
            >
              <Bot className="h-4 w-4" />
              <span>{isChatbotMode ? 'Tryb czatu' : 'AI Asystent'}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        {isChatbotMode ? (
          <ChatbotComponentAWS projectId={projectId} />
        ) : (
          <div className="h-full flex flex-col">
            {/* Messages List */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Brak wiadomości</p>
                  <p className="text-sm">Rozpocznij konwersację wysyłając pierwszą wiadomość</p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, dateMessages]) => (
                  <div key={date} className="space-y-3">
                    {/* Date Header */}
                    <div className="flex items-center space-x-3">
                      <Separator className="flex-1" />
                      <Badge variant="secondary" className="text-xs">
                        {formatDateHeader(date)}
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    
                    {/* Messages for this date */}
                    {dateMessages.map((message) => (
                      <MessageBubbleAWS
                        key={message.id}
                        message={message}
                        isOwnMessage={message.sender_id === 'current-user-id'}
                      />
                    ))}
                  </div>
                ))
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <MessageInputAWS
                onSendMessage={sendMessage}
                disabled={sending}
                placeholder="Napisz wiadomość..."
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}






