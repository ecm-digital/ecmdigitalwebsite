#!/usr/bin/env node

/**
 * Test script for ECM Marketing Agent Lambda functions
 * Usage: node test-lambda-functions.js
 */

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'eu-central-1' });

async function testLambdaFunction(functionName, payload, description) {
  console.log(`\n🧪 Testing ${functionName}...`);
  console.log(`📝 ${description}`);

  try {
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(payload)
    };

    const response = await lambda.invoke(params).promise();
    const result = JSON.parse(response.Payload);

    console.log(`✅ Status: ${response.StatusCode}`);
    console.log(`📊 Result:`, JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 ECM Marketing Agent - Lambda Functions Test');
  console.log('==============================================');

  // Test 1: CreateLinear function
  await testLambdaFunction(
    'CreateLinear-dev',
    {
      title: "Test task from Lambda",
      description: "This is a test task created via Lambda function",
      teamKey: "ECM",
      labels: ["test", "automation"],
      priority: 2,
      estimate: 2,
      dueDate: "2025-01-15"
    },
    "Testing Linear task creation"
  );

  // Test 2: SaveBlogDraft function
  await testLambdaFunction(
    'SaveBlogDraft-dev',
    {
      blogDraft: {
        language: "pl",
        title: "Test blog post",
        slug: "test-blog-post",
        tags: ["test", "blog"],
        excerpt: "This is a test blog post",
        sections: ["Introduction", "Main content", "Conclusion"],
        seo: {
          title: "Test blog post - ECM Digital",
          description: "Test description for blog post",
          ogImage: "/images/blog/test-hero.jpg"
        },
        publishMode: "draft"
      },
      seoPack: {
        title: "Test blog SEO",
        description: "Test SEO description",
        slug: "test-blog-seo",
        tags: ["test", "seo"]
      }
    },
    "Testing blog draft saving"
  );

  // Test 3: NotifyUser function
  await testLambdaFunction(
    'NotifyUser-dev',
    {
      userEmail: "test@ecm-digital.com",
      actionType: "test_notification",
      actionData: {
        testId: "12345",
        timestamp: new Date().toISOString()
      },
      message: "This is a test notification from ECM Marketing Agent"
    },
    "Testing user notification"
  );

  console.log('\n✨ Test completed!');
  console.log('\n📋 Summary:');
  console.log('   - CreateLinear-dev: Creates tasks in Linear');
  console.log('   - SaveBlogDraft-dev: Saves blog drafts to S3');
  console.log('   - NotifyUser-dev: Sends email notifications');
  console.log('\n💡 Note: Make sure to configure LINEAR_API_KEY and other environment variables');
}

// Check if AWS credentials are available
AWS.config.getCredentials((err) => {
  if (err) {
    console.log('❌ AWS credentials not found. Please run: aws configure');
    process.exit(1);
  }

  console.log('✅ AWS credentials found');
  runTests().catch(console.error);
});
