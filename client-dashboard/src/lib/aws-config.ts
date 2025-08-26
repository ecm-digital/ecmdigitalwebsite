// AWS Configuration for ECM Digital Client Dashboard
export const AWS_CONFIG = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1',
  
  // Cognito User Pool
  cognito: {
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
    identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || '',
  },
  
  // DynamoDB Tables
  dynamodb: {
    users: process.env.NEXT_PUBLIC_DYNAMODB_USERS_TABLE || 'ecm-users',
    projects: process.env.NEXT_PUBLIC_DYNAMODB_PROJECTS_TABLE || 'ecm-projects',
    messages: process.env.NEXT_PUBLIC_DYNAMODB_MESSAGES_TABLE || 'ecm-messages',
    documents: process.env.NEXT_PUBLIC_DYNAMODB_DOCUMENTS_TABLE || 'ecm-documents',
  },
  
  // S3 Buckets
  s3: {
    documents: process.env.NEXT_PUBLIC_S3_DOCUMENTS_BUCKET || 'ecm-documents',
    avatars: process.env.NEXT_PUBLIC_S3_AVATARS_BUCKET || 'ecm-avatars',
    projectFiles: process.env.NEXT_PUBLIC_S3_PROJECT_FILES_BUCKET || 'ecm-project-files',
  },
  
  // Lambda Functions
  lambda: {
    auth: process.env.NEXT_PUBLIC_LAMBDA_AUTH_FUNCTION || 'ecm-auth-function',
    projects: process.env.NEXT_PUBLIC_LAMBDA_PROJECTS_FUNCTION || 'ecm-projects-function',
    documents: process.env.NEXT_PUBLIC_LAMBDA_DOCUMENTS_FUNCTION || 'ecm-documents-function',
    chatbot: process.env.NEXT_PUBLIC_LAMBDA_CHATBOT_FUNCTION || 'ecm-chatbot-function',
  },
  
  // CloudFront
  cloudfront: {
    domain: process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || '',
  },
  
  // API Gateway
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  }
}

// AWS SDK v3 Clients
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { LambdaClient } from '@aws-sdk/client-lambda'

export const awsClients = {
  cognito: new CognitoIdentityProviderClient({ region: AWS_CONFIG.region }),
  dynamodb: new DynamoDBClient({ region: AWS_CONFIG.region }),
  s3: new S3Client({ region: AWS_CONFIG.region }),
  lambda: new LambdaClient({ region: AWS_CONFIG.region }),
}

// Environment check
export const isAWSConfigured = () => {
  return !!(
    AWS_CONFIG.cognito.userPoolId &&
    AWS_CONFIG.cognito.clientId &&
    AWS_CONFIG.cognito.identityPoolId
  )
}






