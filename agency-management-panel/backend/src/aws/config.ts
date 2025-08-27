import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { RDSClient } from '@aws-sdk/client-rds';

// AWS Configuration
export const AWS_CONFIG = {
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
};

// AWS Service Clients
export const cognitoClient = new CognitoIdentityProviderClient(AWS_CONFIG);
export const dynamoClient = new DynamoDBClient(AWS_CONFIG);
export const rdsClient = new RDSClient(AWS_CONFIG);

// Cognito Configuration
export const COGNITO_CONFIG = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID || 'eu-west-1_xxxxxxxxx',
  ClientId: process.env.COGNITO_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  Region: AWS_CONFIG.region,
};

// DynamoDB Configuration
export const DYNAMODB_CONFIG = {
  Tables: {
    users: process.env.DYNAMODB_USERS_TABLE || 'ecm-users',
    projects: process.env.DYNAMODB_PROJECTS_TABLE || 'ecm-projects',
    clients: process.env.DYNAMODB_CLIENTS_TABLE || 'ecm-clients',
    services: process.env.DYNAMODB_SERVICES_TABLE || 'ecm-services',
  },
};

// RDS Configuration
export const RDS_CONFIG = {
  host: process.env.RDS_HOST || 'localhost',
  port: parseInt(process.env.RDS_PORT || '5432'),
  database: process.env.RDS_DATABASE || 'ecm_digital',
  username: process.env.RDS_USERNAME || 'postgres',
  password: process.env.RDS_PASSWORD || '',
  ssl: process.env.RDS_SSL === 'true',
};
