'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Lock, ArrowRight } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

// Mock data - in production this would come from API
const allProtocols = [
  { id: 1, name: 'Aave', slug: 'aave', score: 88, grade: 'A-', tvl: 8200000000, risk: 'Low', age: '4yr', chain: 'Multi-chain' },
  { id: 2, name: 'Uniswap', slug: 'uniswap', score: 77, grade: 'B+', tvl: 5100000000, risk: 'Medium', age: '5yr', chain: 'Ethereum' },
  { id: 3, name: 'Curve', slug: 'curve-dao', score: 72, grade: 'B', tvl: 4800000000, risk: 'Medium', age: '4yr', chain: 'Multi-chain' },
  { id: 4, name: 'MakerDAO', slug: 'makerdao', score: 85, grade: 'A', tvl: 4500000000, risk: 'Low', age: '6yr', chain: 'Ethereum' },
  { id: 5, name: 'Compound', slug: 'compound', score: 79, grade: 'B+', tvl: 3200000000, risk: 'Low', age: '5yr', chain: 'Ethereum' },
  { id: 6, name: 'Lido', slug: 'lido', score: 81, grade: 'A-', tvl: 15000000000, risk: 'Low', age: '3yr', chain: 'Ethereum' },
  { id: 7, name: 'Convex', slug: 'convex', score: 68, grade: 'B-', tvl: 2100000000, risk: 'Medium', age: '3yr', chain: 'Ethereum' },
  { id: 8, name: 'PancakeSwap', slug: 'pancakeswap', score: 64, grade: 'C+', tvl: 1800000000, risk: 'Medium', age: '3yr', chain: 'BSC' },
  { id: 9, name: 'SushiSwap', slug: 'sushiswap', score: 61, grade: 'C+', tvl: 900000000, risk: 'Medium', age: '3yr', chain: 'Multi-chain' },
  { id: 10, name: 'Balancer', slug: 'balancer', score: 70, grade: 'B', tvl: 850000000, risk: 'Medium', age: '4yr', chain: 'Multi-chain' },
  { id: 11, name: 'Yearn', slug: 'yearn', score: 66, grade: 'B-', tvl: 420000000, risk: 'Medium', age: '4yr', chain: 'Ethereum' },
  { id: 12, name: 'Synthetix', slug: 'synthetix', score: 58, grade: 'C', tvl: 380000000, risk: 'High', age: '5yr', chain: 'Ethereum' },
  { id: 13, name: 'Venus', slug: 'venus', score: 55, grade: 'C', tvl: 1200000000, risk: 'High', age: '3yr', chain: 'BSC' },
  { id: 14, name: 'JustLend', slug: 'justlend', score: 52, grade: 'C-', tvl: 3500000000, risk: 'High', age: '2yr', chain: 'Tron' },
  { id: 15, name: 'Frax', slug: 'frax', score: 73, grade: 'B', tvl: 650000000, risk: 'Medium', age: '3yr', chain: 'Ethereum' },
  { id: 16, name: 'GMX', slug: 'gmx', score: 75, grade: 'B+', tvl: 480000000, risk: 'Low', age: '2yr', chain: 'Arbitrum' },
  { id: 17, name: 'Rocket Pool', slug: 'rocketpool', score: 78, grade: 'B+', tvl: 1800000000, risk: 'Low', age: '3yr', chain: 'Ethereum' },
  { id: 18, name: 'Instadapp', slug: 'instadapp', score: 62, grade: 'C+', tvl: 1900000000, risk: 'Medium', age: '4yr', chain: 'Multi-chain' },
  { id: 19, name: 'Liquity', slug: 'liquity', score: 74, grade: 'B', tvl: 620000000, risk: 'Low', age: '3yr', chain: 'Ethereum' },
  { id: 20, name: 'Stargate', slug: 'stargate', score: 65, grade: 'B-', tvl: 350000000, risk: 'Medium', age: '2yr', chain: 'Multi-chain' },
  // Locked protocols (21-50) - only visible to Pro users
  ...Array.from({ length: 30 }, (_, i) => ({
    id: 21 + i,
    name: `Protocol ${21 + i}`,
    slug: `protocol-${21 + i}`,
    score: 50 + Math.floor(Math.random() * 30),
    grade: 'C',
    tvl: Math.floor(Math.random() * 500000000),
    risk: 'Medium',
    age: '1yr',
    chain: 'Various',
    locked: true,
  })),
];

export default function ProtocolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const filteredProtocols = allProtocols.filter(protocol => {
    const matchesSearch = protocol.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = !selectedGrade || protocol.grade.startsWith(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  const visibleProtocols = filteredProtocols.slice(0, 20);
  const lockedProtocols = filteredProtocols.slice(20);

  const gradeFilters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">All DeFi Protocols</h1>
            <p className="text-muted-foreground">
              Comprehensive risk analysis for 50+ protocols, updated every 6 hours
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search protocols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedGrade === null ? 'default' : 'outline'}
                onClick={() => setSelectedGrade(null)}
              >
                All
              </Button>
              {gradeFilters.map((grade) => (
                <Button
                  key={grade}
                  variant={selectedGrade === grade ? 'default' : 'outline'}
                  onClick={() => setSelectedGrade(grade)}
                >
                  {grade}
                </Button>
              ))}
            </div>
          </div>

          {/* Protocols Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4">#</th>
                      <th className="text-left p-4">Protocol</th>
                      <th className="text-left p-4">Score</th>
                      <th className="text-left p-4">TVL</th>
                      <th className="text-left p-4">Age</th>
                      <th className="text-left p-4">Chain</th>
                      <th className="text-left p-4">Risk</th>
                      <th className="text-left p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProtocols.map((protocol, index) => (
                      <tr key={protocol.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">{index + 1}</td>
                        <td className="p-4 font-semibold">{protocol.name}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={`
                            ${protocol.grade.startsWith('A') ? 'text-grade-a border-grade-a' : ''}
                            ${protocol.grade.startsWith('B') ? 'text-grade-b border-grade-b' : ''}
                            ${protocol.grade.startsWith('C') ? 'text-grade-c border-grade-c' : ''}
                            ${protocol.grade.startsWith('D') ? 'text-grade-d border-grade-d' : ''}
                          `}>
                            {protocol.grade} {protocol.score}
                          </Badge>
                        </td>
                        <td className="p-4">{formatNumber(protocol.tvl)}</td>
                        <td className="p-4 text-muted-foreground">{protocol.age}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{protocol.chain}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={
                            protocol.risk === 'Low' ? 'success' : 
                            protocol.risk === 'Medium' ? 'warning' : 
                            'destructive'
                          }>
                            {protocol.risk}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Link href={`/protocols/${protocol.slug}`}>
                            <Button variant="ghost" size="sm">
                              View
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {lockedProtocols.length > 0 && (
                      <tr className="bg-muted/30">
                        <td colSpan={8} className="p-8 text-center">
                          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">
                            🔒 Unlock {lockedProtocols.length} More Protocols
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Get access to all 50+ protocols with detailed analysis and real-time alerts
                          </p>
                          <Link href="/pricing">
                            <Button>
                              Upgrade to Pro - €29/month
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
