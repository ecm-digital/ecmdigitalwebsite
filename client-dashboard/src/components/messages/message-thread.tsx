'use client'

import { useEffect, useRef, useState } from 'react'
import { useMessages } from '@/hooks/use-messages'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import { ChatbotComponent } from './chatbot-component'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  MessageSquare,
  Bot,
  Users,
  Clock,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface MessageThreadProps {
  projectId: string
  projectName: string
}

export function MessageThread({ projectId, projectName }: MessageThreadProps) {
  const {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    unreadCount
  } = useMessages(projectId)

  const [isChatbotMode, setIsChatbotMode] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    if (messages.length > 0 && unreadCount > 0) {
      const unreadMessageIds = messages
        .filter(msg => !msg.read_at && msg.sender_id !== messages[0]?.sender_id)
        .map(msg => msg.id)
      
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds)
      }
    }
  }, [messages, unreadCount, markAsRead])

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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isChatbotMode ? (
              <Bot className="h-5 w-5 text-blue-600" />
            ) : (
              <MessageSquare className="h-5 w-5 text-blue-600" />
            )}
            <div>
              <CardTitle className="text-lg">{projectName}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {isChatbotMode
                  ? 'AI Asystent ECM Digital - pomoc i konsultacje'
                  : 'Komunikacja z zespołem ECM Digital'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Mode Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChatbotMode(!isChatbotMode)}
              className="flex items-center space-x-2"
            >
              {isChatbotMode ? (
                <>
                  <MessageSquare className="h-4 w-4" />
                  <span>{t('chatbot.buttons.messages')}</span>
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  <span>{t('chatbot.buttons.aiAssistant')}</span>
                </>
              )}
            </Button>

            {!isChatbotMode && (
              <>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {unreadCount} nowych
                  </Badge>
                )}
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>2</span>
                </div>
              </>
            )}

            {isChatbotMode && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Content */}
      <CardContent className="flex-1 overflow-hidden p-0">
        {isChatbotMode ? (
          // Chatbot Mode
          <ChatbotComponent
            projectId={projectId}
            projectName={projectName}
          />
        ) : (
          // Regular Messages Mode
          <div
            ref={messagesContainerRef}
            className="h-full overflow-y-auto p-4 space-y-4"
          >
            {Object.keys(groupedMessages).length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Rozpocznij rozmowę
                </h3>
                <p className="text-gray-500 mb-4">
                  Napisz pierwszą wiadomość do zespołu ECM Digital
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsChatbotMode(true)}
                  className="flex items-center space-x-2"
                >
                  <Bot className="h-4 w-4" />
                  <span>{t('chatbot.buttons.aiAssistant')}</span>
                </Button>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, dayMessages]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-gray-600">
                        {formatDateHeader(date)}
                      </span>
                    </div>
                  </div>

                  {/* Messages for this date */}
                  <div className="space-y-4">
                    {dayMessages.map((message, index) => {
                      const prevMessage = dayMessages[index - 1]
                      const showAvatar = !prevMessage ||
                        prevMessage.sender_id !== message.sender_id ||
                        new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() > 5 * 60 * 1000 // 5 minutes

                      return (
                        <div key={message.id} className={showAvatar ? '' : 'ml-11'}>
                          <MessageBubble message={message} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      {/* Message Input - Only show in regular message mode */}
      {!isChatbotMode && (
        <MessageInput
          onSendMessage={sendMessage}
          disabled={sending}
          placeholder={`Napisz wiadomość do zespołu ${projectName}...`}
        />
      )}
    </Card>
  )
}