import { NextRequest, NextResponse } from 'next/server'

const AWS = require('aws-sdk')

AWS.config.update({
  region: process.env.AWS_REGION || 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const PROJECTS_TABLE = 'ecm-projects'
const USER_ID_INDEX = 'UserIdIndex'
const AGENCY_BACKEND_URL = process.env.AGENCY_BACKEND_URL || process.env.NEXT_PUBLIC_AGENCY_BACKEND_URL || 'http://localhost:3001'

interface CreateProjectBody {
  userId: string // usually user email for now
  name: string
  description?: string
  type?: string
  status?: string
  budget_total?: number
  budget_used?: number
  deadline?: string
}

interface ListProjectsBody {
  userId: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as Partial<CreateProjectBody & ListProjectsBody>

    // List by userId when only userId is provided
    if (body && body.userId && !body.name) {
      const userId = String(body.userId)
      const queryParams = {
        TableName: PROJECTS_TABLE,
        IndexName: USER_ID_INDEX,
        KeyConditionExpression: '#uid = :uid',
        ExpressionAttributeNames: { '#uid': 'userId' },
        ExpressionAttributeValues: { ':uid': userId },
      }

      const result = await dynamodb.query(queryParams).promise()
      return NextResponse.json({ projects: result.Items || [] })
    }

    // Create project
    if (!body || !body.userId || !body.name) {
      return NextResponse.json({ error: 'userId and name are required' }, { status: 400 })
    }

    const nowIso = new Date().toISOString()
    const projectId = `project_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

    const projectItem = {
      id: projectId,
      userId: String(body.userId),
      name: String(body.name),
      description: body.description ? String(body.description) : '',
      type: body.type ? String(body.type) : 'website',
      status: body.status ? String(body.status) : 'discovery',
      budget_total: typeof body.budget_total === 'number' ? body.budget_total : 0,
      budget_used: typeof body.budget_used === 'number' ? body.budget_used : 0,
      deadline: body.deadline ? String(body.deadline) : undefined,
      createdAt: nowIso,
      updatedAt: nowIso,
    }

    await dynamodb.put({ TableName: PROJECTS_TABLE, Item: projectItem }).promise()

    // Notify agency backend (fire-and-forget)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3500)
      const payload = {
        type: 'new_project',
        priority: 'medium',
        message: `Nowy projekt: ${projectItem.name} (${projectItem.status})`,
        client: {
          email: projectItem.userId,
          projectId: projectItem.id,
          projectName: projectItem.name,
          budget: projectItem.budget_total,
          status: projectItem.status,
        },
      }
      const resp = await fetch(`${AGENCY_BACKEND_URL}/api/notifications/new-client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch((e) => {
        console.warn('⚠️ Project webhook failed:', e)
        return null
      })
      clearTimeout(timeout)
      if (resp && !resp.ok) {
        const text = await resp.text().catch(() => '')
        console.warn('⚠️ Project webhook non-OK:', resp.status, text)
      } else if (resp) {
        console.log('🔔 Project webhook delivered')
      }
    } catch (whErr) {
      console.warn('⚠️ Project webhook error (ignored):', whErr)
    }
    return NextResponse.json({ project: projectItem }, { status: 201 })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      const queryParams = {
        TableName: PROJECTS_TABLE,
        IndexName: USER_ID_INDEX,
        KeyConditionExpression: '#uid = :uid',
        ExpressionAttributeNames: { '#uid': 'userId' },
        ExpressionAttributeValues: { ':uid': userId },
      }
      const result = await dynamodb.query(queryParams).promise()
      return NextResponse.json({ projects: result.Items || [] })
    }

    // Fallback: list all projects (scan)
    const result = await dynamodb.scan({ TableName: PROJECTS_TABLE }).promise()
    return NextResponse.json({ projects: result.Items || [] })
  } catch (error) {
    console.error('Projects API GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


