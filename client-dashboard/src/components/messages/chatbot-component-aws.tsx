'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Loader2
} from 'lucide-react'
import { useAWSAuth } from '@/hooks/use-aws-auth'
import { useMessagesAWS } from '@/hooks/use-messages-aws'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  isVoice?: boolean
}

interface ChatbotComponentAWSProps {
  projectId?: string
}

export function ChatbotComponentAWS({ projectId }: ChatbotComponentAWSProps) {
  const { user } = useAWSAuth()
  const { sendChatbotMessage } = useMessagesAWS(projectId || '')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check speech support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true)
    }
    if ('speechSynthesis' in window) {
      setSpeechSynthesisSupported(true)
    }

    // Add welcome message
    addMessage('Cześć! Jestem cyfrowym asystentem głosowym Tomasza Gnata - CEO ECM Digital. Mogę opowiedzieć Ci o naszych usługach, pomóc w wyborze rozwiązania lub umówić konsultację. Jak mogę Ci pomóc?', 'bot')
  }, [])

  const addMessage = (content: string, sender: 'user' | 'bot', isVoice: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      isVoice
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    addMessage(userMessage, 'user')

    setIsProcessing(true)

    try {
      // TODO: Implement AWS Bedrock integration
      // For now, simulate bot response
      setTimeout(() => {
        const botResponse = `Dziękuję za wiadomość: "${userMessage}". Jestem w trakcie integracji z AWS Bedrock. Wkrótce będę mógł odpowiadać na Twoje pytania o usługi ECM Digital.`
        addMessage(botResponse, 'bot')
        setIsProcessing(false)
      }, 1000)

      // Send message to project if projectId is provided
      if (projectId) {
        await sendChatbotMessage(userMessage, false)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      addMessage('Przepraszam, wystąpił błąd podczas wysyłania wiadomości.', 'bot')
      setIsProcessing(false)
    }
  }

  const handleVoiceInput = () => {
    if (!speechSupported) {
      addMessage('Rozpoznawanie mowy nie jest obsługiwane w Twojej przeglądarce.', 'bot')
      return
    }

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'pl-PL'

      recognition.onstart = () => {
        setIsListening(true)
        addMessage('Słucham...', 'bot', true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        addMessage(transcript, 'user', true)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        addMessage('Błąd rozpoznawania mowy. Spróbuj ponownie.', 'bot')
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
      recognitionRef.current = recognition
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      addMessage('Nie udało się uruchomić rozpoznawania mowy.', 'bot')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const speakMessage = (message: string) => {
    if (isMuted || !speechSynthesisSupported) return

    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = 'pl-PL'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bot className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Asystent ECM Digital</CardTitle>
              <p className="text-sm text-gray-500">
                Cyfrowy asystent głosowy - pomoc i konsultacje
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {speechSupported && (
              <Button
                variant={isListening ? "default" : "outline"}
                size="sm"
                onClick={handleVoiceInput}
                className="flex items-center space-x-2"
                title={isListening ? 'Zatrzymaj nasłuchiwanie' : 'Rozpocznij nasłuchiwanie'}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span>Mikrofon</span>
                  </>
                )}
              </Button>
            )}
            
            {speechSynthesisSupported && (
              <Button
                variant={isMuted ? "outline" : "default"}
                size="sm"
                onClick={toggleMute}
                className="flex items-center space-x-2"
                title={isMuted ? 'Włącz dźwięk' : 'Wyłącz dźwięk'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span>Dźwięk</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>Dźwięk</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Rozpocznij rozmowę</p>
                <p className="text-sm">Zadaj pytanie lub użyj mikrofonu</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {message.sender === 'bot' && <Bot className="h-4 w-4" />}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    {message.isVoice && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Głos
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Napisz wiadomość lub użyj mikrofonu..."
                disabled={isProcessing}
                className="flex-1"
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing}
                className="px-4"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Przetwarzanie...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Wyślij
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}







