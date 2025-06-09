import { createServerSupabaseClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('fields')
      .select(`
        *,
        field_amenities (
          name
        )
      `);

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

export async function POST(request: Request) {
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

    if (userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, sport_type, location, description, price_per_hour, image_url, amenities } = await request.json();

    const { data: field, error: fieldError } = await supabase
      .from('fields')
      .insert([{
        name,
        sport_type,
        location,
        description,
        price_per_hour,
        image_url
      }])
      .select()
      .single();

    if (fieldError) {
      return NextResponse.json(
        { error: fieldError.message },
        { status: 400 }
      );
    }

    if (amenities && amenities.length > 0) {
      const amenityRecords = amenities.map((name: string) => ({
        field_id: field.id,
        name
      }));

      const { error: amenityError } = await supabase
        .from('field_amenities')
        .insert(amenityRecords);

      if (amenityError) {
        return NextResponse.json(
          { error: amenityError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(field);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}