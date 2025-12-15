import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreBreakdownChart } from '@/components/score-breakdown-chart';
import { SecurityHistory } from '@/components/security-history';
import { ScoreHistoryChart } from '@/components/score-history-chart';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';

async function getProtocolData(slug: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: protocol, error } = await supabase
      .from('protocols')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !protocol) {
      return null;
    }

    const { data: incidents } = await supabase
      .from('protocol_exploits')
      .select('exploit_date, amount_lost_usd, description, source_url')
      .eq('protocol_slug', slug)
      .order('exploit_date', { ascending: false });

    const { data: history } = await supabase
      .from('protocol_history')
      .select('date, score_overall')
      .eq('protocol_id', protocol.id)
      .order('date', { ascending: true })
      .limit(7);

    return { 
      ...protocol, 
      security_incidents: incidents || [],
      score_history: history || []
    };
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
      score: protocol.score_security || 0, 
      max: 35,
      details: {
        hasAudits: true,
        auditCount: protocol.audit_count || 0,
        age: protocol.age_days || 0,
        exploitHistory: protocol.security_incidents?.length || 0
      }
    },
    tvlStability: { 
      score: protocol.score_tvl_stability || 0, 
      max: 20,
      volatility: 15
    },
    decentralization: { 
      score: protocol.score_decentralization || 0, 
      max: 20,
      details: {
        tokenDistribution: 7,
        governanceActivity: 7
      }
    },
    financialHealth: { 
      score: protocol.score_financial || 0, 
      max: 15,
      details: {
        revenueTrend: 8,
        treasurySize: 7
      }
    },
    community: { 
      score: protocol.score_community || 0, 
      max: 10,
      details: {
        githubActivity: 4,
        socialEngagement: 4
      }
    },
  };

  const strengths: string[] = [];
  if (protocol.age_days > 1000) strengths.push(`Battle-tested (${Math.floor(protocol.age_days / 365)}+ years)`);
  else if (protocol.age_days > 500) strengths.push('Established protocol');
  if (protocol.tvl > 5000000000) strengths.push('Massive liquidity ($5B+ TVL)');
  else if (protocol.tvl > 1000000000) strengths.push('High Total Value Locked');
  if (breakdown.security.score >= 25) strengths.push('Strong security posture');
  else if (breakdown.security.score >= 20) strengths.push('Regular security audits');
  if (breakdown.decentralization.score >= 15) {
    if (protocol.chain === 'Multi-chain') strengths.push('Multi-chain deployment');
    else strengths.push(`Deployed on ${protocol.chain}`);
  }
  if (breakdown.community.score >= 8) strengths.push('Active community engagement');
  if (protocol.security_incidents?.length === 0) strengths.push('No security incidents');
  if (strengths.length < 3) strengths.push('Regular security monitoring');
  
  const considerations: string[] = [];
  if (breakdown.security.score < 20) considerations.push('Limited audit history');
  if (protocol.age_days < 365) considerations.push('Relatively new protocol');
  if (breakdown.tvlStability.score < 15) considerations.push('TVL volatility concerns');
  if (breakdown.decentralization.score < 12) considerations.push('Centralization risks');
  if (protocol.security_incidents?.length > 0) considerations.push('Past security incidents');
  considerations.push('Smart contract risks', 'Market volatility exposure', 'Regulatory uncertainty');
  const finalConsiderations = considerations.slice(0, 5);

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
                <h1 className="text-4xl font-bold mb-2">{protocol.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Overall Score:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-lg px-3 py-1 font-bold ${
                        protocol.grade.startsWith('A') ? 'text-green-700 border-green-700' : 
                        protocol.grade.startsWith('B') ? 'text-blue-700 border-blue-700' : 
                        protocol.grade.startsWith('C') ? 'text-orange-600 border-orange-600' :
                        'text-red-600 border-red-600'
                      }`}
                    >
                      {protocol.grade} ({protocol.score_overall}/100)
                    </Badge>
                  </div>
                  <Badge variant={protocol.risk_level === 'Low' ? 'success' : protocol.risk_level === 'Medium' ? 'warning' : 'destructive'}>
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
                  <CardDescription>Detailed analysis across 5 key dimensions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScoreBreakdownChart breakdown={breakdown} />
                </CardContent>
              </Card>

              <ScoreHistoryChart data={protocol.score_history} protocolName={protocol.name} />

              <SecurityHistory incidents={protocol.security_incidents} protocolName={protocol.name} />

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
                          <span className="text-green-600">•</span>
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
                      {finalConsiderations.map((consideration: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600">•</span>
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
                  {protocol.age_days && (
                    <div>
                      <p className="text-sm text-muted-foreground">Protocol Age</p>
                      <p className="text-xl font-semibold">{Math.floor(protocol.age_days / 365)} years</p>
                    </div>
                  )}
                  {protocol.audit_count !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Security Audits</p>
                      <p className="text-xl font-semibold">{protocol.audit_count || 'Not disclosed'}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Security Incidents</p>
                    <p className={`text-xl font-semibold ${protocol.security_incidents?.length === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {protocol.security_incidents?.length === 0 ? 'None' : protocol.security_incidents?.length}
                    </p>
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
                      <a href={protocol.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
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
