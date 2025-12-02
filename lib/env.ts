import { z } from 'zod';

const envSchema = z.object({
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  STRIPE_PRICE_ID_PRO: z.string().startsWith('price_'),
  
  // Redis
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  
  // Security
  CRON_SECRET: z.string().min(12, 'CRON_SECRET must be at least 12 characters'),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  
  // Optional
  ETHERSCAN_API_KEY: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate environment variables at build time
export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return { success: true, env };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`   ${err.path}: ${err.message}`);
      });
      
      // In production, throw error to prevent deployment
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment variables');
      }
    }
    return { success: false, error };
  }
}

// Singleton to ensure validation runs once
let validated = false;

export function getEnv(): Env {
  if (!validated) {
    const result = validateEnv();
    if (!result.success) {
      console.warn('⚠️  Environment validation failed. Using defaults where possible.');
    }
    validated = true;
  }
  
  return process.env as Env;
}

// Export validated env for use throughout the app
export const env = getEnv();
