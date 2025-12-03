import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    
    const { data: protocols, error } = await supabase
      .from('protocols')
      .select('*')
      .order('score_overall', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      data: protocols,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch protocols' },
      { status: 500 }
    );
  }
}
