"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/hooks/use-language';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Zap,
  TrendingUp,
  Calendar,
  Users
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
  const { t } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: t('aiAssistant.welcome'),
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [projectStatus, setProjectStatus] = useState({
    name: t('aiAssistant.projectStatus.name'),
    progress: 75,
    status: t('aiAssistant.projectStatus.status'),
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

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'status',
      title: t('aiAssistant.quickActions.status'),
      description: t('aiAssistant.quickActions.statusDesc'),
      icon: <CheckCircle className="w-6 h-6" />,
      action: () => handleQuickAction('status')
    },
    {
      id: 'faq',
      title: t('aiAssistant.quickActions.faq'),
      description: t('aiAssistant.quickActions.faqDesc'),
      icon: <MessageCircle className="w-6 h-6" />,
      action: () => handleQuickAction('faq')
    },
    {
      id: 'task',
      title: t('aiAssistant.quickActions.task'),
      description: t('aiAssistant.quickActions.taskDesc'),
      icon: <Clock className="w-6 h-6" />,
      action: () => handleQuickAction('task')
    },
    {
      id: 'contact',
      title: t('aiAssistant.quickActions.contact'),
      description: t('aiAssistant.quickActions.contactDesc'),
      icon: <AlertCircle className="w-6 h-6" />,
      action: () => handleQuickAction('contact')
    }
  ], [t]);

  const handleQuickAction = useCallback((type: string) => {
    let content = '';
    switch (type) {
      case 'status':
        content = t('aiAssistant.responses.status');
        break;
      case 'faq':
        content = t('aiAssistant.responses.faq');
        break;
      case 'task':
        content = t('aiAssistant.responses.task');
        break;
      case 'contact':
        content = t('aiAssistant.responses.contact');
        break;
      default:
        content = t('aiAssistant.responses.status');
    }
    
    addMessage('assistant', content, type as any);
  }, [t]);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string, type?: 'status' | 'faq' | 'task' | 'contact') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    addMessage('user', userMessage);
    setInputValue('');
    setLoading(true);
    
    try {
      const response = await generateAIResponse(userMessage);
      addMessage('assistant', response);
    } catch (error) {
      addMessage('assistant', t('aiAssistant.messages.error'));
    } finally {
      setLoading(false);
    }
  }, [inputValue, addMessage, t]);

  const generateAIResponse = useCallback(async (message: string): Promise<string> => {
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('status') || lowerMessage.includes('postęp')) {
      return t('aiAssistant.responses.status');
    } else if (lowerMessage.includes('pytania') || lowerMessage.includes('faq')) {
      return t('aiAssistant.responses.faq');
    } else if (lowerMessage.includes('zadania') || lowerMessage.includes('task')) {
      return t('aiAssistant.responses.task');
    } else if (lowerMessage.includes('kontakt') || lowerMessage.includes('zespół')) {
      return t('aiAssistant.responses.contact');
    } else {
      return `Dziękuję za wiadomość: "${message}". Jak mogę Ci pomóc? Możesz użyć szybkich akcji powyżej lub zadać mi pytanie.`;
    }
  }, [t]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-xl">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
              {t('aiAssistant.title')}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t('aiAssistant.subtitle')}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickActions.map((action, index) => (
              <Card 
                key={action.id} 
                className="group hover:shadow-xl transition-shadow duration-200 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl transition-colors duration-200 ${
                      index === 0 ? 'bg-green-100 group-hover:bg-green-200' :
                      index === 1 ? 'bg-blue-100 group-hover:bg-blue-200' :
                      index === 2 ? 'bg-orange-100 group-hover:bg-orange-200' :
                      'bg-purple-100 group-hover:bg-purple-200'
                    }`}>
                      <div className={`${
                        index === 0 ? 'text-green-600' :
                        index === 1 ? 'text-blue-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-purple-600'
                      }`}>
                        {action.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800">{action.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Project Status Overview */}
          <Card className="mb-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 border-b border-white/20">
              <CardTitle className="flex items-center text-white">
                <CheckCircle className="w-6 h-6 text-green-300 mr-3" />
                Status Projektu
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-blue-100 text-sm font-medium mb-2">Nazwa Projektu</p>
                  <p className="text-white font-bold text-lg">{projectStatus.name}</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-100 text-sm font-medium mb-2">Postęp</p>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-24 bg-white/20 rounded-full h-3">
                      <div className="bg-green-400 h-3 rounded-full transition-all duration-500" style={{ width: `${projectStatus.progress}%` }}></div>
                    </div>
                    <span className="text-white font-bold text-lg">{projectStatus.progress}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-blue-100 text-sm font-medium mb-2">Status</p>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm">
                    W trakcie
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-blue-100 text-sm font-medium mb-2">Następny Milestone</p>
                  <p className="text-white font-bold text-lg">{projectStatus.nextMilestone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Chat Interface - Takes 3 columns */}
            <div className="xl:col-span-3">
              <Card className="h-[700px] flex flex-col bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
                  <CardTitle className="flex items-center text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    Chat z {t('aiAssistant.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="h-full p-6 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {message.role === 'assistant' && (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Bot className="w-4 h-4 text-white" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                <p className={`text-xs mt-2 ${
                                  message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                                }`}>
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 border-t border-slate-200/50 bg-white">
                  <div className="flex space-x-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('aiAssistant.messages.placeholder')}
                      className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!inputValue.trim() || isLoading}
                      className="px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 rounded-xl shadow-lg hover:shadow-lg transition-colors duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="space-y-6">
              {/* AI Features */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center text-slate-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    Funkcje AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-slate-700">Szybkie odpowiedzi</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Analiza projektów</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Automatyczne raporty</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center text-slate-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    Ostatnia Aktywność
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">Status projektu zaktualizowany</p>
                        <p className="text-xs text-slate-600">2 godziny temu</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">Nowa wiadomość od zespołu</p>
                        <p className="text-xs text-slate-600">1 dzień temu</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">Dokument dodany</p>
                        <p className="text-xs text-slate-600">2 dni temu</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Info */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center text-slate-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    Twój Zespół
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AK</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Anna Kowalska</p>
                        <p className="text-xs text-slate-600">Project Manager</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">PW</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Piotr Wiśniewski</p>
                        <p className="text-xs text-slate-600">Lead Developer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}