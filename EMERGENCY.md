# 🚨 EMERGENCY PROCEDURES - SAVE THIS FILE!

## WHEN SHIT HITS THE FAN - QUICK ACTIONS

### 1. SITE IS DOWN
```bash
# Check status
curl -I https://your-app.vercel.app

# Quick fix attempts:
vercel --prod  # Redeploy
vercel rollback  # Rollback to previous

# Nuclear option:
vercel alias set your-app-old.vercel.app your-domain.com
```

### 2. DATABASE CORRUPTED
```bash
# IMMEDIATE: Stop all writes
# In Supabase Dashboard: Settings → API → Disable "anon" key temporarily

# Restore from backup
cd backups/[latest-date]
./recovery.sh

# Or manual restore:
psql $DATABASE_URL < backup_HHMMSS.sql
```

### 3. INFINITE LOOP / HIGH BILLS
```bash
# STOP EVERYTHING NOW:
# 1. Vercel Dashboard → Project → Settings → Advanced → Pause Project
# 2. Supabase → Settings → Pause Project  
# 3. Stripe → Developers → Webhooks → Disable All
```

### 4. SECURITY BREACH DETECTED
```bash
# IMMEDIATE ACTIONS (in order):

# 1. BLOCK ALL ACCESS
vercel env pull  # Get current env
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY --yes
vercel --prod  # Redeploy without key

# 2. ROTATE ALL SECRETS
# Supabase → Settings → API → Regenerate Keys
# Stripe → API Keys → Roll Key
# Update all in Vercel

# 3. FORCE LOGOUT ALL USERS  
# Run in Supabase SQL:
TRUNCATE auth.sessions;
UPDATE auth.users SET email_confirmed_at = NULL;

# 4. AUDIT
# Check logs: Vercel, Supabase, Stripe
# Look for: Unusual IPs, Large data exports, API abuse
```

### 5. STRIPE CHARGING WRONG AMOUNT
```bash
# STOP NEW CHARGES:
# Stripe Dashboard → Products → Archive Product

# Fix existing:
# Stripe Dashboard → Customers → Select → Refund

# Update price:
# Create new price, update STRIPE_PRICE_ID_PRO in Vercel
vercel env add STRIPE_PRICE_ID_PRO
vercel --prod
```

### 6. USERS CAN'T LOGIN
```bash
# Check Supabase status
curl https://status.supabase.com/api/v2/status.json

# Test auth directly
curl -X POST https://[PROJECT].supabase.co/auth/v1/signup \
  -H "apikey: [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"testpass123"}'

# Common fixes:
# 1. Check email templates in Supabase
# 2. Verify redirect URLs match your domain
# 3. Clear Redis cache
```

### 7. CRON JOB RUNNING WILD
```bash
# STOP IT:
# Vercel Dashboard → Functions → refresh-scores → Disable

# Or remove from vercel.json and redeploy:
sed -i '/"crons"/,/\]/d' vercel.json
vercel --prod

# Fix data:
# SQL: DELETE FROM score_history WHERE created_at > NOW() - INTERVAL '1 hour';
```

### 8. MEMORY LEAK / SITE SLOW
```bash
# Quick diagnosis:
# Vercel Dashboard → Functions → Check execution time

# Immediate fix:
vercel --force  # Force fresh deployment

# Clear all caches:
# Redis: FLUSHALL command in Upstash console
# Vercel: Settings → Data Cache → Purge All
```

## 📞 EMERGENCY CONTACTS

### Priority 1 (Site Down):
- Vercel Status: https://vercel-status.com
- Vercel Support: support@vercel.com (Pro only)
- Your backup admin: [Phone/Email]

### Priority 2 (Data/Security):
- Supabase Support: support.supabase.com
- Stripe Emergency: +1-888-926-2289

### Priority 3 (Domain/DNS):
- Your registrar support
- Cloudflare: +1-650-319-3004

## 🔄 POST-INCIDENT CHECKLIST

After fixing ANY incident:

1. [ ] Document what happened (time, impact, cause)
2. [ ] Check for data loss
3. [ ] Notify affected users (if needed)  
4. [ ] Update monitoring to catch this earlier
5. [ ] Create test to prevent recurrence
6. [ ] Backup everything again
7. [ ] Update this document with new procedure

## 🛠️ PREVENTION TOOLS

### Monitor these daily:
- [ ] Vercel Analytics (errors, performance)
- [ ] Supabase Dashboard (API usage, errors)
- [ ] Stripe Dashboard (failed payments, disputes)
- [ ] Uptime monitor (should ping every minute)
- [ ] Error tracking (Sentry)

### Weekly maintenance:
```bash
# Every Monday morning:
npm update
npm audit fix
npm run build
./scripts/pre-launch.sh
./scripts/db-safety.sh
```

## 🎯 DECISION TREE

```
Is the site completely down?
├─ YES → Rollback immediately, investigate later
└─ NO → Is it affecting payments?
    ├─ YES → Disable Stripe webhooks, fix, re-enable
    └─ NO → Is data being corrupted?
        ├─ YES → Disable writes, backup, fix, restore
        └─ NO → Is it a performance issue?
            ├─ YES → Clear caches, scale up, optimize
            └─ NO → Monitor and fix normally
```

## 💰 COST CONTROL ALERTS

Set up billing alerts:
- Vercel: $50/month limit
- Supabase: $25/month limit  
- Stripe: Flag any charge >€100
- Upstash: 10k commands/day limit

If any service bills >$100 unexpectedly:
1. PAUSE the project immediately
2. Contact their support
3. Dispute charges if attack/bug

## 🔐 RECOVERY CODES - STORE SAFELY!

```
Supabase Project ID: [SAVE THIS]
Vercel Team ID: [SAVE THIS]
Stripe Account ID: [SAVE THIS]
Domain Registrar Account: [SAVE THIS]
Backup Email: [SAVE THIS]
```

## Remember:
1. **Stay calm** - Most issues are fixable
2. **Rollback first** - Fix later
3. **Communicate** - Update users if down >10min
4. **Document** - Note everything for post-mortem
5. **Learn** - Every incident makes you stronger

SAVE THIS FILE OFFLINE + CLOUD + PRINT!
