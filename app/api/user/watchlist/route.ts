import { NextRequest } from 'next/server';
import { createAPIResponse, requireAuth, getUserProfile, sanitizeInput } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema
const AddToWatchlistSchema = z.object({
  protocolId: z.string().uuid('Invalid protocol ID'),
});

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    if (!session) {
      return createAPIResponse(null, 'Unauthorized', 401);
    }

    const supabase = createSupabaseServerClient();
    
    // Get user's watchlist with protocol details
    const { data, error } = await supabase
      .from('watchlist')
      .select(`
        id,
        created_at,
        protocol:protocols (
          id,
          name,
          slug,
          score_overall,
          grade,
          risk_level,
          tvl
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
      return createAPIResponse(null, 'Failed to fetch watchlist', 500);
    }

    return createAPIResponse(data);
  } catch (error: any) {
    return createAPIResponse(null, error.message, 401);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    if (!session) {
      return createAPIResponse(null, 'Unauthorized', 401);
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Validate input
    const validation = AddToWatchlistSchema.safeParse(body);
    if (!validation.success) {
      return createAPIResponse(
        null, 
        validation.error.errors[0].message,
        400
      );
    }

    const { protocolId } = validation.data;
    const supabase = createSupabaseServerClient();

    // Check user's tier and current watchlist count
    const profile = await getUserProfile();
    if (!profile) {
      return createAPIResponse(null, 'Profile not found', 404);
    }

    const { count } = await supabase
      .from('watchlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    const maxWatchlist = profile.tier === 'pro' ? 20 : 5;
    
    if (count && count >= maxWatchlist) {
      return createAPIResponse(
        null,
        `Watchlist limit reached (${maxWatchlist}). ${
          profile.tier === 'free' ? 'Upgrade to Pro for more slots.' : ''
        }`,
        403
      );
    }

    // Check if protocol exists
    const { data: protocol } = await supabase
      .from('protocols')
      .select('id')
      .eq('id', protocolId)
      .single();

    if (!protocol) {
      return createAPIResponse(null, 'Protocol not found', 404);
    }

    // Add to watchlist
    const { data, error } = await supabase
      .from('watchlist')
      .insert({
        user_id: session.user.id,
        protocol_id: protocolId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return createAPIResponse(null, 'Protocol already in watchlist', 409);
      }
      console.error('Error adding to watchlist:', error);
      return createAPIResponse(null, 'Failed to add to watchlist', 500);
    }

    // Log activity for analytics
    console.log(`User ${session.user.id} added protocol ${protocolId} to watchlist`);

    return createAPIResponse(data, null, 201);
  } catch (error: any) {
    return createAPIResponse(null, error.message, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    if (!session) {
      return createAPIResponse(null, 'Unauthorized', 401);
    }

    // Get protocol ID from URL params
    const url = new URL(request.url);
    const protocolId = url.searchParams.get('protocolId');

    if (!protocolId) {
      return createAPIResponse(null, 'Protocol ID required', 400);
    }

    const supabase = createSupabaseServerClient();

    // Delete from watchlist
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', session.user.id)
      .eq('protocol_id', protocolId);

    if (error) {
      console.error('Error removing from watchlist:', error);
      return createAPIResponse(null, 'Failed to remove from watchlist', 500);
    }

    return createAPIResponse({ success: true });
  } catch (error: any) {
    return createAPIResponse(null, error.message, 500);
  }
}
