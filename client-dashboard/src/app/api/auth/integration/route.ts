import { NextRequest, NextResponse } from 'next/server'
import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'eu-west-1',
})

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-west-1',
})

const USER_POOL_ID = (process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '').trim()
const CLIENT_ID = (process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '').trim()

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'register':
        return await handleRegister(data)
      case 'confirm':
        return await handleConfirm(data)
      case 'login':
        return await handleLogin(data)
      case 'resend':
        return await handleResend(data)
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Integration API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleRegister(data: any) {
  try {
    const { firstName, lastName, company, email, password } = data

    // Sign up with Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: `${firstName} ${lastName}`.trim(),
        },
        {
          Name: 'given_name',
          Value: firstName,
        },
        {
          Name: 'family_name',
          Value: lastName,
        },
        company ? {
          Name: 'custom:company',
          Value: company,
        } : null,
      ].filter(Boolean),
    })

    const signUpResult = await cognitoClient.send(signUpCommand)

    // Store additional user data in DynamoDB
    const putItemCommand = new PutItemCommand({
      TableName: 'ecm-users',
      Item: {
        userId: { S: signUpResult.UserSub! },
        email: { S: email },
        firstName: { S: firstName },
        lastName: { S: lastName },
        company: company ? { S: company } : { NULL: true },
        createdAt: { S: new Date().toISOString() },
        status: { S: 'pending_confirmation' },
      },
    })

    await dynamoClient.send(putItemCommand)

    // Generate redirect URL for main site
    const redirectUrl = new URL(request.headers.get('referer') || 'http://localhost:3000')
    redirectUrl.searchParams.set('action', 'registered')
    redirectUrl.searchParams.set('email', email)

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please check your email for confirmation code.',
      redirectUrl: redirectUrl.toString(),
      userSub: signUpResult.UserSub,
    })

  } catch (error: any) {
    console.error('Registration error:', error)

    let errorMessage = 'Registration failed'
    if (error.name === 'UsernameExistsException') {
      errorMessage = 'User with this email already exists'
    } else if (error.name === 'InvalidPasswordException') {
      errorMessage = 'Password does not meet requirements'
    } else if (error.name === 'InvalidParameterException') {
      errorMessage = 'Invalid email format'
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}

async function handleConfirm(data: any) {
  try {
    const { email, code } = data

    const confirmCommand = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    })

    await cognitoClient.send(confirmCommand)

    // Update user status in DynamoDB
    const putItemCommand = new PutItemCommand({
      TableName: 'ecm-users',
      Item: {
        email: { S: email },
        status: { S: 'confirmed' },
        confirmedAt: { S: new Date().toISOString() },
      },
      // Use email as key for update
      ConditionExpression: 'attribute_exists(email)',
    })

    await dynamoClient.send(putItemCommand)

    const redirectUrl = new URL(request.headers.get('referer') || 'http://localhost:3000')
    redirectUrl.searchParams.set('action', 'confirmed')
    redirectUrl.searchParams.set('email', email)

    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully. You can now log in.',
      redirectUrl: redirectUrl.toString(),
    })

  } catch (error: any) {
    console.error('Confirmation error:', error)

    let errorMessage = 'Confirmation failed'
    if (error.name === 'CodeMismatchException') {
      errorMessage = 'Invalid confirmation code'
    } else if (error.name === 'ExpiredCodeException') {
      errorMessage = 'Confirmation code has expired'
    } else if (error.name === 'NotAuthorizedException') {
      errorMessage = 'User is already confirmed'
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}

async function handleLogin(data: any) {
  try {
    const { email, password, rememberMe } = data

    const authCommand = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    })

    const authResult = await cognitoClient.send(authCommand)

    // Get user attributes
    const userAttributes = authResult.AuthenticationResult?.IdToken ? JSON.parse(
      Buffer.from(authResult.AuthenticationResult.IdToken.split('.')[1], 'base64').toString()
    ) : null

    const userData = {
      email: userAttributes?.email || email,
      name: userAttributes?.name || '',
      sub: userAttributes?.sub || '',
      token: authResult.AuthenticationResult?.AccessToken || '',
      refreshToken: authResult.AuthenticationResult?.RefreshToken || '',
    }

    // Generate redirect URL with user data
    const redirectUrl = new URL(request.headers.get('referer') || 'http://localhost:3000')
    redirectUrl.searchParams.set('action', 'login_success')
    redirectUrl.searchParams.set('token', userData.token)
    redirectUrl.searchParams.set('user', encodeURIComponent(JSON.stringify({
      email: userData.email,
      name: userData.name,
      sub: userData.sub,
    })))

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      redirectUrl: redirectUrl.toString(),
    })

  } catch (error: any) {
    console.error('Login error:', error)

    let errorMessage = 'Login failed'
    if (error.name === 'NotAuthorizedException') {
      errorMessage = 'Invalid email or password'
    } else if (error.name === 'UserNotConfirmedException') {
      errorMessage = 'Please confirm your email first'
    } else if (error.name === 'UserNotFoundException') {
      errorMessage = 'User not found'
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    )
  }
}

async function handleResend(data: any) {
  try {
    const { email } = data

    const resendCommand = new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: email,
    })

    await cognitoClient.send(resendCommand)

    return NextResponse.json({
      success: true,
      message: 'Confirmation code sent successfully',
    })

  } catch (error: any) {
    console.error('Resend error:', error)

    let errorMessage = 'Failed to resend confirmation code'
    if (error.name === 'UserNotFoundException') {
      errorMessage = 'User not found'
    } else if (error.name === 'InvalidParameterException') {
      errorMessage = 'Invalid email format'
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
