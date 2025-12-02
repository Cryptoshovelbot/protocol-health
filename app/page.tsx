import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, TrendingUp, Users, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { formatNumber } from '@/lib/utils';

// Mock data for demo - in production this would come from API
const topProtocols = [
  { rank: 1, name: 'Aave', slug: 'aave', score: 88, grade: 'A-', tvl: 8200000000, risk: 'Low' },
  { rank: 2, name: 'Uniswap', slug: 'uniswap', score: 77, grade: 'B+', tvl: 5100000000, risk: 'Medium' },
  { rank: 3, name: 'Curve', slug: 'curve-dao', score: 72, grade: 'B', tvl: 4800000000, risk: 'Medium' },
  { rank: 4, name: 'MakerDAO', slug: 'makerdao', score: 85, grade: 'A', tvl: 4500000000, risk: 'Low' },
  { rank: 5, name: 'Compound', slug: 'compound', score: 79, grade: 'B+', tvl: 3200000000, risk: 'Low' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              Trusted by 1,000+ DeFi Investors
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Know Which DeFi Protocols
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                You Can Trust
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Real-time risk scoring for 50+ DeFi protocols. Make informed decisions with 
              comprehensive security analysis updated every 6 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="min-w-[200px]">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/protocols">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  View All Scores
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Top Protocols Table */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Top Protocols by Score</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4">#</th>
                        <th className="text-left p-4">Protocol</th>
                        <th className="text-left p-4">Score</th>
                        <th className="text-left p-4">TVL</th>
                        <th className="text-left p-4">Risk</th>
                        <th className="text-left p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProtocols.map((protocol) => (
                        <tr key={protocol.slug} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4 font-medium">{protocol.rank}</td>
                          <td className="p-4 font-semibold">{protocol.name}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`
                                ${protocol.grade.startsWith('A') ? 'text-grade-a border-grade-a' : ''}
                                ${protocol.grade.startsWith('B') ? 'text-grade-b border-grade-b' : ''}
                                ${protocol.grade.startsWith('C') ? 'text-grade-c border-grade-c' : ''}
                              `}>
                                {protocol.grade} {protocol.score}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4">{formatNumber(protocol.tvl)}</td>
                          <td className="p-4">
                            <Badge variant={protocol.risk === 'Low' ? 'success' : protocol.risk === 'Medium' ? 'warning' : 'destructive'}>
                              {protocol.risk}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Link href={`/protocols/${protocol.slug}`}>
                              <Button variant="ghost" size="sm">
                                View Details
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <div className="mt-6 text-center">
              <Link href="/protocols">
                <Button variant="outline">
                  View All 50+ Protocols
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-blue-500 mb-4" />
                  <CardTitle>1. Comprehensive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We analyze 50+ data points across security, stability, 
                    decentralization, financial health, and community metrics.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-green-500 mb-4" />
                  <CardTitle>2. AI-Powered Scoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our algorithm evaluates audit reports, on-chain data, 
                    and market indicators to generate real-time risk scores.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                  <CardTitle>3. Real-Time Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get notified instantly when protocol scores change, 
                    new exploits occur, or risk levels shift.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Protocol Health</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: 'Security First', desc: 'Multi-layer security analysis including audits, age, and exploit history' },
                { icon: TrendingUp, title: 'TVL Stability', desc: '90-day volatility tracking to identify stable vs risky protocols' },
                { icon: Users, title: 'Decentralization', desc: 'Token distribution and governance activity scoring' },
                { icon: BarChart3, title: 'Financial Health', desc: 'Revenue trends and treasury analysis' },
                { icon: AlertTriangle, title: 'Risk Alerts', desc: 'Real-time notifications on score changes' },
                { icon: CheckCircle2, title: 'Updated Every 6 Hours', desc: 'Fresh data from DeFiLlama, CoinGecko, and more' },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <feature.icon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Start Making Safer DeFi Decisions Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 1,000+ investors using Protocol Health to navigate DeFi safely
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="min-w-[200px] bg-white/10 border-white text-white hover:bg-white/20">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
