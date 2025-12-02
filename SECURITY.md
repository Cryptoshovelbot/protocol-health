# 🔒 SECURITY & OPTIMIZATION GUIDE

## Critical Security Measures Implemented

### 1. **Middleware Security** ✅
- Rate limiting (100 req/min for API)
- Security headers (XSS, CSRF protection)
- SQL injection prevention
- Path traversal blocking

### 2. **Authentication** ✅
- Supabase Row Level Security (RLS)
- Session validation
- Tier-based access control
- UUID validation

### 3. **Data Protection** ✅
- Input sanitization
- Environment variable validation
- Sensitive data filtering in logs
- HTTPS enforced

### 4. **Monitoring** ✅
- Health check endpoint (/api/health)
- Error tracking with Sentry
- Performance monitoring
- Rate limit tracking

## 🚨 IMMEDIATE ACTIONS REQUIRED

### 1. **Enable Sentry (5 min)**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```
Add to `.env.local`:
```
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### 2. **Configure Supabase Security (10 min)**

In Supabase Dashboard:

**a) Enable RLS on all tables:**
```sql
-- Run this in SQL editor
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;
```

**b) Set up Email Templates:**
- Authentication → Email Templates
- Customize confirmation & reset emails

**c) Configure Auth Settings:**
- Authentication → Settings
- Enable email confirmations
- Set password requirements (min 8 chars)
- Enable MFA (optional)

### 3. **Stripe Security (5 min)**

**a) Webhook IP Whitelisting:**
- Stripe Dashboard → Webhooks
- Add Vercel IPs only

**b) Enable Radar:**
- Stripe Dashboard → Radar
- Enable fraud detection

### 4. **Vercel Security (5 min)**

**a) Environment Variables:**
```bash
# Never expose these in client
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
CRON_SECRET
```

**b) Domain Protection:**
- Settings → Domains
- Add allowed domains only

**c) DDoS Protection:**
- Already included in Vercel

## 🛡️ BACKUP & RECOVERY

### Database Backups

**Automatic (Supabase):**
- Daily backups (7 days retention on free)
- Point-in-time recovery (Pro only)

**Manual Backup Script:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
# Upload to S3/Google Cloud
```

### Recovery Plan

**1. Database Corruption:**
```sql
-- Restore from Supabase backup
-- Or use manual backup:
psql $DATABASE_URL < backup_latest.sql
```

**2. Service Outage:**
- Supabase down → Use cached data (Redis)
- Vercel down → Deploy to backup (Netlify)
- Stripe down → Show maintenance message

**3. Security Breach:**
1. Rotate all API keys immediately
2. Force password reset for all users
3. Review audit logs
4. Notify affected users

## 📊 PERFORMANCE OPTIMIZATION

### 1. **Database Optimization**

```sql
-- Add these indexes for better performance
CREATE INDEX idx_protocols_tvl ON protocols(tvl DESC);
CREATE INDEX idx_protocols_updated ON protocols(last_updated DESC);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX idx_watchlist_protocol ON watchlist(protocol_id);

-- Analyze tables regularly
ANALYZE protocols;
ANALYZE watchlist;
```

### 2. **Caching Strategy**

**Redis Cache Times:**
- Protocol list: 1 hour
- Individual protocol: 30 min
- User data: 5 min
- Static data: 24 hours

### 3. **Image Optimization**

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image 
  src={logo} 
  alt="Protocol" 
  width={32} 
  height={32}
  loading="lazy"
/>
```

### 4. **Bundle Size**

```bash
# Analyze bundle
npm run build
npm run analyze

# Remove unused dependencies
npm prune --production
```

## 🔐 API SECURITY CHECKLIST

- [x] Rate limiting implemented
- [x] Authentication required for user endpoints
- [x] Input validation with Zod
- [x] SQL injection protection
- [x] CORS configured
- [x] Webhook signature verification
- [x] API versioning ready (/api/v1/)
- [ ] API key management (for B2B)
- [ ] Request signing (future)

## 🚦 MONITORING SETUP

### 1. **Uptime Monitoring**

**Better Uptime (Free):**
```
1. betteruptime.com → Sign up
2. Add monitor → https://your-app.vercel.app/api/health
3. Check every 1 minute
4. Alert via email/SMS
```

### 2. **Performance Monitoring**

**Vercel Analytics:**
- Already included
- Check Web Vitals daily

**PostHog:**
```typescript
// Track key events
posthog.capture('payment_completed', {
  plan: 'pro',
  amount: 29
});
```

### 3. **Error Alerts**

**Sentry Alerts:**
- Error rate > 1%
- New error types
- Performance degradation

## 📱 ADDITIONAL SECURITY HEADERS

Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

## 🆘 INCIDENT RESPONSE PLAN

### If Hacked:
1. Take site offline (Vercel → Disable)
2. Rotate ALL keys
3. Check logs (Vercel, Supabase, Stripe)
4. Restore from clean backup
5. Implement additional security
6. Notify users if data exposed

### If Data Leak:
1. Identify scope
2. Patch vulnerability
3. Notify affected users within 72h (GDPR)
4. Document incident
5. Implement prevention measures

### If DDoS Attack:
1. Enable Vercel DDoS protection
2. Implement stricter rate limits
3. Block offending IPs
4. Use Cloudflare if needed

## 📋 WEEKLY SECURITY TASKS

**Monday:**
- Check Sentry for new errors
- Review failed login attempts

**Wednesday:**
- Check dependency updates
- Review API usage patterns

**Friday:**
- Backup database manually
- Review security alerts

## 🔑 SECRETS ROTATION

**Every 30 days:**
- CRON_SECRET
- API keys

**Every 90 days:**
- Database passwords
- Stripe webhook secret

**On suspicion:**
- ALL credentials immediately

## 💡 PRO TIPS

1. **Never commit .env files**
```bash
# .gitignore
.env
.env.local
.env.production
```

2. **Use different keys for dev/prod**
- Stripe test mode for development
- Separate Supabase projects

3. **Monitor costs**
- Set billing alerts on all services
- Review usage weekly

4. **Keep dependencies updated**
```bash
npm audit
npm update
```

5. **Test recovery procedures**
- Practice backup restoration
- Test incident response

## 📞 EMERGENCY CONTACTS

- Vercel Support: support@vercel.com
- Supabase: support.supabase.com
- Stripe: dashboard.stripe.com/support
- Domain Registrar: (your provider)

## ✅ FINAL CHECKLIST

Before going live:
- [ ] All environment variables set
- [ ] RLS enabled on all tables
- [ ] Monitoring configured
- [ ] Backups tested
- [ ] SSL certificate active
- [ ] Rate limiting tested
- [ ] Error tracking live
- [ ] Health endpoint working
- [ ] Stripe webhooks verified
- [ ] Security headers checked

Remember: Security is ongoing, not one-time!
