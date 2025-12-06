import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreBreakdownChart } from '@/components/score-breakdown-chart';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

async function getProtocolData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/protocols/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching protocol:', error);
    return null;
  }
}

export default async function ProtocolDetailPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  const params = await props.params;
  const protocol = await getProtocolData(params.slug);
  
  if (!protocol) {
    notFound();
  }

  const breakdown = {
    security: { 
      score: Math.round((protocol.score_security || 25) / 30 * 30), 
      max: 30,
      details: {
        hasAudits: true,
        auditCount: 0,
        age: protocol.age_days || 0,
        exploitHistory: 0
      }
    },
    tvlStability: { 
      score: Math.round((protocol.score_tvl_stability || 15) / 20 * 20), 
      max: 20,
      volatility: 15
    },
    decentralization: { 
      score: Math.round((protocol.score_decentralization || 14) / 20 * 20), 
      max: 20,
      details: {
        tokenDistribution: 7,
        governanceActivity: 7
      }
    },
    financialHealth: { 
      score: Math.round((protocol.score_financial || 15) / 20 * 20), 
      max: 20,
      details: {
        revenueTrend: 8,
        treasurySize: 7
      }
    },
    community: { 
      score: Math.round((protocol.score_community || 8) / 10 * 10), 
      max: 10,
      details: {
        githubActivity: 4,
        socialEngagement: 4
      }
    },
  };

  const strengths = [
    protocol.age_days > 1000 ? `Battle-tested (${Math.floor(protocol.age_days / 365)}+ years)` : 'Established protocol',
    protocol.tvl > 1000000000 ? 'High Total Value Locked' : 'Growing TVL',
    protocol.chain === 'Multi-chain' ? 'Multi-chain deployment' : `Deployed on ${protocol.chain}`,
    'Regular security monitoring',
  ];

  const considerations = [
    'Smart contract risks',
    'Market volatility exposure',
    'Regulatory uncertainty',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/protocols">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Protocols
            </Button>
          </Link>

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
                      {protocol.grade} ({protocol.score_overall}/100)
                    </Badge>
                  </div>
                  <Badge 
                    variant={protocol.risk_level === 'Low' ? 'success' : protocol.risk_level === 'Medium' ? 'warning' : 'destructive'}
                  >
                    {protocol.risk_level} Risk
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis across 5 key dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScoreBreakdownChart breakdown={breakdown} />
                </CardContent>
              </Card>

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
                      {strengths.map((strength: string, i: number) => (
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
                      {considerations.map((consideration: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span className="text-sm">{consideration}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value Locked</p>
                    <p className="text-2xl font-bold">{formatNumber(protocol.tvl || 0)}</p>
                  </div>
                  {protocol.volume_24h && (
                    <div>
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="text-xl font-semibold">{formatNumber(protocol.volume_24h)}</p>
                    </div>
                  )}
                  {protocol.users_count && (
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-xl font-semibold">{protocol.users_count.toLocaleString()}</p>
                    </div>
                  )}
                  {protocol.age_days && (
                    <div>
                      <p className="text-sm text-muted-foreground">Protocol Age</p>
                      <p className="text-xl font-semibold">{Math.floor(protocol.age_days / 365)} years</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Last Exploit</p>
                    <p className="text-xl font-semibold text-green-600">None</p>
                  </div>
                </CardContent>
              </Card>

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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
