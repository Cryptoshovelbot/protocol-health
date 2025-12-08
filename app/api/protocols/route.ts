import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: protocols, error } = await supabase
      .from('protocols')
      .select('*')
      .order('overall_score', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // S'assurer que protocols est un tableau
    if (!Array.isArray(protocols)) {
      console.error('Protocols is not an array:', protocols);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(protocols);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
