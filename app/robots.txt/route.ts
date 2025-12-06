import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://protocol-health.io/sitemap.xml

Disallow: /dashboard
Disallow: /login
Disallow: /signup
Disallow: /api/`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
