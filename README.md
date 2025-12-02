# Protocol Health - DeFi Risk Scoring Platform

A comprehensive DeFi protocol risk scoring platform that provides real-time analysis across security, stability, decentralization, financial health, and community metrics.

## 🚀 Features

- **Real-time Risk Scoring**: Analyze 50+ DeFi protocols with scores updated every 6 hours
- **5-Dimension Analysis**: Security, TVL Stability, Decentralization, Financial Health, Community
- **Tiered Access**: Free tier (20 protocols) and Pro tier (€29/month for all features)
- **Watchlist & Alerts**: Track protocols and get notified of score changes
- **API Access**: B2B ready with REST API for integration
- **Historical Data**: 90-day trend analysis (Pro feature)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Stripe account for payments
- Upstash Redis account for caching
- Vercel account for deployment

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd protocol-health
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the entire `supabase/schema.sql` file
3. Go to Settings → API and copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. In Dashboard, get your API keys:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
3. Create a product and price:
   - Product: "Protocol Health Pro"
   - Price: €29/month
   - Copy the price ID → `STRIPE_PRICE_ID_PRO`
4. Set up webhook endpoint:
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen: 
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

### 4. Redis Setup (Upstash)

1. Create account at [upstash.com](https://upstash.com)
2. Create a Redis database
3. Copy credentials:
   - REST URL → `UPSTASH_REDIS_REST_URL`
   - REST Token → `UPSTASH_REDIS_REST_TOKEN`

### 5. Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_PRO=price_xxx

# Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Optional APIs
ETHERSCAN_API_KEY=xxx
GITHUB_TOKEN=ghp_xxx

# Cron Secret (generate a random string)
CRON_SECRET=your-secret-token-here

# PostHog (optional analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment (Vercel)

### 1. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### 2. Configure Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Update `NEXT_PUBLIC_APP_URL` to your production URL

### 3. Configure Cron Jobs

Vercel will automatically detect `vercel.json` and set up the cron job for score refresh.

### 4. Update Stripe Webhook

Update webhook endpoint URL in Stripe to your production domain.

## 📊 Database Schema

- **protocols**: Main protocol data and scores
- **user_profiles**: User tier and subscription data
- **watchlist**: User's tracked protocols
- **score_history**: Historical score data
- **alerts**: User notifications
- **api_keys**: B2B API access (future)

## 🔄 Data Refresh Strategy

- Cron job runs every 6 hours via `/api/cron/refresh-scores`
- Fetches data from DeFiLlama API (free, no key required)
- Calculates scores using 5-metric algorithm
- Updates database and creates alerts for significant changes

## 💳 Payment Flow

1. User clicks "Upgrade to Pro"
2. Redirected to Stripe Checkout
3. After payment, webhook updates user to Pro tier
4. Pro features instantly unlocked

## 🎯 Success Metrics

Track in PostHog/Vercel Analytics:
- Signups per day
- Free → Pro conversion rate
- Most viewed protocols
- API usage (when launched)

## 🔒 Security

- Supabase Row Level Security (RLS) enabled
- API routes validate authentication
- Stripe webhook signature verification
- Rate limiting on public endpoints
- Environment variables for secrets

## 📈 Scaling Considerations

### Current (MVP):
- 50 protocols
- Vercel free tier
- Supabase free tier (500MB)
- Upstash Redis free tier (10K commands/day)

### Growth Phase:
- Expand to 100+ protocols
- Upgrade Supabase ($25/month)
- Add more data sources
- Implement email notifications

### Scale Phase:
- Multi-chain support
- Advanced analytics
- B2B API monetization
- Dedicated infrastructure

## 🐛 Troubleshooting

### Common Issues:

1. **Supabase connection error**: Check your environment variables
2. **Stripe webhook fails**: Verify webhook secret and endpoint URL
3. **Cron job not running**: Check CRON_SECRET in Vercel
4. **Redis cache errors**: Verify Upstash credentials

## 📚 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Caching**: Upstash Redis
- **Payments**: Stripe
- **Hosting**: Vercel
- **Analytics**: PostHog, Vercel Analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for your own projects!

## 🚦 Go-Live Checklist

- [ ] Domain registered and configured
- [ ] SSL certificate active
- [ ] Environment variables set in production
- [ ] Stripe in production mode
- [ ] Database migrations complete
- [ ] Cron job tested
- [ ] Analytics configured
- [ ] Error tracking set up (Sentry)
- [ ] Privacy Policy and Terms published
- [ ] Social accounts created
- [ ] Launch announcement prepared

## 💬 Support

For questions or issues:
- Open a GitHub issue
- Contact: support@protocolhealth.io
- Twitter: @ProtocolHealth

---

Built with ❤️ for the DeFi community
