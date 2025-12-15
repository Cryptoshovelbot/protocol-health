'use client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface Protocol {
  id: string;
  name: string;
  slug: string;
  score_overall: number;
  grade: string;
  risk_level: string;
  tvl: number;
  chain: string;
  logo_url?: string;
}

interface TopProtocolsPreviewProps {
  protocols: Protocol[];
}

export function TopProtocolsPreview({ protocols }: TopProtocolsPreviewProps) {
  const top10 = protocols.slice(0, 10);

  const formatTVL = (tvl: number) => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(0)}M`;
    return `$${tvl.toLocaleString()}`;
  };

  const getGradientClass = (grade: string) => {
    if (grade.startsWith('A')) return 'inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-xl shadow-xl';
    if (grade.startsWith('B')) return 'inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-xl';
    if (grade.startsWith('C')) return 'inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-xl shadow-xl';
    return 'inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-xl shadow-xl';
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            <TrendingUp className="h-4 w-4" />
            Updated Daily
          </div>
          <h2 className="text-4xl font-bold mb-4">Top 10 Safest DeFi Protocols</h2>
          <p className="text-xl text-muted-foreground">
            Highest-rated protocols based on our comprehensive risk analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {top10.map((protocol, index) => (
            <Link key={protocol.id} href={`/protocols/${protocol.slug}`}>
              <Card className="p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-2 hover:border-primary cursor-pointer bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold text-lg">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1 text-slate-900">{protocol.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>{protocol.chain}</span>
                        <span>•</span>
                        <span>{formatTVL(protocol.tvl)} TVL</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className={getGradientClass(protocol.grade)}>
                        {protocol.grade}
                      </div>
                      <div className="text-xs text-slate-600 mt-2 font-semibold">
                        {protocol.score_overall}/100
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/protocols">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              View all protocols
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
