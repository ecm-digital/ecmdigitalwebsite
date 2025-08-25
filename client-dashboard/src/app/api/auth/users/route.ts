import { NextRequest, NextResponse } from 'next/server';

const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function GET(request: NextRequest) {
  try {
    // Scan all users from DynamoDB
    const params = {
      TableName: 'ecm-users'
    };

    const result = await dynamodb.scan(params).promise();

    // Transform data for the management panel
    const users = result.Items?.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      company: user.company || '',
      role: user.role || 'client',
      isEmailVerified: user.isEmailVerified || false,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || null,
      status: user.isEmailVerified ? 'Zweryfikowany' : 'Niezweryfikowany',
      fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    })) || [];

    return NextResponse.json({
      users: users,
      total: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users', users: [] },
      { status: 500 }
    );
  }
}
