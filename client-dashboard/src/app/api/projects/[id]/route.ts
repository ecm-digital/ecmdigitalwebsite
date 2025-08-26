import { NextRequest, NextResponse } from 'next/server'
import { GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoDBDocumentClient, isAwsEnabled, TABLES } from '@/lib/aws-server'

const PROJECTS_TABLE = TABLES.projects

const hasAwsCreds = isAwsEnabled && Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
let dynamodb: any = null

// Share the same in-memory store as root route by using a module-level singleton
const devStore: { projects: any[] } = (globalThis as any).__ECM_DEV_STORE__ || { projects: [] }
;(globalThis as any).__ECM_DEV_STORE__ = devStore

function ensureAws() {
  if (!hasAwsCreds) return
  if (!dynamodb) {
    dynamodb = getDynamoDBDocumentClient()
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!hasAwsCreds) {
      const item = devStore.projects.find(p => p.id === id)
      if (!item) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      return NextResponse.json({ project: item })
    }
    ensureAws()
    const result = await dynamodb.send(new GetCommand({ TableName: PROJECTS_TABLE, Key: { id } }))
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

    if (!hasAwsCreds) {
      const index = devStore.projects.findIndex(p => p.id === id)
      if (index === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      const updated = { ...devStore.projects[index], ...updates, updatedAt: nowIso }
      devStore.projects[index] = updated
      return NextResponse.json({ project: updated })
    }

    ensureAws()
    const result = await dynamodb.send(new UpdateCommand({
      TableName: PROJECTS_TABLE,
      Key: { id },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }))
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
    if (!hasAwsCreds) {
      const index = devStore.projects.findIndex(p => p.id === id)
      if (index === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      devStore.projects.splice(index, 1)
      return NextResponse.json({ success: true, deletedId: id })
    }

    ensureAws()
    // Ensure the item exists first
    const existing = await dynamodb.send(new GetCommand({ TableName: PROJECTS_TABLE, Key: { id } }))
    if (!existing.Item) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await dynamodb.send(new DeleteCommand({ TableName: PROJECTS_TABLE, Key: { id } }))
    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error('Project DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


