'use client'

import { Message } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { useAuthStore } from '@/lib/stores/auth-store'
import { 
  Paperclip, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  File,
  ExternalLink
} from 'lucide-react'
import { formatFileSize, getFileIcon } from '@/lib/supabase/storage'

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

  const getAttachmentIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    } else if (mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const handleDownload = async (attachment: any) => {
    if (attachment.url) {
      // Open in new tab for download
      window.open(attachment.url, '_blank')
    }
  }

  const isImageFile = (mimeType: string) => {
    return mimeType.startsWith('image/')
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
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment: any, index: number) => (
                <div key={index}>
                  {/* Image Attachments - Show as preview */}
                  {isImageFile(attachment.type) && attachment.url ? (
                    <div className="relative group">
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="max-w-xs max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(attachment)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="mt-1">
                        <p className="text-xs opacity-75">{attachment.name}</p>
                        {attachment.size && (
                          <p className="text-xs opacity-60">{formatFileSize(attachment.size)}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Non-image Attachments - Show as file card */
                    <div 
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        isOwnMessage 
                          ? 'bg-blue-700 border-blue-600' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getAttachmentIcon(attachment.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {attachment.name || `Załącznik ${index + 1}`}
                        </p>
                        {attachment.size && (
                          <p className="text-xs opacity-75">
                            {formatFileSize(attachment.size)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        {attachment.url && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(attachment.url, '_blank')}
                              className={`h-8 w-8 p-0 ${
                                isOwnMessage 
                                  ? 'hover:bg-blue-600 text-white' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(attachment)}
                              className={`h-8 w-8 p-0 ${
                                isOwnMessage 
                                  ? 'hover:bg-blue-600 text-white' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
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