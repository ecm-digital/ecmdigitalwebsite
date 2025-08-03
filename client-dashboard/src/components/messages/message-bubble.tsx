'use client'

import { Message } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Paperclip, Download } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuthStore()
  const isOwnMessage = message.sender_id === user?.id
  
  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm')
    } else if (diffInHours < 168) { // 7 days
      return format(date, 'EEE HH:mm', { locale: pl })
    } else {
      return format(date, 'dd MMM HH:mm', { locale: pl })
    }
  }

  return (
    <div className={`flex items-start space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.sender?.avatar_url} />
        <AvatarFallback className="text-xs">
          {getInitials(message.sender?.contact_person || message.sender?.company_name)}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`flex-1 max-w-xs sm:max-w-md ${isOwnMessage ? 'text-right' : ''}`}>
        {/* Sender Name & Time */}
        <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
          <span className="text-xs font-medium text-gray-900">
            {isOwnMessage ? 'Ty' : (message.sender?.contact_person || message.sender?.company_name || 'Użytkownik')}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(message.created_at)}
          </span>
          {!message.read_at && !isOwnMessage && (
            <Badge variant="secondary" className="h-2 w-2 p-0 bg-blue-500"></Badge>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`rounded-lg px-3 py-2 ${
          isOwnMessage 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment: any, index: number) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-2 p-2 rounded ${
                    isOwnMessage ? 'bg-blue-700' : 'bg-gray-200'
                  }`}
                >
                  <Paperclip className="h-3 w-3" />
                  <span className="text-xs truncate flex-1">
                    {attachment.name || `Załącznik ${index + 1}`}
                  </span>
                  <button className="hover:opacity-70">
                    <Download className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Read Status */}
        {isOwnMessage && (
          <div className="mt-1 text-right">
            <span className="text-xs text-gray-400">
              {message.read_at ? 'Przeczytane' : 'Wysłane'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}