import { createServerSupabaseClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { field_id, date, start_time, end_time, total_price } = await request.json();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the time slot is available
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('field_id', field_id)
      .eq('date', date)
      .or(`start_time.lte.${end_time},end_time.gte.${start_time}`);

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        field_id,
        user_id: user.id,
        date,
        start_time,
        end_time,
        total_price,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const query = supabase
      .from('bookings')
      .select(`
        *,
        fields (
          name,
          sport_type,
          location
        ),
        users (
          name,
          email
        )
      `);

    // If not admin, only show own bookings
    if (userProfile?.role !== 'admin') {
      query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}