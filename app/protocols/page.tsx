'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Loader2, Lock } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface Protocol {
  id: string;
  name: string;
  slug: string;
  score_overall: number;
  grade: string;
  tvl: number;
  risk_level: string;
  age_days: number | null;
  chain: string;
}

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProtocols() {
      try {
        const response = await fetch('/api/protocols');
        const result = await response.json();
        
        if (result.success) {
          setProtocols(result.data);
        }
      } catch (error) {
        console.error('Error fetching protocols:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProtocols();
  }, []);

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = !selectedGrade || protocol.grade.startsWith(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  const publicProtocols = filteredProtocols.slice(0, 15);
  const lockedProtocols = filteredProtocols.slice(15);

  const gradeFilters = ['A', 'B', 'C', 'D'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading protocols...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">All DeFi Protocols</h1>
            <p className="text-muted-foreground">
              Comprehensive risk analysis for {protocols.length} protocols, updated daily
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
                    {publicProtocols.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          No protocols found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      publicProtocols.map((protocol, index) => (
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
                              {protocol.grade} {protocol.score_overall}
                            </Badge>
                          </td>
                          <td className="p-4">{formatNumber(protocol.tvl)}</td>
                          <td className="p-4 text-muted-foreground">
                            {protocol.age_days ? `${Math.floor(protocol.age_days / 365)}yr` : 'N/A'}
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">{protocol.chain}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={
                              protocol.risk_level === 'Low' ? 'success' : 
                              protocol.risk_level === 'Medium' ? 'warning' : 
                              'destructive'
                            }>
                              {protocol.risk_level}
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
                      ))
                    )}
                    {lockedProtocols.length > 0 && (
                      <tr className="bg-muted/30">
                        <td colSpan={8} className="p-8 text-center">
                          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">
                            🔒 Sign Up to See {lockedProtocols.length} More Protocols
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Create a free account to access all protocols with detailed analysis
                          </p>
                          <Link href="/signup">
                            <Button size="lg">
                              Sign Up Free
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
