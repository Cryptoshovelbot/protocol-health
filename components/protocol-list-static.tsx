'use client';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Protocol {
  id: string;
  name: string;
  slug: string;
  score_overall: number;
  grade: string;
  risk_level: string;
  tvl: number;
  age_days: number;
  chain: string;
}

interface ProtocolListStaticProps {
  protocols: Protocol[];
  isAuthenticated: boolean;
  rankChanges?: Record<string, number>;
}

export function ProtocolListStatic({ protocols, isAuthenticated, rankChanges = {} }: ProtocolListStaticProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const visibleProtocols = isAuthenticated ? protocols : protocols.slice(0, 10);
  const filteredProtocols = visibleProtocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTVL = (tvl: number) => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(0)}M`;
    return `$${tvl.toLocaleString()}`;
  };

  const getRankChangeBadge = (protocolId: string) => {
    const change = rankChanges[protocolId];
    if (!change || change === 0) return null;
    
    if (change > 0) {
      return (
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full ml-2">
          +{change}
        </span>
      );
    }
    
    return (
      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full ml-2">
        {change}
      </span>
    );
  };

  const getGradientClass = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg';
    if (grade.startsWith('B')) return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg';
    if (grade.startsWith('C')) return 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg';
    return 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg';
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Protocol Risk Ratings</h1>
            <p className="text-muted-foreground">
              Real-time safety scores for {protocols.length} DeFi protocols
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredProtocols.map((protocol, index) => (
            <Link
              key={protocol.id}
              href={`/protocols/${protocol.slug}`}
              className="block"
            >
              <div className="bg-card rounded-lg border-2 p-5 hover:border-primary hover:shadow-xl transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-bold text-lg">{protocol.name}</h3>
                        {getRankChangeBadge(protocol.id)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{protocol.chain}</span>
                        <span>•</span>
                        <span>{formatTVL(protocol.tvl)} TVL</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full font-bold text-lg ${getGradientClass(protocol.grade)}`}>
                        {protocol.grade}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {protocol.score_overall}/100 • {protocol.risk_level} Risk
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!isAuthenticated && protocols.length > 10 && (
          <div className="mt-8 text-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border-2">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Unlock Full Protocol List
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Sign up to view all {protocols.length} protocols with detailed risk analysis
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl transition-all duration-200 hover:scale-105">Sign Up Free</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
