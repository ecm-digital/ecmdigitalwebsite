import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { LambdaClient } from '@aws-sdk/client-lambda'
import { S3Client } from '@aws-sdk/client-s3'

// Centralized AWS v3 clients for server-side (Next.js Route Handlers)

const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1'

// Allow AWS usage in dev when USE_AWS_IN_DEV=1 or always in production
const isDev = process.env.NODE_ENV !== 'production'
const allowAwsInDev = process.env.USE_AWS_IN_DEV === '1'
export const isAwsEnabled = !isDev || allowAwsInDev

// Base v3 client and document client singletons
let baseDynamoClient: DynamoDBClient | null = null
let docClient: DynamoDBDocumentClient | null = null
let cognitoClient: CognitoIdentityProviderClient | null = null
let s3Client: S3Client | null = null
let lambdaClient: LambdaClient | null = null

export function getDynamoDBDocumentClient(): DynamoDBDocumentClient {
  if (!docClient) {
    baseDynamoClient = new DynamoDBClient({ region })
    docClient = DynamoDBDocumentClient.from(baseDynamoClient, {
      marshallOptions: { removeUndefinedValues: true },
    })
  }
  return docClient
}

export function getCognitoClient(): CognitoIdentityProviderClient {
  if (!cognitoClient) cognitoClient = new CognitoIdentityProviderClient({ region })
  return cognitoClient
}

export function getS3Client(): S3Client {
  if (!s3Client) s3Client = new S3Client({ region })
  return s3Client
}

export function getLambdaClient(): LambdaClient {
  if (!lambdaClient) lambdaClient = new LambdaClient({ region })
  return lambdaClient
}

export const TABLES = {
  users: process.env.NEXT_PUBLIC_DYNAMODB_USERS_TABLE || 'ecm-users',
  projects: process.env.NEXT_PUBLIC_DYNAMODB_PROJECTS_TABLE || 'ecm-projects',
  messages: process.env.NEXT_PUBLIC_DYNAMODB_MESSAGES_TABLE || 'ecm-messages',
  documents: process.env.NEXT_PUBLIC_DYNAMODB_DOCUMENTS_TABLE || 'ecm-documents',
}


