import { NextRequest, NextResponse } from 'next/server';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBDocumentClient, isAwsEnabled, TABLES } from '@/lib/aws-server';

export async function GET(request: NextRequest) {
  try {
    // Scan all users from DynamoDB
    if (!isAwsEnabled) {
      return NextResponse.json({ users: [], total: 0 });
    }

    const doc = getDynamoDBDocumentClient();
    const result = await doc.send(new ScanCommand({ TableName: TABLES.users }));

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

    return NextResponse.json({ users, total: users.length });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users', users: [] },
      { status: 500 }
    );
  }
}
