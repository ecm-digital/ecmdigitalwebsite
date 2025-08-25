import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Fetching projects from backend...');

    // Test direct connection first
    console.log('Testing backend connection...');
    const testResponse = await fetch('http://127.0.0.1:3001/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Test response status:', testResponse.status);

    const backendUrl = 'http://127.0.0.1:3001/api/projects';
    console.log('Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch projects from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Fetched projects:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
