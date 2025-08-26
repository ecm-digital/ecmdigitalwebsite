'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAWSAuth } from '@/hooks/use-aws-auth'
import { apiClient } from '@/hooks/use-api'
import { useRouter } from 'next/navigation'

type AuthMode = 'signin' | 'signup' | 'forgot' | 'confirm'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [mode, setMode] = useState<AuthMode>('signin')
  
  const showSignUp = mode === 'signup'
  const showForgotPassword = mode === 'forgot'
  const showConfirmation = mode === 'confirm'

  const { signIn, signUp, confirmSignUp, forgotPassword, isLoading, error, clearError } = useAWSAuth()
  const router = useRouter()

  const heading = showSignUp ? 'Zarejestruj się' : showForgotPassword ? 'Resetuj hasło' : showConfirmation ? 'Potwierdź email' : 'Zaloguj się'
  const sub = showSignUp
    ? 'Utwórz konto, aby uzyskać dostęp do panelu'
    : showForgotPassword
    ? 'Wpisz email, aby zresetować hasło'
    : showConfirmation
    ? 'Wpisz kod, który wysłaliśmy na Twój email'
    : 'Wprowadź swoje dane, aby uzyskać dostęp do panelu'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (showConfirmation) {
      const result = await confirmSignUp(email, confirmationCode)
      if (result.success) {
        await apiClient.verifyUser({ email, name: `${firstName} ${lastName}`.trim(), firstName, lastName, company: company || undefined } as any)
        alert('Email potwierdzony! Możesz się teraz zalogować.')
        setMode('signin')
      }
    } else if (showSignUp) {
      const fullName = `${firstName} ${lastName}`.trim() || email.split('@')[0]
      const result = await signUp(email, password, fullName, company || undefined)
      if (result.success) {
        alert('Sprawdź email i wpisz kod weryfikacyjny!')
        setMode('confirm')
      }
    } else if (showForgotPassword) {
      const result = await forgotPassword(email)
      if (result.success) {
        alert(result.message)
        setMode('signin')
      }
    } else {
      const result = await signIn(email, password)
      if (result.success) {
        router.push('/dashboard')
      }
    }
  }

  const toggleMode = (m: AuthMode) => {
    clearError()
    setMode(m)
  }

  return (
    <div>
              <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">{heading}</h2>
        <p className="text-sm text-gray-300 mt-1">{sub}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {showSignUp && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-200">Imię</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-200">Nazwisko</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company" className="text-gray-200">Firma (opcjonalnie)</Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="ECM Digital Sp. z o.o." className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-200">
            Adres email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="twoj@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {showConfirmation && (
          <div className="space-y-2">
            <Label htmlFor="confirmationCode" className="text-gray-200">
              Kod weryfikacyjny
            </Label>
            <Input
              id="confirmationCode"
              type="text"
              placeholder="Wpisz kod z emaila"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">
              Sprawdź email i wpisz kod weryfikacyjny
            </p>
          </div>
        )}
        
        {!showForgotPassword && !showConfirmation && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">
              Hasło
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Przetwarzanie...' : 
           showConfirmation ? 'Potwierdź email' :
           showSignUp ? 'Zarejestruj się' :
           showForgotPassword ? 'Wyślij kod resetowania' :
           'Zaloguj się'}
        </Button>

        <div className="flex justify-between text-sm">
          {mode === 'signin' && (
            <>
              <button
                type="button"
                onClick={() => toggleMode('signup')}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Nie masz konta?
              </button>
              <button
                type="button"
                onClick={() => toggleMode('forgot')}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Zapomniałeś hasła?
              </button>
            </>
          )}

          {mode === 'signup' && (
            <button
              type="button"
              onClick={() => toggleMode('signin')}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Masz już konto? Zaloguj się
            </button>
          )}

          {(mode === 'forgot' || mode === 'confirm') && (
            <button
              type="button"
              onClick={() => toggleMode('signin')}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Wróć do logowania
            </button>
          )}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-400 text-center">
            <strong>AWS Integration:</strong> Panel klienta zintegrowany z AWS Cognito, 
            DynamoDB, S3 i Lambda.
          </p>
        </div>
      </form>
    </div>
  )
}