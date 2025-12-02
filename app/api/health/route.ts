import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import redis from '@/lib/redis';

export const runtime = 'edge'; // Use edge runtime for faster response

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
      cache: 'unknown',
      api: 'healthy',
    },
    metrics: {
      response_time_ms: 0,
    },
  };

  const startTime = Date.now();

  try {
    // Check database connectivity
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase
        .from('protocols')
        .select('count')
        .limit(1)
        .single();
      
      health.checks.database = error ? 'unhealthy' : 'healthy';
    } catch (error) {
      health.checks.database = 'unhealthy';
      health.status = 'degraded';
    }

    // Check Redis cache
    try {
      await redis.ping();
      health.checks.cache = 'healthy';
    } catch (error) {
      health.checks.cache = 'unhealthy';
      health.status = 'degraded';
    }

    // Calculate response time
    health.metrics.response_time_ms = Date.now() - startTime;

    // Set overall status
    const allHealthy = Object.values(health.checks).every(
      check => check === 'healthy'
    );
    health.status = allHealthy ? 'healthy' : 'degraded';

    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
