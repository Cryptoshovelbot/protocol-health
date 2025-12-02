import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreBreakdownChart } from '@/components/score-breakdown-chart';
import { ArrowLeft, Bell, Download, CheckCircle, AlertTriangle, Lock, TrendingUp, Users, Shield } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

// Mock data - in production this would come from API
const protocolsData: Record<string, any> = {
  'aave': {
    name: 'Aave',
    logo: '/aave-logo.png',
    score: 88,
    grade: 'A-',
    risk: 'Low',
    tvl: 8200000000,
    volume24h: 450000000,
    users: 45000,
    age: 1533,
    audits: 5,
    lastExploit: 'None',
    chain: 'Multi-chain',
    website: 'https://aave.com',
    breakdown: {
      security: { score: 28, max: 30, details: { hasAudits: true, auditCount: 5, age: 1533, exploitHistory: 0 } },
      tvlStability: { score: 18, max: 20, volatility: 10 },
      decentralization: { score: 16, max: 20, details: { tokenDistribution: 8, governanceActivity: 8 } },
      financialHealth: { score: 17, max: 20, details: { revenueTrend: 9, treasurySize: 8 } },
      community: { score: 9, max: 10, details: { githubActivity: 4, socialEngagement: 5 } },
    },
    strengths: [
      'Multiple security audits by top firms',
      'Battle-tested (4+ years)',
      'Strong governance & decentralization',
      'Healthy treasury ($50M+)',
      'Active development team',
    ],
    considerations: [
      'High complexity increases attack surface',
      'V2 more centralized than V3',
      'Dependent on oracle price feeds',
    ],
  },
  'uniswap': {
    name: 'Uniswap',
    score: 77,
    grade: 'B+',
    risk: 'Medium',
    tvl: 5100000000,
    volume24h: 1200000000,
    users: 120000,
    age: 1825,
    audits: 4,
    lastExploit: 'None',
    chain: 'Multi-chain',
    breakdown: {
      security: { score: 25, max: 30, details: { hasAudits: true, auditCount: 4, age: 1825, exploitHistory: 0 } },
      tvlStability: { score: 15, max: 20, volatility: 25 },
      decentralization: { score: 14, max: 20, details: { tokenDistribution: 7, governanceActivity: 7 } },
      financialHealth: { score: 15, max: 20, details: { revenueTrend: 8, treasurySize: 7 } },
      community: { score: 8, max: 10, details: { githubActivity: 4, socialEngagement: 4 } },
    },
    strengths: [
      'Largest DEX by volume',
      'Strong brand recognition',
      'V3 concentrated liquidity innovation',
      'Multi-chain deployment',
    ],
    considerations: [
      'Impermanent loss risk for LPs',
      'MEV extraction concerns',
      'Regulatory uncertainty',
    ],
  },
};

export default async function ProtocolDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const protocol = protocolsData[params.slug];
  
  if (!protocol) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link href="/protocols">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Protocols
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{protocol.name} Protocol</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Overall Score:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-lg px-3 py-1 font-bold ${
                        protocol.grade.startsWith('A') ? 'text-grade-a border-grade-a' : 
                        protocol.grade.startsWith('B') ? 'text-grade-b border-grade-b' : 
                        'text-grade-c border-grade-c'
                      }`}
                    >
                      {protocol.grade} ({protocol.score}/100)
                    </Badge>
                  </div>
                  <Badge 
                    variant={protocol.risk === 'Low' ? 'success' : protocol.risk === 'Medium' ? 'warning' : 'destructive'}
                  >
                    {protocol.risk} Risk
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  Track Protocol
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis across 5 key dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScoreBreakdownChart breakdown={protocol.breakdown} />
                </CardContent>
              </Card>

              {/* Strengths & Considerations */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {protocol.strengths.map((strength: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                      Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {protocol.considerations.map((consideration: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span className="text-sm">{consideration}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Historical Trend - Pro Feature */}
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Historical Trend</h3>
                    <p className="text-muted-foreground mb-4">
                      Upgrade to Pro to view 90-day score history
                    </p>
                    <Link href="/pricing">
                      <Button>Upgrade to Pro</Button>
                    </Link>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Historical Trend (90 days)</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  {/* Chart placeholder */}
                  <div className="h-full bg-muted rounded" />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value Locked</p>
                    <p className="text-2xl font-bold">{formatNumber(protocol.tvl)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <p className="text-xl font-semibold">{formatNumber(protocol.volume24h)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-xl font-semibold">{protocol.users.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Protocol Age</p>
                    <p className="text-xl font-semibold">{Math.floor(protocol.age / 365)} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Security Audits</p>
                    <p className="text-xl font-semibold">{protocol.audits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Exploit</p>
                    <p className="text-xl font-semibold text-green-600">{protocol.lastExploit}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Protocol Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Protocol Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Chain</span>
                    <Badge variant="secondary">{protocol.chain}</Badge>
                  </div>
                  {protocol.website && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Website</span>
                      <a 
                        href={protocol.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Visit →
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="pt-6 text-center">
                  <Shield className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Stay Protected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get real-time alerts when this protocol's score changes
                  </p>
                  <Link href="/signup">
                    <Button className="w-full">Start Free Trial</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
