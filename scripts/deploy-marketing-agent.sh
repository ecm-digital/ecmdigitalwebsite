#!/bin/bash

# ECM Marketing Agent - AWS Deployment Script
# Usage: ./deploy-marketing-agent.sh [environment]

set -e

ENVIRONMENT=${1:-dev}
REGION="eu-central-1"
STACK_NAME="ecm-marketing-agent-${ENVIRONMENT}"

echo "🚀 Deploying ECM Marketing Agent to ${ENVIRONMENT} environment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials verified"

# Create S3 buckets if they don't exist
echo "📦 Setting up S3 buckets..."

KNOWLEDGE_BUCKET="ecm-digital-knowledge-${ENVIRONMENT}"
CMS_BUCKET="ecm-digital-cms-${ENVIRONMENT}"

aws s3 mb "s3://${KNOWLEDGE_BUCKET}" --region ${REGION} 2>/dev/null || echo "Bucket ${KNOWLEDGE_BUCKET} already exists"
aws s3 mb "s3://${CMS_BUCKET}" --region ${REGION} 2>/dev/null || echo "Bucket ${CMS_BUCKET} already exists"

# Upload knowledge base files
echo "📚 Uploading knowledge base files..."
aws s3 sync knowledge-base/ "s3://${KNOWLEDGE_BUCKET}/" --region ${REGION}

# Upload templates
echo "📝 Uploading templates..."
aws s3 sync templates/ "s3://${KNOWLEDGE_BUCKET}/" --region ${REGION}

# Create Lambda deployment packages
echo "🔧 Creating Lambda deployment packages..."

cd lambda-functions

# Install dependencies
npm install --production

# Create ZIP files for each Lambda
for func in create-linear-task save-blog-draft notify-user; do
    echo "📦 Packaging ${func}..."
    zip -r "${func}.zip" . -x "*.zip" "node_modules/.cache/*" "*.log"
done

cd ..

# Deploy Lambda functions
echo "🚀 Deploying Lambda functions..."

# Create IAM role for Lambda
ROLE_NAME="ecm-marketing-agent-lambda-role-${ENVIRONMENT}"
aws iam create-role --role-name ${ROLE_NAME} --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}' 2>/dev/null || echo "Role ${ROLE_NAME} already exists"

# Attach policies
aws iam attach-role-policy --role-name ${ROLE_NAME} --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam attach-role-policy --role-name ${ROLE_NAME} --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-role-policy --role-name ${ROLE_NAME} --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name ${ROLE_NAME} --query 'Role.Arn' --output text)

# Deploy each Lambda function
FUNCTIONS=("create-linear-task:CreateLinear" "save-blog-draft:SaveBlogDraft" "notify-user:NotifyUser")

for func_info in "${FUNCTIONS[@]}"; do
    IFS=':' read -r func_name func_display_name <<< "$func_info"
    
    echo "📦 Deploying ${func_display_name}..."
    
    # Create or update function
    if aws lambda get-function --function-name "${func_display_name}-${ENVIRONMENT}" --region ${REGION} &>/dev/null; then
        # Update existing function
        aws lambda update-function-code \
            --function-name "${func_display_name}-${ENVIRONMENT}" \
            --zip-file "fileb://lambda-functions/${func_name}.zip" \
            --region ${REGION}
    else
        # Create new function
        aws lambda create-function \
            --function-name "${func_display_name}-${ENVIRONMENT}" \
            --runtime nodejs18.x \
            --role ${ROLE_ARN} \
            --handler "${func_name}.handler" \
            --zip-file "fileb://lambda-functions/${func_name}.zip" \
            --region ${REGION} \
            --timeout 30 \
            --memory-size 256
    fi
    
    # Set environment variables
    aws lambda update-function-configuration \
        --function-name "${func_display_name}-${ENVIRONMENT}" \
        --environment "Variables={AWS_REGION=${REGION},KNOWLEDGE_BUCKET=${KNOWLEDGE_BUCKET},CMS_BUCKET=${CMS_BUCKET}}" \
        --region ${REGION}
done

# Deploy Step Functions
echo "🔄 Deploying Step Functions..."

# Replace placeholders in Step Functions definition
sed "s/\${AWS_REGION}/${REGION}/g; s/\${AWS_ACCOUNT}/$(aws sts get-caller-identity --query Account --output text)/g" \
    step-functions/marketing-agent-workflow.json > step-functions/workflow-${ENVIRONMENT}.json

# Create state machine
aws stepfunctions create-state-machine \
    --name "ecm-marketing-agent-workflow-${ENVIRONMENT}" \
    --definition "file://step-functions/workflow-${ENVIRONMENT}.json" \
    --role-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/StepFunctionsExecutionRole" \
    --region ${REGION} 2>/dev/null || echo "State machine already exists"

# Clean up temporary files
rm -f step-functions/workflow-${ENVIRONMENT}.json
rm -f lambda-functions/*.zip

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Summary:"
echo "   Environment: ${ENVIRONMENT}"
echo "   Region: ${REGION}"
echo "   Knowledge Bucket: ${KNOWLEDGE_BUCKET}"
echo "   CMS Bucket: ${CMS_BUCKET}"
echo "   Lambda Functions: CreateLinear, SaveBlogDraft, NotifyUser"
echo "   Step Functions: ecm-marketing-agent-workflow-${ENVIRONMENT}"
echo ""
echo "🔗 Next steps:"
echo "   1. Configure Bedrock Agent with system prompt from prompts/system_marketing_agent.txt"
echo "   2. Set up Linear API key in environment variables"
echo "   3. Test the workflow end-to-end"
echo "   4. Configure website revalidation endpoint"
