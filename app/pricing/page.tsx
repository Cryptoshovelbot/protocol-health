import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, X } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Free',
    price: '€0',
    period: 'forever',
    description: 'Get started with basic protocol analysis',
    features: [
      { text: 'Top 20 protocols', included: true },
      { text: 'Basic risk scores', included: true },
      { text: '5 watchlist slots', included: true },
      { text: 'Daily updates', included: true },
      { text: 'Community support', included: true },
      { text: 'All 50+ protocols', included: false },
      { text: 'Historical trends', included: false },
      { text: 'Email alerts', included: false },
      { text: 'Export reports', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Get Started',
    ctaLink: '/signup',
    variant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '€29',
    period: 'per month',
    description: 'Complete DeFi risk intelligence platform',
    popular: true,
    features: [
      { text: 'All 50+ protocols', included: true },
      { text: 'Full risk scores', included: true },
      { text: '20 watchlist slots', included: true },
      { text: 'Real-time updates (6h)', included: true },
      { text: 'Priority support', included: true },
      { text: 'Historical trends (90 days)', included: true },
      { text: 'Email alerts', included: true },
      { text: 'Export PDF reports', included: true },
      { text: 'API access (1000 calls/day)', included: true },
      { text: 'Custom alerts', included: true },
    ],
    cta: 'Start Free Trial',
    ctaLink: '/signup?plan=pro',
    variant: 'default' as const,
  },
];

const comparisonFeatures = [
  { feature: 'Protocols Access', free: '20', pro: '50+' },
  { feature: 'Watchlist Slots', free: '5', pro: '20' },
  { feature: 'Update Frequency', free: 'Daily', pro: 'Every 6 hours' },
  { feature: 'Historical Data', free: '-', pro: '90 days' },
  { feature: 'Email Alerts', free: '-', pro: '✓' },
  { feature: 'Export Reports', free: '-', pro: '✓' },
  { feature: 'API Access', free: '-', pro: '1000 calls/day' },
  { feature: 'Support', free: 'Community', pro: 'Priority' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade when you need more. No hidden fees, cancel anytime.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={plan.popular ? 'border-blue-500 shadow-xl relative' : ''}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          {feature.included ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href={plan.ctaLink} className="w-full">
                      <Button variant={plan.variant} className="w-full" size="lg">
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Compare Plans
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4">Feature</th>
                        <th className="text-center p-4">Free</th>
                        <th className="text-center p-4 bg-blue-50">Pro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((row, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4 font-medium">{row.feature}</td>
                          <td className="p-4 text-center">{row.free}</td>
                          <td className="p-4 text-center bg-blue-50/50 font-medium">
                            {row.pro}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <CardHeader className="text-center pb-4">
                <Badge className="bg-white text-gray-900 mb-4">
                  For Teams & Institutions
                </Badge>
                <CardTitle className="text-3xl">Enterprise Solutions</CardTitle>
                <CardDescription className="text-gray-300">
                  Custom API limits, SLA guarantees, and dedicated support
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-6 text-gray-300">
                  Building a DeFi aggregator, wallet, or portfolio tracker? 
                  Get direct API access to our risk scoring engine.
                </p>
                <Button variant="secondary" size="lg">
                  Contact Sales →
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Can I cancel anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can cancel your subscription at any time from your dashboard. 
                    You'll continue to have access until the end of your billing period.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How often are scores updated?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Pro users get updates every 6 hours, while free users receive daily updates. 
                    Critical security alerts are sent immediately to all users.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards through Stripe. 
                    Enterprise customers can also pay via invoice.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! Pro plan comes with a 7-day free trial. 
                    No credit card required to start.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
