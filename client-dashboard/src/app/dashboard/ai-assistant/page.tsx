"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'status' | 'faq' | 'task' | 'contact';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Cześć! Jestem Twoim AI asystentem. Mogę pomóc Ci w sprawach związanych z projektem. Jak mogę Ci dzisiaj pomóc?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [projectStatus, setProjectStatus] = useState({
    name: 'E-commerce Platform',
    progress: 75,
    status: 'W trakcie',
    nextMilestone: '2025-02-15',
    team: ['Anna Kowalska', 'Piotr Wiśniewski']
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions: QuickAction[] = [
    {
      id: 'status',
      title: 'Status Projektu',
      description: 'Sprawdź postęp i status',
      icon: <CheckCircle className="w-5 h-5" />,
      action: () => handleQuickAction('status')
    },
    {
      id: 'faq',
      title: 'Częste Pytania',
      description: 'Odpowiedzi na popularne pytania',
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => handleQuickAction('faq')
    },
    {
      id: 'task',
      title: 'Moje Zadania',
      description: 'Co muszę przygotować',
      icon: <Clock className="w-5 h-5" />,
      action: () => handleQuickAction('task')
    },
    {
      id: 'contact',
      title: 'Kontakt Zespołu',
      description: 'Porozmawiaj z developerem',
      icon: <AlertCircle className="w-5 h-5" />,
      action: () => handleQuickAction('contact')
    }
  ];

  const handleQuickAction = (type: string) => {
    let content = '';
    switch (type) {
      case 'status':
        content = `Status Twojego projektu "${projectStatus.name}":\n\n📊 Postęp: ${projectStatus.progress}%\n🔄 Status: ${projectStatus.status}\n📅 Następny kamień milowy: ${projectStatus.nextMilestone}\n👥 Zespół: ${projectStatus.team.join(', ')}`;
        break;
      case 'faq':
        content = `Oto odpowiedzi na najczęstsze pytania:\n\n❓ Kiedy będzie gotowy?\n📅 Planowany termin: 2025-03-01\n\n❓ Co mogę zrobić, żeby przyspieszyć?\n✅ Przygotuj treści i materiały\n✅ Zatwierdź designy\n✅ Udziel feedbacku w ciągu 24h`;
        break;
      case 'task':
        content = `Twoje zadania do przygotowania:\n\n📝 Treści do sekcji "O nas"\n🖼️ Logo w wysokiej rozdzielczości\n📱 Zdjęcia produktów\n📋 Opisy kategorii\n\nWszystko możesz przesłać przez panel lub email.`;
        break;
      case 'contact':
        content = `Oto jak możesz skontaktować się z zespołem:\n\n📧 Email: team@ecmdigital.com\n📱 Slack: #projekt-${projectStatus.name}\n📅 Kalendarz: Umów spotkanie\n\nZespół odpowiada w ciągu 2-4 godzin w dni robocze.`;
        break;
    }
    
    addMessage(content, 'assistant', type as any);
  };

  const addMessage = (content: string, role: 'user' | 'assistant', type?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    addMessage(userMessage, 'user');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      addMessage(aiResponse, 'assistant');
      setLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('status') || lowerMessage.includes('postęp')) {
      return `Status Twojego projektu "${projectStatus.name}":\n\n📊 Postęp: ${projectStatus.progress}%\n🔄 Status: ${projectStatus.status}\n📅 Następny kamień milowy: ${projectStatus.nextMilestone}`;
    }
    
    if (lowerMessage.includes('kiedy') || lowerMessage.includes('termin')) {
      return `Planowany termin ukończenia projektu to 2025-03-01. Obecnie jesteśmy na ${projectStatus.progress}% realizacji.`;
    }
    
    if (lowerMessage.includes('zespół') || lowerMessage.includes('developer')) {
      return `Twój projekt obsługuje zespół:\n👥 ${projectStatus.team.join(', ')}\n\nMożesz skontaktować się z nimi przez email: team@ecmdigital.com`;
    }
    
    if (lowerMessage.includes('zadanie') || lowerMessage.includes('przygotować')) {
      return `Aby przyspieszyć projekt, przygotuj:\n📝 Treści do sekcji "O nas"\n🖼️ Logo w wysokiej rozdzielczości\n📱 Zdjęcia produktów\n\nWszystko możesz przesłać przez panel.`;
    }
    
    return `Dziękuję za wiadomość! Mogę pomóc Ci ze statusem projektu, zadaniami, FAQ lub kontaktem z zespołem. Użyj szybkich akcji lub zadaj konkretne pytanie.`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Asystent</h1>
            <p className="text-muted-foreground">Twój inteligentny pomocnik w zarządzaniu projektem</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Card 
              key={action.id} 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            Chat z AI Asystentem
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-500">AI pisze...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Zadaj pytanie o swój projekt..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Naciśnij Enter aby wysłać • Shift+Enter dla nowej linii
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}








