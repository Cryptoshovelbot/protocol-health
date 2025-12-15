import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TopProtocolsPreview } from '@/components/top-protocols-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Bell, BarChart3, ArrowRight, Zap, Users } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

async function getTopProtocols() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from('protocols')
    .select('*')
    .order('score_overall', { ascending: false })
    .limit(10);

  return data || [];
}

export default async function Home() {
  const topProtocols = await getTopProtocols();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Know Which DeFi Protocols<br />You Can Trust
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Real-time risk scoring for 50+ DeFi protocols. Make informed decisions with comprehensive security analysis updated daily.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/protocols">
                  <Button size="lg" className="text-lg px-8">
                    View All Protocols
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-muted-foreground">Protocols Tracked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">Daily</div>
                <div className="text-sm text-muted-foreground">Updates</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">5</div>
                <div className="text-sm text-muted-foreground">Risk Dimensions</div>
              </div>
            </div>
          </div>
        </section>

        {/* Top 10 Protocols Section */}
        <TopProtocolsPreview protocols={topProtocols} />

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Protocol Health?</h2>
              <p className="text-lg text-muted-foreground">
                The most comprehensive DeFi risk analysis platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>S&P-Style Ratings</CardTitle>
                  <CardDescription>
                    Professional grade scoring system with A-F ratings based on 5 key risk dimensions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>Real-Time Updates</CardTitle>
                  <CardDescription>
                    Scores updated daily with exploit tracking and security incident monitoring
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>Transparent Methodology</CardTitle>
                  <CardDescription>
                    Open scoring system based on audits, TVL, decentralization, and security history
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Start Making Safer DeFi Decisions Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of investors using Protocol Health to evaluate DeFi protocols
            </p>
            <Link href="/protocols">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Explore All Protocols
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
