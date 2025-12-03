import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Release Tracking
  environment: process.env.NODE_ENV,
  
  // Filtering
  ignoreErrors: [
    // Browser extensions
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    
    // Network errors
    'NetworkError',
    'Failed to fetch',
    
    // User cancelled actions
    'AbortError',
    
    // Known third-party errors
    'stripe is not defined',
  ],
  
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request?.cookies) {
      event.request.cookies = {} as Record<string, string>;;
    }
    
    if (event.request?.data) {
      const data = event.request.data;
      // Remove sensitive fields
      if (typeof data === 'object') {
        const filtered = { ...data };
        const sensitiveFields = [
          'password',
          'email',
          'stripe_customer_id',
          'api_key',
          'token',
          'secret',
        ];
        
        sensitiveFields.forEach(field => {
          if (field in filtered) {
            filtered[field] = '[Filtered]';
          }
        });
        
        event.request.data = undefined;
      }
    }
    
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    return event;
  },
  
  integrations: [
    // Custom integrations
    new Sentry.Integrations.Breadcrumbs({
      console: false, // Don't capture console.log
      fetch: true,
      history: true,
      xhr: true,
    }),
  ],
});
