import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: watchlist, error } = await supabase
      .from('user_watchlists')
      .select('protocol_id, protocols(*)')
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      data: watchlist 
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { protocol_id } = await request.json();

    const { data, error } = await supabase
      .from('user_watchlists')
      .insert({
        user_id: user.id,
        protocol_id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Protocol already in watchlist' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      data 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to watchlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { protocol_id } = await request.json();

    const { error } = await supabase
      .from('user_watchlists')
      .delete()
      .eq('user_id', user.id)
      .eq('protocol_id', protocol_id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true 
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from watchlist' },
      { status: 500 }
    );
  }
}
