'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  InitiateAuthCommand, 
  SignUpCommand, 
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  GlobalSignOutCommand
} from '@aws-sdk/client-cognito-identity-provider'
import { awsClients, AWS_CONFIG } from '@/lib/aws-config'

export interface AWSUser {
  id: string
  email: string
  name?: string
  company?: string
  role: 'client' | 'admin' | 'manager'
  isEmailVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: AWSUser | null
  isLoading: boolean
  error: string | null
}

export const useAWSAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  })

  // Check if user is already authenticated
  useEffect(() => {
    // Force dev user in development mode
    if (process.env.NODE_ENV === 'development') {
      const defaultUser = {
        id: 'dev-user-1',
        email: 'dev@ecm-digital.com',
        name: 'Tomasz Gnat',
        company: 'ECM Digital',
        role: 'client' as const,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      
      // Save to localStorage
      localStorage.setItem('dev_user', JSON.stringify(defaultUser))
      
      setAuthState({
        isAuthenticated: true,
        user: defaultUser,
        isLoading: false,
        error: null
      })
      return
    }

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('aws_access_token')
        if (token) {
          const user = await getCurrentUser(token)
          setAuthState({
            isAuthenticated: true,
            user,
            isLoading: false,
            error: null
          })
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('aws_access_token')
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null
        })
      }
    }

    if (isAWSConfigured()) {
      checkAuth()
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Sign In
  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: AWS_CONFIG.cognito.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
      const response = await awsClients.cognito.send(command)
      
      if (response.AuthenticationResult?.AccessToken) {
        localStorage.setItem('aws_access_token', response.AuthenticationResult.AccessToken)
        const rememberMePref = localStorage.getItem('aws_remember_me') === 'true'
        if (rememberMePref && response.AuthenticationResult.RefreshToken) {
          localStorage.setItem('aws_refresh_token', response.AuthenticationResult.RefreshToken)
        } else {
          localStorage.removeItem('aws_refresh_token')
        }
        
        const user = await getCurrentUser(response.AuthenticationResult.AccessToken)
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null
        })
        
        return { success: true, user }
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error: any) {
      const errorMessage = getCognitoErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Sign Up
  const signUp = useCallback(async (email: string, password: string, name: string, company?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const command = new SignUpCommand({
        ClientId: AWS_CONFIG.cognito.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name },
          ...(company ? [{ Name: 'custom:company', Value: company }] : []),
        ],
      })

      await awsClients.cognito.send(command)
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: true, message: 'Account created successfully. Please check your email for verification.' }
    } catch (error: any) {
      const errorMessage = getCognitoErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Confirm Sign Up
  const confirmSignUp = useCallback(async (email: string, code: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: AWS_CONFIG.cognito.clientId,
        Username: email,
        ConfirmationCode: code,
      })

      await awsClients.cognito.send(command)
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: true, message: 'Email verified successfully. You can now sign in.' }
    } catch (error: any) {
      const errorMessage = getCognitoErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Forgot Password
  const forgotPassword = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const command = new ForgotPasswordCommand({
        ClientId: AWS_CONFIG.cognito.clientId,
        Username: email,
      })

      await awsClients.cognito.send(command)
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: true, message: 'Password reset code sent to your email.' }
    } catch (error: any) {
      const errorMessage = getCognitoErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Confirm Forgot Password
  const confirmForgotPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: AWS_CONFIG.cognito.clientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      })

      await awsClients.cognito.send(command)
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: true, message: 'Password reset successfully. You can now sign in with your new password.' }
    } catch (error: any) {
      const errorMessage = getCognitoErrorMessage(error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      const token = localStorage.getItem('aws_access_token')
      if (token) {
        const command = new GlobalSignOutCommand({ AccessToken: token })
        await awsClients.cognito.send(command)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      localStorage.removeItem('aws_access_token')
      localStorage.removeItem('aws_refresh_token')
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      })
    }
  }, [])

  // Get current user info
  const getCurrentUser = useCallback(async (token: string): Promise<AWSUser> => {
    try {
      const command = new GetUserCommand({
        AccessToken: token,
      })

      const response = await awsClients.cognito.send(command)
      
      // Parse user attributes
      const attributes = response.UserAttributes || []
      const email = attributes.find(attr => attr.Name === 'email')?.Value || ''
      const name = attributes.find(attr => attr.Name === 'name')?.Value || ''
      const company = attributes.find(attr => attr.Name === 'custom:company')?.Value || ''
      const emailVerified = attributes.find(attr => attr.Name === 'email_verified')?.Value === 'true'
      
      return {
        id: response.Username || '',
        email,
        name,
        company,
        role: 'client', // Default role
        isEmailVerified: emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Get user error:', error)
      throw error
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...authState,
    signIn,
    signUp,
    confirmSignUp,
    forgotPassword,
    confirmForgotPassword,
    signOut,
    clearError,
  }
}

// Helper function to get user-friendly error messages
const getCognitoErrorMessage = (error: any): string => {
  if (error.name === 'NotAuthorizedException') {
    return 'Invalid email or password'
  } else if (error.name === 'UserNotConfirmedException') {
    return 'Please verify your email address'
  } else if (error.name === 'UserNotFoundException') {
    return 'User not found'
  } else if (error.name === 'UsernameExistsException') {
    return 'User already exists'
  } else if (error.name === 'CodeMismatchException') {
    return 'Invalid verification code'
  } else if (error.name === 'ExpiredCodeException') {
    return 'Verification code has expired'
  } else if (error.name === 'LimitExceededException') {
    return 'Too many attempts. Please try again later'
  } else {
    return error.message || 'An unexpected error occurred'
  }
}

// Helper function to check if AWS is configured
const isAWSConfigured = () => {
  return !!(
    AWS_CONFIG.cognito.userPoolId &&
    AWS_CONFIG.cognito.clientId &&
    AWS_CONFIG.cognito.identityPoolId
  )
}







