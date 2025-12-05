import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Bell, BarChart3, ArrowRight, Zap, Users } from 'lucide-react';

export default function Home() {
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
                Real-time risk scoring for 30+ DeFi protocols. Make informed decisions with comprehensive security analysis updated daily.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/protocols">
                  <Button size="lg" className="text-lg px-8">
                    View Risk Scores
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/protocols">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    See All Protocols
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">30+</div>
                  <p className="text-muted-foreground">Protocols Analyzed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">$100B+</div>
                  <p className="text-muted-foreground">Total Value Tracked</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">Daily</div>
                  <p className="text-muted-foreground">Updates</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comprehensive DeFi Risk Analysis
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every protocol is evaluated across 5 critical dimensions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>Security Analysis</CardTitle>
                  <CardDescription>
                    Audit history, age, exploit tracking, and smart contract security
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>TVL Stability</CardTitle>
                  <CardDescription>
                    Track liquidity trends and protocol stability over time
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>Decentralization</CardTitle>
                  <CardDescription>
                    Token distribution and governance activity metrics
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
                  <CardTitle>Financial Health</CardTitle>
                  <CardDescription>
                    Revenue trends, treasury analysis, and sustainability
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                  <CardTitle>Community Strength</CardTitle>
                  <CardDescription>
                    Developer activity and social engagement tracking
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Bell className="h-12 w-12 text-red-600 mb-4" />
                  <CardTitle>Real-time Updates</CardTitle>
                  <CardDescription>
                    Stay informed with daily score updates
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground">
                Simple, transparent risk scoring
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
                  <p className="text-muted-foreground">
                    We aggregate data from DeFiLlama, audit firms, and on-chain sources
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analysis Engine</h3>
                  <p className="text-muted-foreground">
                    Our algorithm evaluates 5 key dimensions with weighted scoring
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Grade Assignment</h3>
                  <p className="text-muted-foreground">
                    Protocols receive letter grades (A-F) and risk levels (Low/Medium/High)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Your Decision</h3>
                  <p className="text-muted-foreground">
                    Use our scores to make informed investment decisions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="pt-12 pb-12">
                <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">
                  Start Making Safer DeFi Decisions
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  View risk scores for 30+ DeFi protocols
                </p>
                <Link href="/protocols">
                  <Button size="lg" className="text-lg px-8">
                    View Risk Scores
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
