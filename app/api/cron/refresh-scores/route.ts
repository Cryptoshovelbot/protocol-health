import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { fetchProtocols, fetchTVLHistory } from '@/lib/data-fetchers/defillama';
import { calculateScore } from '@/lib/scoring';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting protocol score refresh...');
    
    // Fetch protocols from DeFiLlama
    const protocols = await fetchProtocols();
    
    // Filter and sort by TVL, take top 50
    const topProtocols = protocols
      .filter(p => p.tvl > 10000000) // Min $10M TVL
      .sort((a, b) => b.tvl - a.tvl)
      .slice(0, 50);

    const supabase = createSupabaseServerClient();
    const updates = [];
    const alerts = [];

    for (const protocol of topProtocols) {
      try {
        // Fetch TVL history for volatility calculation
        const tvlHistory = await fetchTVLHistory(protocol.name);
        
        // Calculate scores
        const { score, breakdown, grade, risk } = calculateScore(protocol, tvlHistory);
        
        // Check for existing protocol
        const { data: existingProtocol } = await supabase
          .from('protocols')
          .select('score_overall')
          .eq('slug', slugify(protocol.name))
          .single();

        // Prepare update data
        const protocolData = {
          name: protocol.name,
          slug: slugify(protocol.name),
          logo_url: protocol.logo,
          website: protocol.url,
          chain: protocol.chains?.join(', ') || protocol.chain || 'Unknown',
          tvl: Math.floor(protocol.tvl),
          volume_24h: Math.floor(protocol.totalVolume24h || 0),
          age_days: protocol.listedAt ? 
            Math.floor((Date.now() / 1000 - protocol.listedAt) / 86400) : 0,
          
          score_overall: score,
          score_security: breakdown.security.score,
          score_tvl_stability: breakdown.tvlStability.score,
          score_decentralization: breakdown.decentralization.score,
          score_financial: breakdown.financialHealth.score,
          score_community: breakdown.community.score,
          grade,
          risk_level: risk,
          
          last_updated: new Date().toISOString(),
        };

        updates.push(protocolData);

        // Check if score changed significantly (±5 points)
        if (existingProtocol && Math.abs(existingProtocol.score_overall - score) >= 5) {
          alerts.push({
            protocol_id: protocol.id,
            type: score > existingProtocol.score_overall ? 'score_rise' : 'score_drop',
            title: `${protocol.name} score changed`,
            message: `Score changed from ${existingProtocol.score_overall} to ${score}`,
            severity: Math.abs(existingProtocol.score_overall - score) >= 10 ? 'warning' : 'info',
          });
        }

        // Add to score history
        await supabase
          .from('score_history')
          .insert({
            protocol_id: protocol.id,
            score_overall: score,
            grade,
            recorded_at: new Date().toISOString(),
          });

      } catch (error) {
        console.error(`Error processing ${protocol.name}:`, error);
      }
    }

    // Batch upsert protocols
    if (updates.length > 0) {
      const { error } = await supabase
        .from('protocols')
        .upsert(updates, { 
          onConflict: 'slug',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error updating protocols:', error);
      }
    }

    // Create alerts for users watching these protocols
    if (alerts.length > 0) {
      // Get all users watching these protocols
      const { data: watchlistItems } = await supabase
        .from('watchlist')
        .select('user_id, protocol_id')
        .in('protocol_id', alerts.map(a => a.protocol_id));

      if (watchlistItems) {
        const userAlerts = [];
        for (const alert of alerts) {
          const watchers = watchlistItems.filter(w => w.protocol_id === alert.protocol_id);
          for (const watcher of watchers) {
            userAlerts.push({
              ...alert,
              user_id: watcher.user_id,
              created_at: new Date().toISOString(),
            });
          }
        }

        if (userAlerts.length > 0) {
          await supabase
            .from('alerts')
            .insert(userAlerts);
        }
      }
    }

    console.log(`Successfully updated ${updates.length} protocols`);

    return NextResponse.json({ 
      success: true,
      updated: updates.length,
      alerts: alerts.length
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
