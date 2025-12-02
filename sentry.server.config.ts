import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Server specific options
  autoSessionTracking: true,
  
  beforeSend(event) {
    // Filter sensitive server data
    if (event.contexts?.runtime) {
      delete event.contexts.runtime.env;
    }
    
    // Remove environment variables
    if (event.extra?.env) {
      delete event.extra.env;
    }
    
    // Don't send in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    return event;
  },
});
