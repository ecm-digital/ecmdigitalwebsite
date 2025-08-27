#!/usr/bin/env node

/**
 * Environment check script for ECM Marketing Agent
 * Usage: node check-environment.js
 */

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'eu-central-1' });

async function checkLambdaEnvironment(functionName) {
  console.log(`\n🔍 Checking environment variables for ${functionName}...`);

  try {
    const response = await lambda.getFunctionConfiguration({
      FunctionName: functionName
    }).promise();

    const envVars = response.Environment?.Variables || {};

    console.log(`✅ Function: ${response.FunctionName}`);
    console.log(`📍 Runtime: ${response.Runtime}`);
    console.log(`⏱️  Timeout: ${response.Timeout}s`);
    console.log(`💾 Memory: ${response.MemorySize}MB`);
    console.log(`📊 Environment Variables:`);

    if (Object.keys(envVars).length === 0) {
      console.log(`   ⚠️  No environment variables configured`);
    } else {
      Object.entries(envVars).forEach(([key, value]) => {
        const maskedValue = key.includes('KEY') || key.includes('SECRET') || key.includes('PASSWORD')
          ? `${value.substring(0, 4)}****`
          : value;
        console.log(`   ${key}: ${maskedValue}`);
      });
    }

    return envVars;
  } catch (error) {
    console.log(`❌ Error checking ${functionName}: ${error.message}`);
    return null;
  }
}

async function checkS3Buckets() {
  console.log(`\n📦 Checking S3 buckets...`);

  const s3 = new AWS.S3({ region: 'eu-central-1' });
  const buckets = ['ecm-digital-knowledge-dev', 'ecm-digital-cms-dev'];

  for (const bucketName of buckets) {
    try {
      await s3.headBucket({ Bucket: bucketName }).promise();
      console.log(`✅ Bucket ${bucketName} exists`);

      // Check bucket contents
      const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();
      console.log(`   📁 Contains ${objects.KeyCount} objects`);
    } catch (error) {
      console.log(`❌ Bucket ${bucketName}: ${error.message}`);
    }
  }
}

async function checkKnowledgeBaseFiles() {
  console.log(`\n📚 Checking Knowledge Base files...`);

  const s3 = new AWS.S3({ region: 'eu-central-1' });
  const bucketName = 'ecm-digital-knowledge-dev';

  const requiredFiles = [
    'brand/stylecard.json',
    'services/services.json',
    'seo/internal-links.json',
    'mdx/blog.mdx'
  ];

  for (const fileKey of requiredFiles) {
    try {
      await s3.headObject({ Bucket: bucketName, Key: fileKey }).promise();
      console.log(`✅ File ${fileKey} exists`);
    } catch (error) {
      console.log(`❌ File ${fileKey}: Not found`);
    }
  }
}

async function runEnvironmentCheck() {
  console.log('🔧 ECM Marketing Agent - Environment Check');
  console.log('===========================================');

  // Check AWS credentials
  AWS.config.getCredentials((err) => {
    if (err) {
      console.log('❌ AWS credentials not found. Please run: aws configure');
      process.exit(1);
    }
    console.log('✅ AWS credentials configured');
  });

  // Check Lambda functions
  const functions = ['CreateLinear-dev', 'SaveBlogDraft-dev', 'NotifyUser-dev'];

  for (const functionName of functions) {
    await checkLambdaEnvironment(functionName);
  }

  // Check S3 buckets
  await checkS3Buckets();

  // Check Knowledge Base files
  await checkKnowledgeBaseFiles();

  console.log('\n✨ Environment check completed!');
  console.log('\n📋 Recommendations:');
  console.log('   1. Configure LINEAR_API_KEY environment variable');
  console.log('   2. Configure REVALIDATE_SECRET for website revalidation');
  console.log('   3. Configure REVALIDATE_URL if needed');
  console.log('   4. Verify Linear API key has correct permissions');
  console.log('\n💡 Use the following command to set environment variables:');
  console.log('   aws lambda update-function-configuration --function-name FUNCTION_NAME --environment "Variables={KEY=VALUE}"');
}

// Run the environment check
runEnvironmentCheck().catch(console.error);
