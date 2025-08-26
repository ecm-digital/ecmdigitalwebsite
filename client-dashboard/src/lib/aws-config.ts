// AWS Configuration for ECM Digital Client Dashboard
export const AWS_CONFIG = {
  region: (process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1').trim(),
  
  // Cognito User Pool
  cognito: {
    userPoolId: (process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '').trim(),
    clientId: (process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '').trim(),
    identityPoolId: (process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || '').trim(),
  },
  
  // DynamoDB Tables
  dynamodb: {
    users: (process.env.NEXT_PUBLIC_DYNAMODB_USERS_TABLE || 'ecm-users').trim(),
    projects: (process.env.NEXT_PUBLIC_DYNAMODB_PROJECTS_TABLE || 'ecm-projects').trim(),
    messages: (process.env.NEXT_PUBLIC_DYNAMODB_MESSAGES_TABLE || 'ecm-messages').trim(),
    documents: (process.env.NEXT_PUBLIC_DYNAMODB_DOCUMENTS_TABLE || 'ecm-documents').trim(),
  },
  
  // S3 Buckets
  s3: {
    documents: (process.env.NEXT_PUBLIC_S3_DOCUMENTS_BUCKET || 'ecm-documents').trim(),
    avatars: (process.env.NEXT_PUBLIC_S3_AVATARS_BUCKET || 'ecm-avatars').trim(),
    projectFiles: (process.env.NEXT_PUBLIC_S3_PROJECT_FILES_BUCKET || 'ecm-project-files').trim(),
  },
  
  // Lambda Functions
  lambda: {
    auth: (process.env.NEXT_PUBLIC_LAMBDA_AUTH_FUNCTION || 'ecm-auth-function').trim(),
    projects: (process.env.NEXT_PUBLIC_LAMBDA_PROJECTS_FUNCTION || 'ecm-projects-function').trim(),
    documents: (process.env.NEXT_PUBLIC_LAMBDA_DOCUMENTS_FUNCTION || 'ecm-documents-function').trim(),
    chatbot: (process.env.NEXT_PUBLIC_LAMBDA_CHATBOT_FUNCTION || 'ecm-chatbot-function').trim(),
  },
  
  // CloudFront
  cloudfront: {
    domain: (process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || '').trim(),
  },
  
  // API Gateway
  api: {
    baseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim(),
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







