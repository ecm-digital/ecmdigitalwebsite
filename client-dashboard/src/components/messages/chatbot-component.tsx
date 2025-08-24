'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
import { useAuth } from '@/hooks/use-auth'
import { useLanguage } from '@/hooks/use-language'
import { useMessages } from '@/hooks/use-messages'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  isVoice?: boolean
}

interface ChatbotComponentProps {
  projectId?: string
  projectName?: string
}

declare global {
  interface Window {
    AWSChatbot?: any
    BedrockClient?: any
    AWS?: any
  }
}

export function ChatbotComponent({ projectId, projectName }: ChatbotComponentProps) {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { sendMessage, sendChatbotMessage } = useMessages(projectId || '')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [chatbot, setChatbot] = useState<any>(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize chatbot
  useEffect(() => {
    const initChatbot = async () => {
      try {
        // Load AWS SDK and chatbot script dynamically
        if (!window.AWS) {
          const awsScript = document.createElement('script')
          awsScript.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.1453.0.min.js'
          awsScript.async = true
          document.head.appendChild(awsScript)

          await new Promise((resolve) => {
            awsScript.onload = resolve
          })
        }

        // Load chatbot script
        if (!window.AWSChatbot) {
          const chatbotScript = document.createElement('script')
          chatbotScript.src = '/src/js/aws-chatbot.js'
          chatbotScript.async = true
          document.head.appendChild(chatbotScript)

          await new Promise((resolve) => {
            chatbotScript.onload = resolve
          })
        }

        // Initialize chatbot instance
        if (window.AWSChatbot) {
          const chatbotInstance = new window.AWSChatbot()
          setChatbot(chatbotInstance)

          // Add welcome message
          addMessage('Cześć! Jestem cyfrowym asystentem głosowym Tomasza Gnata - CEO ECM Digital. Mogę opowiedzieć Ci o naszych usługach, pomóc w wyborze rozwiązania lub umówić konsultację. Jak mogę Ci pomóc?', 'bot')
        }
      } catch (error) {
        console.error('Error initializing chatbot:', error)
        addMessage('Przepraszam, wystąpił błąd podczas inicjalizacji chatbota. Spróbuj odświeżyć stronę.', 'bot')
      }
    }

    initChatbot()

    // Load mute preference
    const savedMute = localStorage.getItem('chatbotMuted')
    if (savedMute) {
      setIsMuted(savedMute === 'true')
    }
  }, [])

  // Check speech capabilities
  useEffect(() => {
    const checkSpeechCapabilities = () => {
      // Check speech recognition
      const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
      setSpeechSupported(speechRecognitionSupported)

      // Check speech synthesis
      const speechSynthesisSupported = 'speechSynthesis' in window
      setSpeechSynthesisSupported(speechSynthesisSupported)

      console.log('🎤 Speech recognition supported:', speechRecognitionSupported)
      console.log('🔊 Speech synthesis supported:', speechSynthesisSupported)
    }

    checkSpeechCapabilities()
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'pl-PL'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        console.log('🎤 Speech recognition started')
      }
      recognitionRef.current.onend = () => {
        setIsListening(false)
        console.log('🎤 Speech recognition ended')
      }
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        console.log('🎤 Speech recognition result:', transcript)
        handleSendMessage(transcript, true)
      }
      recognitionRef.current.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error)
        setIsListening(false)

        // Show user-friendly error message
        let errorMessage = t('chatbot.errors.speechError')
        switch (event.error) {
          case 'no-speech':
            errorMessage = t('chatbot.errors.noSpeech')
            break
          case 'audio-capture':
            errorMessage = t('chatbot.errors.noMicrophone')
            break
          case 'not-allowed':
            errorMessage = t('chatbot.errors.microphoneBlocked')
            break
          case 'network':
            errorMessage = t('chatbot.errors.network')
            break
          default:
            errorMessage = `${t('chatbot.errors.speechError')}: ${event.error}`
        }

        addMessage(errorMessage, 'bot')
      }

      console.log('✅ Speech recognition initialized')
    } else {
      console.warn('⚠️ Speech recognition not supported in this browser')
    }
  }, [])

  const addMessage = (content: string, sender: 'user' | 'bot', isVoice: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      content,
      sender,
      timestamp: new Date(),
      isVoice
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = async (message?: string, isVoice: boolean = false) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend) return

    setInputMessage('')
    setIsProcessing(true)

    // Add user message to local state
    addMessage(messageToSend, 'user', isVoice)

    try {
      // Send user message to Supabase
      if (user && projectId) {
        await sendMessage(messageToSend)
      }

      // Get chatbot response
      let response = ''
      if (chatbot) {
        // Use the existing chatbot logic
        response = await simulateBedrockResponse(messageToSend)
      } else {
        // Fallback response
        response = generateFallbackResponse(messageToSend)
      }

      // Add bot response to local state
      addMessage(response, 'bot')

      // Send chatbot response to Supabase
      if (user && projectId) {
        await sendChatbotMessage(response, isVoice)
      }
    } catch (error) {
      console.error('Error getting chatbot response:', error)
      const errorMessage = 'Przepraszam, wystąpił błąd. Spróbuj ponownie.'
      addMessage(errorMessage, 'bot')
      if (user && projectId) {
        await sendChatbotMessage(errorMessage, false)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const simulateBedrockResponse = async (userMessage: string): Promise<string> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('usług') || lowerMessage.includes('oferta') || lowerMessage.includes('co robicie')) {
      return `Oferujemy kompleksowe usługi cyfrowe dla firm w każdym rozmiarze:

**Strony WWW** - od 3,500 PLN
  • Responsywne designy
  • SEO optimization
  • Integracje z systemami

🛒 **Sklepy Shopify** - od 8,000 PLN
  • Wysokie konwersje
  • Integracje płatności
  • Automatyzacja sprzedaży

📱 **Aplikacje Mobilne** - od 15,000 PLN
  • iOS i Android
  • Nowoczesne technologie
  • Skalowalne rozwiązania

🤖 **Asystenci AI** - od 12,000 PLN
  • Amazon Bedrock integration
  • Copilot Studio
  • Chatboty głosowe

⚡ **Automatyzacje** - od 5,000 PLN
  • n8n, Zapier, Opal
  • Procesy biznesowe
  • Integracje systemów

Która usługa najbardziej pasuje do Twoich potrzeb? Opowiedz mi o swoim projekcie!`
    }

    if (lowerMessage.includes('ceny') || lowerMessage.includes('koszt') || lowerMessage.includes('pakiety')) {
      return `Nasze ceny są indywidualne i zależą od złożoności projektu:

💰 **Strony WWW:** 3,500 - 15,000 PLN
  • Prosta strona firmowa: 3,500 PLN
  • Zaawansowana z e-commerce: 8,000 PLN
  • Portal korporacyjny: 15,000 PLN

🛒 **Sklepy Shopify:** 8,000 - 25,000 PLN
  • Podstawowy sklep: 8,000 PLN
  • Zaawansowany z automatyzacją: 15,000 PLN
  • Enterprise solution: 25,000 PLN

📱 **Aplikacje Mobilne:** 15,000 - 50,000 PLN
  • MVP: 15,000 PLN
  • Pełna aplikacja: 30,000 PLN
  • Enterprise app: 50,000 PLN

🤖 **Asystenci AI:** 12,000 - 40,000 PLN
  • Podstawowy chatbot: 12,000 PLN
  • Zaawansowany z Bedrock: 25,000 PLN
  • Enterprise AI solution: 40,000 PLN

Chcesz otrzymać dokładną wycenę? Opowiedz mi o swoim projekcie!`
    }

    if (lowerMessage.includes('konsultac') || lowerMessage.includes('spotkanie') || lowerMessage.includes('kontakt')) {
      return `Świetnie! Umówię Cię na bezpłatną konsultację z naszym zespołem ekspertów.

📅 **Dostępne terminy:** poniedziałek - piątek, 9:00 - 17:00
⏰ **Czas konsultacji:** 30-45 minut
💬 **Forma:** online (Teams/Zoom) lub stacjonarnie w Warszawie

📧 **Kontakt:** kontakt@ecmdigital.pl
📱 **Telefon:** +48 XXX XXX XXX

**Co przygotować na konsultację:**
1. Opis projektu/idei
2. Budżet (jeśli znany)
3. Deadline
4. Przykłady podobnych rozwiązań

Kiedy byłbyś dostępny? Podaj preferowany termin i sposób kontaktu!`
    }

    if (lowerMessage.includes('portfolio') || lowerMessage.includes('case') || lowerMessage.includes('projekty')) {
      return `Mamy bogate portfolio projektów w różnych branżach:

🏢 **Strony WWW:**
  • Firma transportowa - wzrost ruchu o 200%
  • Kancelaria prawna - profesjonalny design
  • Studio fitness - booking system

🛒 **Sklepy Shopify:**
  • Moda - konwersja +35%
  • Elektronika - automatyzacja sprzedaży
  • Książki - personalizacja rekomendacji

📱 **Aplikacje Mobilne:**
  • Startup fintech - 50,000+ użytkowników
  • Platforma edukacyjna - gamifikacja
  • App dla restauracji - delivery system

🤖 **Asystenci AI:**
  • Automatyzacja HR - 80% czasu oszczędności
  • Customer Support - 24/7 obsługa
  • Sales Assistant - +40% konwersji

Który projekt Cię najbardziej zainteresował? Mogę opowiedzieć więcej szczegółów!`
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('sztuczna inteligencja') || lowerMessage.includes('chatbot')) {
      return `AI to nasza specjalność! Tworzymy inteligentne rozwiązania które automatyzują i optymalizują Twoje procesy biznesowe.

🤖 **Asystenci AI na Amazon Bedrock:**
  • Claude 3 (Anthropic) - najlepsze zrozumienie kontekstu
  • Titan (Amazon) - integracja z AWS
  • Llama 2 (Meta) - open source, customizable
  • Cohere - specjalizacja w języku naturalnym

🔧 **Copilot Studio dla Microsoft 365:**
  • Integracja z Teams, SharePoint, Outlook
  • Custom knowledge base
  • Enterprise security

🎤 **Chatboty głosowe:**
  • Amazon Lex + Polly
  • Natural language processing
  • Multi-language support

**Przykłady zastosowań:**
• Automatyzacja obsługi klienta
• Analiza dokumentów i raportów
• Personalizacja treści marketingowych
• Predykcyjna analiza danych

Chcesz zobaczyć demo? Mogę pokazać jak AI może zoptymalizować Twoje procesy!`
    }

    // Default intelligent response
    return `Dziękuję za pytanie! Jestem cyfrowym asystentem Tomasza Gnata i jestem tutaj żeby pomóc Ci znaleźć najlepsze rozwiązanie cyfrowe dla Twojej firmy.

Mogę opowiedzieć o:
• Naszych usługach i technologiach
• Cenach i pakietach
• Portfolio i case studies
• Umówić konsultację

Co Cię najbardziej interesuje? Opowiedz mi o swoich potrzebach lub wybierz jedną z sugestii poniżej!`
  }

  const generateFallbackResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes('usług') || lowerInput.includes('oferta')) {
      return 'Oferujemy kompleksowe usługi: Strony WWW od 3,500 PLN, Sklepy Shopify od 8,000 PLN, Aplikacje Mobilne od 15,000 PLN, Asystenci AI, Automatyzacje. Która usługa Cię interesuje?'
    }

    if (lowerInput.includes('ceny') || lowerInput.includes('pakiety') || lowerInput.includes('koszt')) {
      return 'Nasze ceny zaczynają się od: Strony WWW - 3,500 PLN, Sklepy Shopify - 8,000 PLN, Aplikacje Mobilne - 15,000 PLN, Asystenci AI - 12,000 PLN. Chcesz dokładną wycenę?'
    }

    if (lowerInput.includes('konsultac') || lowerInput.includes('spotkanie')) {
      return 'Świetnie! Mogę umówić Cię na bezpłatną konsultację. Podaj swój email lub numer telefonu, a skontaktujemy się z Tobą w ciągu 24 godzin.'
    }

    if (lowerInput.includes('case') || lowerInput.includes('portfolio') || lowerInput.includes('projekty')) {
      return 'Mamy bogate portfolio: Strony WWW dla firm, Sklepy Shopify z wysoką konwersją, Aplikacje Mobilne, Asystenci AI. Chcesz zobaczyć konkretne przykłady?'
    }

    if (lowerInput.includes('ai') || lowerInput.includes('sztuczna inteligencja')) {
      return 'Specjalizujemy się w AI! Tworzymy asystentów na Amazon Bedrock, Copilot Studio, chatboty głosowe. AI może zautomatyzować Twoje procesy biznesowe.'
    }

    return 'Dziękuję za pytanie! Mogę opowiedzieć o naszych usługach, cenach, umówić konsultację lub pokazać portfolio. Co Cię najbardziej interesuje?'
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    localStorage.setItem('chatbotMuted', (!isMuted).toString())
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{t('chatbot.title')}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {projectName ? `${t('chatbot.subtitle')} - ${projectName}` : t('chatbot.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {t('chatbot.status.online')}
            </Badge>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={toggleMute}
                className="p-2"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" title={t('chatbot.buttons.unmute')} />
                ) : (
                  <Volume2 className="h-4 w-4" title={t('chatbot.buttons.mute')} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Messages */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('chatbot.welcome')}
              </h3>
              <p className="text-gray-500 mb-4">
                {t('chatbot.description')}
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <div>{t('chatbot.features.text')}</div>
                {speechSupported && (
                  <div>{t('chatbot.features.voiceInput')}</div>
                )}
                {speechSynthesisSupported && (
                  <div>{t('chatbot.features.voiceOutput')}</div>
                )}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === 'bot' && <Bot className="h-3 w-3" />}
                    {message.sender === 'user' && message.isVoice && <Mic className="h-3 w-3" />}
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t('chatbot.placeholder')}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isProcessing}
            className="flex-1"
          />

          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            disabled={isProcessing || !speechSupported}
            className="p-2"
            title={!speechSupported ? t('chatbot.errors.speechNotSupported') : isListening ? t('chatbot.buttons.voiceInput') : t('chatbot.buttons.voiceInput')}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          <Button
            onClick={() => handleSendMessage()}
            disabled={isProcessing || !inputMessage.trim()}
            size="sm"
            className="p-2"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isListening && (
          <div className="mt-2 text-center">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {t('chatbot.status.listening')}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  )
}
