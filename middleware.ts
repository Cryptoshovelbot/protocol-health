import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  return `${ip}:${request.nextUrl.pathname}`;
}

function checkRateLimit(key: string, limit: number = 100, window: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + window,
    });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  // 1. Security Headers
  const headers = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://app.posthog.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://api.stripe.com https://app.posthog.com https://*.supabase.co wss://*.supabase.co; " +
    "frame-src https://js.stripe.com https://hooks.stripe.com;"
  );
  
  // 2. Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const rateLimitKey = getRateLimitKey(request);
    
    // Different limits for different endpoints
    let limit = 100; // Default: 100 requests per minute
    let window = 60000; // 1 minute
    
    if (request.nextUrl.pathname.startsWith('/api/protocols')) {
      limit = 60; // Public API: 60 requests per minute
    } else if (request.nextUrl.pathname.startsWith('/api/cron/')) {
      limit = 10; // Cron endpoints: 10 requests per minute
    } else if (request.nextUrl.pathname.startsWith('/api/webhooks/')) {
      limit = 50; // Webhook endpoints: 50 requests per minute
    }
    
    if (!checkRateLimit(rateLimitKey, limit, window)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + window).toISOString(),
        },
      });
    }
  }
  
  // 3. CORS Configuration
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://checkout.stripe.com',
    'https://js.stripe.com',
  ].filter(Boolean);
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // 4. Block suspicious paths
  const blockedPaths = [
    '/.env',
    '/wp-admin',
    '/wp-login',
    '/.git',
    '/admin',
    '/phpmyadmin',
    '/.aws',
    '/config',
  ];
  
  if (blockedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return new NextResponse(null, { status: 404 });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
