# 🚀 AWS Setup for ECM Digital Client Dashboard

## 📋 Overview
This guide will help you set up AWS services for the ECM Digital Client Dashboard, including authentication, database, file storage, and serverless functions.

## 🔧 Required AWS Services

### 1. **AWS Cognito** - User Authentication
- User Pool for user registration and sign-in
- Identity Pool for temporary AWS credentials
- Email verification and password reset

### 2. **AWS DynamoDB** - Database
- Users table for user profiles
- Projects table for project management
- Messages table for chat functionality
- Documents table for file metadata

### 3. **AWS S3** - File Storage
- Documents bucket for project files
- Avatars bucket for user profile pictures
- Project files bucket for project assets

### 4. **AWS Lambda** - Serverless Functions
- Authentication functions
- Project management functions
- Document handling functions
- Chatbot integration functions

### 5. **AWS API Gateway** - REST API
- RESTful endpoints for all functions
- CORS configuration
- Rate limiting and security

### 6. **AWS CloudFront** - CDN
- Static file delivery
- Global content distribution
- SSL/TLS termination

## 🚀 Quick Setup Steps

### Step 1: Create AWS Cognito User Pool
```bash
# Using AWS CLI
aws cognito-idp create-user-pool \
  --pool-name "ECM-Client-Dashboard" \
  --policies '{"PasswordPolicy":{"MinimumLength":8,"RequireUppercase":true,"RequireLowercase":true,"RequireNumbers":true,"RequireSymbols":false}}' \
  --auto-verified-attributes email \
  --username-attributes email \
  --schema '{"Name":"email","AttributeDataType":"String","Required":true,"Mutable":true}' \
  --schema '{"Name":"name","AttributeDataType":"String","Required":true,"Mutable":true}' \
  --schema '{"Name":"custom:company","AttributeDataType":"String","Required":false,"Mutable":true}'
```

### Step 2: Create Cognito User Pool Client
```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-name "ECM-Client-App" \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH
```

### Step 3: Create Identity Pool
```bash
aws cognito-identity create-identity-pool \
  --identity-pool-name "ECM-Client-Identity" \
  --allow-unauthenticated-identities false \
  --cognito-identity-providers ProviderName="cognito-idp.eu-west-1.amazonaws.com/YOUR_USER_POOL_ID",ClientId="YOUR_CLIENT_ID",ServerSideTokenCheck=false
```

### Step 4: Create DynamoDB Tables
```bash
# Users Table
aws dynamodb create-table \
  --table-name ecm-users \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Projects Table
aws dynamodb create-table \
  --table-name ecm-projects \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes IndexName=UserIdIndex,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Messages Table
aws dynamodb create-table \
  --table-name ecm-messages \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=projectId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes IndexName=ProjectIdIndex,KeySchema=[{AttributeName=projectId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Documents Table
aws dynamodb create-table \
  --table-name ecm-documents \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=projectId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes IndexName=ProjectIdIndex,KeySchema=[{AttributeName=projectId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST
```

### Step 5: Create S3 Buckets
```bash
# Documents Bucket
aws s3 mb s3://ecm-documents
aws s3api put-bucket-cors --bucket ecm-documents --cors-configuration '{"CORSRules":[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","POST","DELETE"],"AllowedOrigins":["*"],"ExposeHeaders":[]}]}'

# Avatars Bucket
aws s3 mb s3://ecm-avatars
aws s3api put-bucket-cors --bucket ecm-avatars --cors-configuration '{"CORSRules":[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","POST","DELETE"],"AllowedOrigins":["*"],"ExposeHeaders":[]}]}'

# Project Files Bucket
aws s3 mb s3://ecm-project-files
aws s3api put-bucket-cors --bucket ecm-project-files --cors-configuration '{"CORSRules":[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","POST","DELETE"],"AllowedOrigins":["*"],"ExposeHeaders":[]}]}'
```

### Step 6: Create Lambda Functions
```bash
# Create deployment package
zip -r ecm-auth-function.zip auth-function/
zip -r ecm-projects-function.zip projects-function/
zip -r ecm-documents-function.zip documents-function/
zip -r ecm-chatbot-function.zip chatbot-function/

# Create functions
aws lambda create-function \
  --function-name ecm-auth-function \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://ecm-auth-function.zip

# Repeat for other functions...
```

### Step 7: Create API Gateway
```bash
# Create REST API
aws apigateway create-rest-api \
  --name "ECM-Client-API" \
  --description "API for ECM Digital Client Dashboard"

# Create resources and methods
# (This is complex - use AWS Console or CloudFormation)
```

## 🔐 Environment Variables

Copy the variables from `aws-env-example.txt` to your `.env.local` file:

```bash
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-west-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=eu-west-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# DynamoDB Tables
NEXT_PUBLIC_DYNAMODB_USERS_TABLE=ecm-users
NEXT_PUBLIC_DYNAMODB_PROJECTS_TABLE=ecm-projects
NEXT_PUBLIC_DYNAMODB_MESSAGES_TABLE=ecm-messages
NEXT_PUBLIC_DYNAMODB_DOCUMENTS_TABLE=ecm-documents

# S3 Buckets
NEXT_PUBLIC_S3_DOCUMENTS_BUCKET=ecm-documents
NEXT_PUBLIC_S3_AVATARS_BUCKET=ecm-avatars
NEXT_PUBLIC_S3_PROJECT_FILES_BUCKET=ecm-project-files

# Lambda Functions
NEXT_PUBLIC_LAMBDA_AUTH_FUNCTION=ecm-auth-function
NEXT_PUBLIC_LAMBDA_PROJECTS_FUNCTION=ecm-projects-function
NEXT_PUBLIC_LAMBDA_DOCUMENTS_FUNCTION=ecm-documents-function
NEXT_PUBLIC_LAMBDA_CHATBOT_FUNCTION=ecm-chatbot-function

# CloudFront & API Gateway
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=d1234567890abc.cloudfront.net
NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod
```

## 🧪 Testing

### 1. Test Authentication
```bash
# Test user registration
curl -X POST https://your-api-gateway-url/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Test user login
curl -X POST https://your-api-gateway-url/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 2. Test DynamoDB
```bash
# List tables
aws dynamodb list-tables

# Scan users table
aws dynamodb scan --table-name ecm-users
```

### 3. Test S3
```bash
# List buckets
aws s3 ls

# Upload test file
echo "test" > test.txt
aws s3 cp test.txt s3://ecm-documents/
```

## 🔒 Security Best Practices

1. **IAM Roles**: Use least privilege principle
2. **CORS**: Configure CORS properly for your domains
3. **Encryption**: Enable encryption at rest and in transit
4. **Monitoring**: Set up CloudWatch and CloudTrail
5. **Backup**: Enable DynamoDB point-in-time recovery
6. **Versioning**: Enable S3 versioning for important files

## 📚 Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check S3 bucket CORS configuration
2. **Authentication Failures**: Verify Cognito User Pool settings
3. **Permission Denied**: Check IAM roles and policies
4. **Cold Start**: Consider Lambda provisioned concurrency

### Support:
- AWS Support Center
- AWS Developer Forums
- Stack Overflow (tag: aws)





