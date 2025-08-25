import { createClient } from '@/lib/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, options } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        ...options,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?message=confirmation-required`
      }
    });

    if (error) {
      console.error('Supabase registration error:', error);
      return NextResponse.json(
        { message: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json({
      message: 'User created successfully. Please check your email to confirm your account.',
      user: data.user
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}


