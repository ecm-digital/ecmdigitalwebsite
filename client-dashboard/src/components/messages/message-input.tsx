'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/ui/file-upload'
import { 
  Send, 
  Paperclip, 
  Smile, 
  Loader2,
  X,
  Upload
} from 'lucide-react'
import { uploadMultipleFiles, STORAGE_BUCKETS, formatFileSize } from '@/lib/supabase/storage'

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: any[]) => Promise<any>
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Napisz wiadomość..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() && attachments.length === 0) return
    if (sending) return

    setSending(true)
    
    try {
      let attachmentData: any[] = []

      // Upload attachments if any
      if (attachments.length > 0) {
        const uploadResult = await uploadMultipleFiles(
          attachments,
          STORAGE_BUCKETS.ATTACHMENTS,
          (progress, fileName) => {
            setUploadProgress(prev => ({ ...prev, [fileName]: progress }))
          }
        )

        // Process successful uploads
        attachmentData = uploadResult.successful.map(({ file, url }) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: url
        }))

        // Log failed uploads
        if (uploadResult.failed.length > 0) {
          console.error('Failed uploads:', uploadResult.failed)
          // TODO: Show error toast for failed uploads
        }
      }

      const result = await onSendMessage(message, attachmentData)
      
      if (result?.success) {
        setMessage('')
        setAttachments([])
        setUploadProgress({})
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

  const handleFileUpload = async (files: File[]) => {
    // Files will be uploaded when message is sent
    // This is just for the FileUpload component interface
    return Promise.resolve()
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  return (
    <div className="border-t bg-white">
      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Dodaj załączniki</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileUpload(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <FileUpload
            onFilesSelected={handleFilesSelected}
            maxFiles={5}
            maxSize={50 * 1024 * 1024} // 50MB
            disabled={sending}
            className="max-w-md"
          />
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Załączniki ({attachments.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAttachments([])}
              className="text-xs"
            >
              Usuń wszystkie
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-2 text-sm"
              >
                <Paperclip className="h-4 w-4 text-gray-500" />
                <div className="flex flex-col">
                  <span className="truncate max-w-32 font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                </div>
                {uploadProgress[file.name] && (
                  <div className="text-xs text-blue-600">
                    {Math.round(uploadProgress[file.name])}%
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={sending}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled || sending}
              className="min-h-[40px] max-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              rows={1}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            {/* File Upload Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFileUpload(!showFileUpload)}
              disabled={disabled || sending}
              className={`h-10 w-10 p-0 ${showFileUpload ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Emoji Button (placeholder) */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || sending}
              className="h-10 w-10 p-0"
            >
              <Smile className="h-4 w-4" />
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={disabled || sending || (!message.trim() && attachments.length === 0)}
              className="h-10 w-10 p-0"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}