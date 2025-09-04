'use client'

import { Message, Attachment } from '@/hooks/use-messages-aws'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { 
  Download, 
  Image as ImageIcon, 
  FileText, 
  File,
  Bot
} from 'lucide-react'

interface MessageBubbleAWSProps {
  message: Message
  isOwnMessage?: boolean
}

export function MessageBubbleAWS({ message, isOwnMessage = false }: MessageBubbleAWSProps) {
  
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

  const getAttachmentIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    } else if (mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const handleDownload = async (attachment: Attachment) => {
    if (attachment.url) {
      // Open in new tab for download
      window.open(attachment.url, '_blank')
    }
  }

  const getSenderName = () => {
    if (message.is_bot) return 'AI Asystent'
    if (isOwnMessage) return 'Ty'
    return 'Użytkownik'
  }

  const getSenderAvatar = () => {
    if (message.is_bot) return '/bot-avatar.png' // TODO: Add bot avatar
    return undefined
  }

  return (
    <div className={`flex items-start space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={getSenderAvatar()} />
        <AvatarFallback className="text-xs">
          {message.is_bot ? <Bot className="h-4 w-4" /> : getInitials(getSenderName())}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`flex-1 max-w-xs sm:max-w-md ${isOwnMessage ? 'text-right' : ''}`}>
        {/* Sender Name & Time */}
        <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
          <span className="text-xs font-medium text-gray-900">
            {getSenderName()}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(message.created_at)}
          </span>
          {!message.read_at && !isOwnMessage && !message.is_bot && (
            <Badge variant="secondary" className="h-2 w-2 p-0 bg-blue-500"></Badge>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`rounded-lg px-3 py-2 ${
          message.is_bot
            ? 'bg-green-100 text-green-900 border border-green-200'
            : isOwnMessage 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                {getAttachmentIcon(attachment.mime_type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Message Status */}
        {isOwnMessage && (
          <div className="flex items-center justify-end space-x-1 mt-1">
            <span className="text-xs text-gray-500">
              {message.read_at ? 'Przeczytane' : 'Wysłane'}
            </span>
          </div>
        )}

        {/* Bot Indicator */}
        {message.is_bot && (
          <div className="flex items-center justify-start space-x-1 mt-1">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              AI Asystent
            </Badge>
            {message.is_voice && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                Głos
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}











