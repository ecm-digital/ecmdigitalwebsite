'use client'

import { useState } from 'react'
import { FileUpload } from './file-upload'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { uploadMultipleFiles, STORAGE_BUCKETS } from '@/lib/supabase/storage'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export function FileUploadTest() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadResults, setUploadResults] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files)
    setUploadResults([]) // Clear previous results
  }

  const handleUpload = async (files: File[]) => {
    setIsUploading(true)
    setUploadResults([])

    try {
      const result = await uploadMultipleFiles(
        files,
        STORAGE_BUCKETS.ATTACHMENTS,
        (progress, fileName) => {
          console.log(`Upload progress for ${fileName}: ${progress}%`)
        }
      )

      const results = [
        ...result.successful.map(item => ({
          fileName: item.file.name,
          status: 'success',
          url: item.url,
          size: item.file.size
        })),
        ...result.failed.map(item => ({
          fileName: item.file.name,
          status: 'error',
          error: item.error.message
        }))
      ]

      setUploadResults(results)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Upload Plików</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            onUpload={handleUpload}
            maxFiles={5}
            maxSize={50 * 1024 * 1024} // 50MB
            disabled={isUploading}
          />
        </CardContent>
      </Card>

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Wyniki Upload'u</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    
                    <div>
                      <p className="font-medium">{result.fileName}</p>
                      {result.status === 'success' && result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Otwórz plik
                        </a>
                      )}
                      {result.status === 'error' && (
                        <p className="text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={result.status === 'success' ? 'default' : 'destructive'}
                  >
                    {result.status === 'success' ? 'Sukces' : 'Błąd'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isUploading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Przesyłanie plików...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}