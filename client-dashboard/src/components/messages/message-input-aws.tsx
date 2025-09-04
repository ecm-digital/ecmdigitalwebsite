'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/ui/file-upload'
import { Attachment } from '@/hooks/use-messages-aws'
import { 
  Send, 
  Paperclip, 
  X,
  Loader2
} from 'lucide-react'

interface MessageInputAWSProps {
  onSendMessage: (content: string, attachments?: Attachment[]) => Promise<any>
  disabled?: boolean
  placeholder?: string
}

export function MessageInputAWS({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Napisz wiadomość..." 
}: MessageInputAWSProps) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() && attachments.length === 0) return
    if (sending) return

    setSending(true)
    
    try {
      let attachmentData: Attachment[] = []

      // Process attachments if any
      if (attachments.length > 0) {
        // TODO: Implement AWS S3 upload
        // For now, create placeholder attachment data
        attachmentData = attachments.map((file, index) => ({
          id: index.toString(),
          name: file.name,
          size: file.size,
          mime_type: file.type,
          url: URL.createObjectURL(file) // Temporary local URL
        }))
      }

      const result = await onSendMessage(message, attachmentData)
      
      if (result?.success) {
        setMessage('')
        setAttachments([])
        setShowFileUpload(false)
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleFilesSelected = (files: File[]) => {
    setAttachments(files)
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-3">
      {/* File Upload Section */}
      {showFileUpload && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Załączniki</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFileUpload}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            maxFiles={5}
            maxSize={5 * 1024 * 1024} // 5MB
            acceptedTypes={[
              'image/*',
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'text/plain'
            ]}
          />
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 space-y-2">
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="min-h-[60px] max-h-[200px] resize-none"
            style={{
              height: 'auto',
              minHeight: '60px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 200) + 'px'
            }}
          />

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <span className="text-blue-500">({formatFileSize(file.size)})</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="h-5 w-5 p-0 hover:bg-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* File Upload Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleFileUpload}
            disabled={disabled || sending}
            className="h-10 w-10 p-0"
            title="Dodaj załączniki"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={disabled || sending || (!message.trim() && attachments.length === 0)}
            className="h-10 px-4"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Wysyłanie...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Wyślij
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}











