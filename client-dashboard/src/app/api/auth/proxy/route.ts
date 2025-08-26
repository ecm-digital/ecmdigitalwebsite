import { NextRequest, NextResponse } from 'next/server'

// Proxy endpoint for main website to access authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    // Forward the request to the internal integration API
    const internalUrl = new URL('/api/auth/integration', request.url)

    const response = await fetch(internalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward the original referer
        'Referer': request.headers.get('referer') || '',
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify({ action, data }),
    })

    const result = await response.json()

    return NextResponse.json(result, {
      status: response.status,
    })

  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    )
  }
}

// Handle CORS for main website
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
