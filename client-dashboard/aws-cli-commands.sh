#!/bin/bash

# 🚀 AWS CLI Commands for ECM Digital Client Dashboard
# Run these commands in your AWS CLI terminal

echo "🚀 Setting up AWS services for ECM Digital Client Dashboard..."

# Set your AWS region
export AWS_REGION=eu-west-1

# Step 1: Create Cognito User Pool
echo "📝 Creating Cognito User Pool..."
USER_POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name "ECM-Client-Dashboard" \
  --policies '{"PasswordPolicy":{"MinimumLength":8,"RequireUppercase":true,"RequireLowercase":true,"RequireNumbers":true,"RequireSymbols":false}}' \
  --auto-verified-attributes email \
  --username-attributes email \
  --schema '{"Name":"email","AttributeDataType":"String","Required":true,"Mutable":true}' \
  --schema '{"Name":"name","AttributeDataType":"String","Required":true,"Mutable":true}' \
  --schema '{"Name":"custom:company","AttributeDataType":"String","Required":false,"Mutable":true}' \
  --query 'UserPool.Id' \
  --output text)

echo "✅ User Pool created: $USER_POOL_ID"

# Step 2: Create User Pool Client
echo "📝 Creating User Pool Client..."
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id $USER_POOL_ID \
  --client-name "ECM-Client-App" \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --query 'UserPoolClient.ClientId' \
  --output text)

echo "✅ User Pool Client created: $CLIENT_ID"

# Step 3: Create Identity Pool
echo "📝 Creating Identity Pool..."
IDENTITY_POOL_ID=$(aws cognito-identity create-identity-pool \
  --identity-pool-name "ECM-Client-Identity" \
  --allow-unauthenticated-identities false \
  --cognito-identity-providers ProviderName="cognito-idp.$AWS_REGION.amazonaws.com/$USER_POOL_ID",ClientId="$CLIENT_ID",ServerSideTokenCheck=false \
  --query 'IdentityPoolId' \
  --output text)

echo "✅ Identity Pool created: $IDENTITY_POOL_ID"

# Step 4: Create DynamoDB Tables
echo "📝 Creating DynamoDB Tables..."

# Users Table
aws dynamodb create-table \
  --table-name ecm-users \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

echo "✅ Users table created"

# Projects Table
aws dynamodb create-table \
  --table-name ecm-projects \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes IndexName=UserIdIndex,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

echo "✅ Projects table created"

# Messages Table
aws dynamodb create-table \
  --table-name ecm-messages \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=projectId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes IndexName=ProjectIdIndex,KeySchema=[{AttributeName=projectId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

echo "✅ Messages table created"

# Documents Table
aws dynamodb create-table \
  --table-name ecm-documents \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=projectId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes IndexName=ProjectIdIndex,KeySchema=[{AttributeName=projectId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

echo "✅ Documents table created"

# Step 5: Create S3 Buckets
echo "📝 Creating S3 Buckets..."

# Documents Bucket
aws s3 mb s3://ecm-documents --region $AWS_REGION
aws s3api put-bucket-cors --bucket ecm-documents --cors-configuration '{"CORSRules":[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","POST","DELETE"],"AllowedOrigins":["*"],"ExposeHeaders":[]}]}'

echo "✅ Documents bucket created"

# Avatars Bucket
aws s3 mb s3://ecm-avatars --region $AWS_REGION
aws s3api put-bucket-cors --bucket ecm-avatars --cors-configuration '{"CORSRules":[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","POST","DELETE"],"AllowedOrigins":["*"],"ExposeHeaders":[]}]}'

echo "✅ Avatars bucket created"

# Project Files Bucket
aws s3 mb s3://ecm-project-files --region $AWS_REGION
aws s3api put-bucket-cors --bucket ecm-project-files --cors-configuration '{"CORSRules":[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","POST","DELETE"],"AllowedOrigins":["*"],"ExposeHeaders":[]}]}'

echo "✅ Project files bucket created"

# Step 6: Create IAM Role for Lambda
echo "📝 Creating IAM Role for Lambda..."

# Create trust policy
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
ROLE_ARN=$(aws iam create-role \
  --role-name ecm-lambda-execution-role \
  --assume-role-policy-document file://trust-policy.json \
  --query 'Role.Arn' \
  --output text)

echo "✅ IAM Role created: $ROLE_ARN"

# Attach basic execution policy
aws iam attach-role-policy \
  --role-name ecm-lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Attach DynamoDB policy
aws iam attach-role-policy \
  --role-name ecm-lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# Attach S3 policy
aws iam attach-role-policy \
  --role-name ecm-lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

echo "✅ IAM policies attached"

# Clean up
rm trust-policy.json

# Step 7: Output Configuration
echo ""
echo "🎉 AWS Setup Complete!"
echo ""
echo "📋 Configuration for .env.local:"
echo "NEXT_PUBLIC_AWS_REGION=$AWS_REGION"
echo "NEXT_PUBLIC_COGNITO_USER_POOL_ID=$USER_POOL_ID"
echo "NEXT_PUBLIC_COGNITO_CLIENT_ID=$CLIENT_ID"
echo "NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=$IDENTITY_POOL_ID"
echo "NEXT_PUBLIC_DYNAMODB_USERS_TABLE=ecm-users"
echo "NEXT_PUBLIC_DYNAMODB_PROJECTS_TABLE=ecm-projects"
echo "NEXT_PUBLIC_DYNAMODB_MESSAGES_TABLE=ecm-messages"
echo "NEXT_PUBLIC_DYNAMODB_DOCUMENTS_TABLE=ecm-documents"
echo "NEXT_PUBLIC_S3_DOCUMENTS_BUCKET=ecm-documents"
echo "NEXT_PUBLIC_S3_AVATARS_BUCKET=ecm-avatars"
echo "NEXT_PUBLIC_S3_PROJECT_FILES_BUCKET=ecm-project-files"
echo ""
echo "🔑 IAM Role ARN for Lambda: $ROLE_ARN"
echo ""
echo "📚 Next steps:"
echo "1. Copy the configuration above to your .env.local file"
echo "2. Create Lambda functions using the IAM role ARN"
echo "3. Set up API Gateway endpoints"
echo "4. Test the authentication flow"
echo ""
echo "🚀 Happy coding!"












