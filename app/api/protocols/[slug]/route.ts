import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { getCached, setCached } from '@/lib/redis';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Check cache first
    const cacheKey = `protocol:${slug}`;
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
    
    const { data: protocol, error } = await supabase
      .from('protocols')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Protocol not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Cache for 1 hour
    await setCached(cacheKey, protocol, 3600);

    return NextResponse.json({ 
      success: true, 
      data: protocol,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching protocol:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch protocol' },
      { status: 500 }
    );
  }
}
