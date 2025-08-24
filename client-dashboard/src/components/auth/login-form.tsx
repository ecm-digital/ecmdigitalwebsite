'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAWSAuth } from '@/hooks/use-aws-auth'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [showSignUp, setShowSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const { signIn, signUp, confirmSignUp, forgotPassword, isLoading, error, clearError } = useAWSAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (showConfirmation) {
      // Handle Email Confirmation
      const result = await confirmSignUp(email, confirmationCode)
      if (result.success) {
        alert('Email potwierdzony! Możesz się teraz zalogować.')
        setShowConfirmation(false)
        setShowSignUp(false)
      }
    } else if (showSignUp) {
      // Handle Sign Up
      const result = await signUp(email, password, email.split('@')[0])
      if (result.success) {
        alert('Sprawdź email i wpisz kod weryfikacyjny!')
        setShowConfirmation(true)
      }
    } else if (showForgotPassword) {
      // Handle Forgot Password
      const result = await forgotPassword(email)
      if (result.success) {
        alert(result.message)
        setShowForgotPassword(false)
      }
    } else {
      // Handle Sign In
      const result = await signIn(email, password)
      if (result.success) {
        router.push('/dashboard')
      }
    }
  }

  const toggleMode = (mode: 'signin' | 'signup' | 'forgot') => {
    clearError()
    setShowSignUp(mode === 'signup')
    setShowForgotPassword(mode === 'forgot')
    setShowConfirmation(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-200">
          Adres email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="twoj@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      {showConfirmation && (
        <div className="space-y-2">
          <Label htmlFor="confirmationCode" className="text-slate-200">
            Kod weryfikacyjny
          </Label>
          <Input
            id="confirmationCode"
            type="text"
            placeholder="Wpisz kod z emaila"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400">
            Sprawdź email i wpisz kod weryfikacyjny
          </p>
        </div>
      )}
      
      {!showForgotPassword && !showConfirmation && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-200">
            Hasło
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
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
        {!showSignUp && !showForgotPassword && !showConfirmation && (
          <>
            <button
              type="button"
              onClick={() => toggleMode('signup')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Nie masz konta?
            </button>
            <button
              type="button"
              onClick={() => toggleMode('forgot')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Zapomniałeś hasła?
            </button>
          </>
        )}
        
        {showSignUp && (
          <button
            type="button"
            onClick={() => toggleMode('signin')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Masz już konto? Zaloguj się
          </button>
        )}
        
        {showForgotPassword && (
          <button
            type="button"
            onClick={() => toggleMode('signin')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Wróć do logowania
          </button>
        )}

        {showConfirmation && (
          <button
            type="button"
            onClick={() => toggleMode('signin')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Wróć do logowania
          </button>
        )}
      </div>

      {/* Demo Mode Info */}
      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-400 text-center">
          <strong>AWS Integration:</strong> Panel klienta zintegrowany z AWS Cognito, 
          DynamoDB, S3 i Lambda.
        </p>
      </div>
    </form>
  )
}