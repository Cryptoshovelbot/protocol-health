import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Vérifier les env vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ 
        error: 'Missing Supabase credentials',
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: protocols, error } = await supabase
      .from('protocols')
      .select('*')
      .order('overall_score', { ascending: false });

    if (error) {
      return NextResponse.json({ 
        error: 'Supabase error',
        message: error.message,
        details: error
      }, { status: 500 });
    }

    if (!protocols || !Array.isArray(protocols)) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(protocols);
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Server error',
      message: error.message 
    }, { status: 500 });
  }
}
