import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Cookie setting might fail in some edge cases
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Cookie removal might fail in some edge cases
          }
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createSupabaseServerClient();
  
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
}

export async function getUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function getUserProfile() {
  const user = await getUser();
  if (!user) return null;
  
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export async function requireProTier() {
  const profile = await getUserProfile();
  
  if (!profile || profile.tier !== 'pro') {
    throw new Error('Pro subscription required');
  }
  
  return profile;
}

// Utility for API routes
export function createAPIResponse(
  data?: any,
  error?: string,
  status: number = 200
) {
  if (error) {
    return NextResponse.json(
      { success: false, error },
      { status }
    );
  }
  
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

// Validate input to prevent SQL injection
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>'"`;\\]/g, '')
    .trim()
    .slice(0, 1000); // Max length
}

// Validate UUID format
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Hash sensitive data
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
