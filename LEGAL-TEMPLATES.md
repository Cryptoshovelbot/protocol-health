# LEGAL TEMPLATES - Customize these!

## 1. PRIVACY POLICY (Minimal GDPR Compliant)

Copy to: `/app/privacy/page.tsx`

```
Last updated: [DATE]

Protocol Health ("we", "our", "us") operates protocolhealth.io.

### Data We Collect
- Email address (for authentication)
- Payment information (processed by Stripe, we don't store cards)
- Usage data (pages visited, features used)
- Protocol watchlist preferences

### How We Use Data  
- Provide our service
- Process payments
- Send service updates (you can opt out)
- Improve our product

### Data Storage
- Database: Supabase (EU servers)
- Payments: Stripe (PCI compliant)
- Analytics: PostHog (anonymized)

### Your Rights (GDPR)
You have the right to:
- Access your data
- Correct your data  
- Delete your data
- Export your data
- Object to processing

Contact: privacy@protocolhealth.io

### Cookies
Essential cookies only for authentication.

### Security
We use industry-standard encryption and security measures.

### Changes
We'll notify you of any changes via email.

### Contact
Email: support@protocolhealth.io
```

## 2. TERMS OF SERVICE

Copy to: `/app/terms/page.tsx`

```
Last updated: [DATE]

### 1. Acceptance
By using Protocol Health, you agree to these terms.

### 2. Service Description  
Protocol Health provides DeFi protocol risk scoring. 
This is NOT financial advice.

### 3. User Accounts
- You must provide accurate information
- You're responsible for your account security
- One account per person

### 4. Subscriptions
- Free tier: Limited access
- Pro tier: €29/month
- Cancel anytime
- No refunds for partial months

### 5. Prohibited Uses
You may not:
- Scrape our data
- Reverse engineer our scoring
- Resell our service
- Use for illegal activities
- Overload our servers

### 6. Disclaimer
THE SERVICE IS PROVIDED "AS IS".
WE ARE NOT LIABLE FOR:
- Investment losses
- Data accuracy
- Service availability

### 7. Limitation of Liability
Maximum liability: Amount you paid in last 12 months.

### 8. Termination
We can terminate accounts that violate terms.

### 9. Governing Law
Laws of [YOUR COUNTRY].

### 10. Contact
Email: legal@protocolhealth.io
```

## 3. COOKIE BANNER

Add to your layout.tsx:

```typescript
'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          We use essential cookies for authentication. 
          <a href="/privacy" className="underline ml-2">Learn more</a>
        </p>
        <button 
          onClick={accept}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
```

## 4. DATA DELETION REQUEST HANDLER

```typescript
// /app/api/gdpr/delete/route.ts

export async function POST(request: Request) {
  const { email } = await request.json();
  
  // 1. Verify user identity (send email confirmation)
  // 2. Schedule deletion in 30 days
  // 3. Log request
  
  // Actual deletion:
  await supabase.auth.admin.deleteUser(userId);
  await supabase.from('user_profiles').delete().eq('id', userId);
  await stripe.customers.del(stripeCustomerId);
  
  return Response.json({ message: 'Deletion scheduled' });
}
```

## 5. REFUND POLICY

```
### Refund Policy

**7-day free trial**: Cancel anytime, no charge.

**After trial**:
- Cancel anytime, access until end of billing period
- No partial month refunds
- Exception: Service unavailable >48h = prorated refund

**To request refund**:
Email: support@protocolhealth.io with order ID.

**Processing**:
5-10 business days to original payment method.
```

## 6. DMCA NOTICE

```
### DMCA Notice

If you believe content infringes your copyright:

Send notice to:
dmca@protocolhealth.io

Include:
1. Your contact information
2. Infringing content URL
3. Proof of ownership
4. Statement of good faith
5. Statement of accuracy under penalty of perjury
6. Electronic signature

We'll remove content within 48h if valid.
```

## 7. AFFILIATE DISCLOSURE

```
### Affiliate Disclosure

Some links may be affiliate links. 
We may earn commission at no extra cost to you.
This doesn't affect our scoring or recommendations.
```

## LEGAL CHECKLIST

Before launch:
- [ ] Register company (if needed)
- [ ] Get business bank account
- [ ] Register for VAT (if EU >€10k/year)
- [ ] Add legal pages to site
- [ ] Add cookie banner (EU)
- [ ] Set up GDPR data export
- [ ] Create data processing agreement
- [ ] Get terms reviewed by lawyer ($500)

## GDPR COMPLIANCE

Required features:
- [x] User can view their data
- [x] User can delete account
- [ ] Data export (JSON format)
- [ ] Email preferences
- [ ] Cookie consent
- [ ] Privacy by design
- [ ] Data minimization

## VAT HANDLING (EU)

```typescript
// Stripe handles VAT automatically with:
const session = await stripe.checkout.sessions.create({
  automatic_tax: { enabled: true },
  // ...
});
```

Remember:
- B2C EU: Charge VAT of customer's country
- B2B EU: Reverse charge (0% with VAT ID)
- Outside EU: Usually 0%

## IMPORTANT NOTES

1. **These are TEMPLATES** - Get lawyer review
2. **Update regularly** - Laws change
3. **Be transparent** - Users appreciate honesty
4. **Keep records** - All consent, deletions, etc.
5. **Insurance** - Consider professional liability

## Legal Resources

- Termly.io - Generate policies
- Iubenda.com - GDPR compliance
- Stripe Atlas - Company formation
- LegalZoom - Affordable legal help

Cost estimate:
- Lawyer review: $500-1500
- Company formation: $500
- Ongoing compliance: $50/month tools
