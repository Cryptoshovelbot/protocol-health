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
        <span className="text-xs font-semibold text-green-600 mr-2">
          +{change}
        </span>
      );
    }
    
    return (
      <span className="text-xs font-semibold text-red-600 mr-2">
        {change}
      </span>
    );
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
              <div className="bg-card rounded-lg border p-4 hover:border-primary transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-mono text-sm text-muted-foreground w-12">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getRankChangeBadge(protocol.id)}
                        <h3 className="font-semibold text-lg">{protocol.name}</h3>
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
                      <Badge 
                        variant="outline"
                        className={`text-base font-bold px-3 py-1 ${
                          protocol.grade.startsWith('A')
                            ? 'text-green-700 border-green-700'
                            : protocol.grade.startsWith('B')
                            ? 'text-blue-700 border-blue-700'
                            : protocol.grade.startsWith('C')
                            ? 'text-orange-600 border-orange-600'
                            : 'text-red-600 border-red-600'
                        }`}
                      >
                        {protocol.grade} ({protocol.score_overall})
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {protocol.risk_level} Risk
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
          <div className="mt-8 text-center py-12 px-4 bg-muted/30 rounded-lg">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Unlock Full Protocol List
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Sign up to view all {protocols.length} protocols with detailed risk analysis
            </p>
            <Link href="/signup">
              <Button size="lg">Sign Up Free</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
