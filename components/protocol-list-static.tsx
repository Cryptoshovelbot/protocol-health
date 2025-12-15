'use client';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Lock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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
  const [showLocked, setShowLocked] = useState(false);

  const visibleProtocols = isAuthenticated ? protocols : protocols.slice(0, 10);
  const filteredProtocols = visibleProtocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTVL = (tvl: number) => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(0)}M`;
    return `$${tvl.toLocaleString()}`;
  };

  const getRankChangeDisplay = (protocolId: string) => {
    const change = rankChanges[protocolId];
    if (!change || change === 0) {
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Minus className="h-3 w-3" />
          <span className="text-xs">--</span>
        </div>
      );
    }
    
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-3 w-3" />
          <span className="text-xs font-semibold">+{change}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="h-3 w-3" />
        <span className="text-xs font-semibold">{change}</span>
      </div>
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

        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Change</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Protocol</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Grade</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Risk</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">TVL</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Chain</th>
                </tr>
              </thead>
              <tbody>
                {filteredProtocols.map((protocol, index) => (
                  <tr
                    key={protocol.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {getRankChangeDisplay(protocol.id)}
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/protocols/${protocol.slug}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {protocol.name}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          protocol.grade.startsWith('A')
                            ? 'bg-green-100 text-green-800'
                            : protocol.grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-800'
                            : protocol.grade.startsWith('C')
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {protocol.grade}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">
                        {protocol.risk_level}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium">
                        {formatTVL(protocol.tvl)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">
                        {protocol.chain}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isAuthenticated && protocols.length > 10 && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Unlock Full Protocol List
                </h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Sign up to view all {protocols.length} protocols with detailed
                  risk analysis
                </p>
                <Link href="/signup">
                  <Button size="lg">Sign Up Free</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
