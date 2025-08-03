'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useAuth } from '@/hooks/use-auth'
import { useLanguage } from '@/hooks/use-language'
import { 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Calendar,
  Users,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react'

type LoginFormData = {
  email: string
  password: string
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const loginSchema = z.object({
    email: z.string().email(t('login.emailError') || 'Invalid email address'),
    password: z.string().min(6, t('login.passwordError') || 'Password must be at least 6 characters'),
  })

  const features = [
    {
      icon: FolderOpen,
      title: t('login.features.projectManagement.title'),
      description: t('login.features.projectManagement.description')
    },
    {
      icon: MessageSquare,
      title: t('login.features.communication.title'),
      description: t('login.features.communication.description')
    },
    {
      icon: FileText,
      title: t('login.features.documents.title'),
      description: t('login.features.documents.description')
    },
    {
      icon: CreditCard,
      title: t('login.features.invoices.title'),
      description: t('login.features.invoices.description')
    },
    {
      icon: BarChart3,
      title: t('login.features.analytics.title'),
      description: t('login.features.analytics.description')
    },
    {
      icon: Calendar,
      title: t('login.features.calendar.title'),
      description: t('login.features.calendar.description')
    }
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(data.email, data.password)
      
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Wystąpił nieoczekiwany błąd')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Left Side - Features Preview */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-12">
          <div className="max-w-lg">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                {t('login.title')}
                <span className="block text-blue-400">{t('login.subtitle')}</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                {t('login.description')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <span>{t('login.security.secure')}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <span>{t('login.security.gdpr')}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="flex-shrink-0">
                  <Zap className="h-5 w-5 text-yellow-400" />
                </div>
                <span>{t('login.security.realtime')}</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                    <div className="flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Language Switcher */}
            <div className="flex justify-end mb-6">
              <LanguageSwitcher />
            </div>
            
            <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
              <CardHeader className="space-y-1 text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  {t('login.loginButton')}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {t('login.loginDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">{t('login.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('login.emailPlaceholder')}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      {...register('email')}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200">{t('login.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('login.passwordPlaceholder')}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      {...register('password')}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>{t('login.loggingIn')}</span>
                      </div>
                    ) : (
                      t('login.loginButton')
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    {t('login.noAccount')}{' '}
                    <button
                      onClick={() => router.push('/auth/register')}
                      className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {t('login.contactUs')}
                    </button>
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-xs text-slate-500 text-center">
                    {t('login.secureLogin')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}