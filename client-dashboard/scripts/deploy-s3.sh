#!/bin/bash
set -euo pipefail

# Config
BUCKET_NAME=${S3_BUCKET_NAME:-ecm-client-dashboard-prod}
CLOUDFRONT_DISTRIBUTION_ID=${CLOUDFRONT_DISTRIBUTION_ID:-}
REGION=${AWS_REGION:-eu-west-1}

echo "Building static export..."
npm run build:export

echo "Creating bucket if not exists: s3://$BUCKET_NAME"
if ! aws s3 ls "s3://$BUCKET_NAME" >/dev/null 2>&1; then
  aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
  aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document 404.html || true
fi

echo "Syncing ./out to s3://$BUCKET_NAME"
aws s3 sync ./out "s3://$BUCKET_NAME" --delete --cache-control "public,max-age=300" --region "$REGION"

if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "Creating CloudFront invalidation..."
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
fi

echo "Deployment complete."





