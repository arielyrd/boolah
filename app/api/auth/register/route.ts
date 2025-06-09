import { createServerSupabaseClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    if (user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ id: user.id, email, name, role: 'user' }]);

      if (profileError) {
        return NextResponse.json(
          { error: profileError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: 'Registration successful' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}