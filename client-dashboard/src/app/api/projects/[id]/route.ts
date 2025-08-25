import { NextRequest, NextResponse } from 'next/server'

const AWS = require('aws-sdk')

AWS.config.update({
  region: process.env.AWS_REGION || 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const PROJECTS_TABLE = 'ecm-projects'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const result = await dynamodb.get({ TableName: PROJECTS_TABLE, Key: { id } }).promise()
    if (!result.Item) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json({ project: result.Item })
  } catch (error) {
    console.error('Project GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updates = await request.json()

    const nowIso = new Date().toISOString()

    // Build update expression dynamically
    const allowedFields = [
      'name',
      'description',
      'type',
      'status',
      'budget_total',
      'budget_used',
      'deadline',
      'start_date',
      'end_date',
      'priority',
    ]

    const updateKeys = Object.keys(updates || {}).filter((k) => allowedFields.includes(k))

    if (updateKeys.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    let UpdateExpression = 'SET updatedAt = :updatedAt'
    const ExpressionAttributeValues: Record<string, any> = {
      ':updatedAt': nowIso,
    }
    const ExpressionAttributeNames: Record<string, string> = {}

    for (const key of updateKeys) {
      const nameKey = `#${key}`
      const valueKey = `:${key}`
      UpdateExpression += `, ${nameKey} = ${valueKey}`
      ExpressionAttributeNames[nameKey] = key
      ExpressionAttributeValues[valueKey] = updates[key]
    }

    const result = await dynamodb
      .update({
        TableName: PROJECTS_TABLE,
        Key: { id },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise()

    return NextResponse.json({ project: result.Attributes })
  } catch (error) {
    console.error('Project PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Ensure the item exists first
    const existing = await dynamodb.get({ TableName: PROJECTS_TABLE, Key: { id } }).promise()
    if (!existing.Item) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await dynamodb.delete({ TableName: PROJECTS_TABLE, Key: { id } }).promise()
    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error('Project DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


