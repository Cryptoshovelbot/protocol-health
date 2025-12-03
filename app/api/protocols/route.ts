import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { getCached, setCached } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    // Check cache first
    const cacheKey = 'protocols:list';
    const cached = await getCached(cacheKey);
    
    if (cached) {
      return NextResponse.json({ 
        success: true, 
        data: cached,
        cached: true 
      });
    }

    // If not cached, fetch from database
    const supabase = createSupabaseServerClient();
    
    const { data: protocols, error } = await supabase
      .from('protocols')
      .select('*')
      .order('score_overall', { ascending: false })
      .limit(100); // Increased limit

    if (error) {
      throw error;
    }

    // Cache for 1 hour
    await setCached(cacheKey, protocols, 3600);

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
