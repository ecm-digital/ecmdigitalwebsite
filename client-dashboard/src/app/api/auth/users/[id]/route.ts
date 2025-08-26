import { NextRequest, NextResponse } from 'next/server';
import { GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBDocumentClient, isAwsEnabled, TABLES } from '@/lib/aws-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData = await request.json();

    console.log('PUT request for user ID:', id, updateData);

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!isAwsEnabled) {
      return NextResponse.json({ message: 'AWS not enabled' }, { status: 503 });
    }

    // First check if user exists
    const doc = getDynamoDBDocumentClient();
    console.log('Checking if user exists...');
    const existingUser = await doc.send(new GetCommand({ TableName: TABLES.users, Key: { id } }));

    if (!existingUser.Item) {
      console.log('User not found:', id);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User found, updating...');

    // Prepare update data
    const result = await doc.send(new UpdateCommand({
      TableName: TABLES.users,
      Key: { id },
      UpdateExpression: 'SET firstName = :firstName, lastName = :lastName, #email = :email, company = :company, #role = :role, #name = :name, lastLoginAt = :lastLoginAt',
      ExpressionAttributeNames: { '#email': 'email', '#role': 'role', '#name': 'name' },
      ExpressionAttributeValues: {
        ':firstName': updateData.firstName || existingUser.Item.firstName || '',
        ':lastName': updateData.lastName || existingUser.Item.lastName || '',
        ':email': updateData.email || existingUser.Item.email,
        ':company': updateData.company || existingUser.Item.company || '',
        ':role': updateData.role || existingUser.Item.role || 'client',
        ':name': updateData.name || existingUser.Item.name || `${updateData.firstName || ''} ${updateData.lastName || ''}`.trim(),
        ':lastLoginAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }))
    const updatedUser = result.Attributes;

    console.log(`✅ User updated: ${id} (${updatedUser?.email})`);

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log('DELETE request for user ID:', id);

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!isAwsEnabled) {
      return NextResponse.json({ message: 'AWS not enabled' }, { status: 503 });
    }

    const doc = getDynamoDBDocumentClient();
    console.log('Checking if user exists...');
    const existingUser = await doc.send(new GetCommand({ TableName: TABLES.users, Key: { id } }));

    if (!existingUser.Item) {
      console.log('User not found:', id);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User found, deleting...');

    // Delete user from DynamoDB
    await doc.send(new DeleteCommand({ TableName: TABLES.users, Key: { id } }));

    console.log(`✅ User deleted: ${id} (${existingUser.Item.email})`);

    return NextResponse.json({
      message: 'User deleted successfully',
      deletedId: id,
      deletedEmail: existingUser.Item.email
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
