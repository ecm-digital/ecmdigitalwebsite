'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { MessageThreadAWS } from '@/components/messages/message-thread-aws'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Plus,
  Search,
  Bot,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function MessagesPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('demo-project')

  // Mock projects data
  const projects = [
    { id: 'demo-project', name: 'Demo Projekt', status: 'active', unread: 3 },
    { id: 'project-1', name: 'Strona WWW', status: 'completed', unread: 0 },
    { id: 'project-2', name: 'Sklep Online', status: 'in-progress', unread: 1 }
  ]

  const totalMessages = 24
  const unreadMessages = projects.reduce((sum, p) => sum + p.unread, 0)
  const activeProjects = projects.filter(p => p.status === 'active').length

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-3xl p-8 lg:p-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Komunikacja Real-time
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Wiadomości
                </h1>
                <p className="text-xl text-green-100 mb-6 max-w-2xl">
                  Komunikacja z zespołem ECM Digital w czasie rzeczywistym
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-white/80 text-sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Wszystkich: {totalMessages}
                  </div>
                  <div className="flex items-center text-white/80 text-sm">
                    <Bot className="h-4 w-4 mr-2" />
                    Nieprzeczytanych: {unreadMessages}
                  </div>
                  <div className="flex items-center text-white/80 text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    Aktywnych projektów: {activeProjects}
                  </div>
                </div>
              </div>
              <div className="hidden lg:block mt-8 lg:mt-0">
                <Button className="btn-primary-modern text-lg px-8 py-4 bg-green-600 hover:bg-green-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Nowa Wiadomość
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm">Wszystkich Wiadomości</p>
                <p className="text-3xl font-bold text-green-900">{totalMessages}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <MessageSquare className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium text-sm">Nieprzeczytanych</p>
                <p className="text-3xl font-bold text-orange-900">{unreadMessages}</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-xl">
                <Bot className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">Aktywnych Projektów</p>
                <p className="text-3xl font-bold text-blue-900">{activeProjects}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Projects Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Projekty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects.map((project) => (
                  <Button
                    key={project.id}
                    variant={selectedProjectId === project.id ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-4 rounded-xl transition-all duration-200 ${
                      selectedProjectId === project.id 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'hover:bg-white hover:shadow-md'
                    }`}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`p-2 rounded-lg ${
                        selectedProjectId === project.id 
                          ? 'bg-white/20' 
                          : 'bg-slate-200'
                      }`}>
                        <MessageSquare className={`h-4 w-4 ${
                          selectedProjectId === project.id 
                            ? 'text-white' 
                            : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium truncate">{project.name}</div>
                        <div className="text-xs opacity-80">
                          {project.status === 'active' ? 'Aktywny' : 
                           project.status === 'completed' ? 'Zakończony' : 'W trakcie'}
                        </div>
                      </div>
                      {project.unread > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`${
                            selectedProjectId === project.id 
                              ? 'bg-white/20 text-white border-white/30' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          } border font-medium px-2 py-1 rounded-full`}
                        >
                          {project.unread}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Messages Area */}
          <div className="lg:col-span-3">
            <MessageThreadAWS projectId={selectedProjectId} />
          </div>
        </div>

        {/* Mobile New Message Button */}
        <div className="lg:hidden">
          <Button className="btn-primary-modern w-full text-lg py-4 bg-green-600 hover:bg-green-700">
            <Plus className="h-5 w-5 mr-2" />
            Nowa Wiadomość
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}