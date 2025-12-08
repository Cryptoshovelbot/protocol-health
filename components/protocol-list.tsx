'use client';

import { useState, useEffect } from 'react';
import { ProtocolCard } from './protocol-card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Lock } from 'lucide-react';
import Link from 'next/link';

interface Protocol {
  id: number;
  name: string;
  slug: string;
  overall_score: number;
  overall_grade: string;
  risk_level: string;
  tvl: string;
  age: string;
  chain: string;
}

interface ProtocolListProps {
  isAuthenticated: boolean;
}

export function ProtocolList({ isAuthenticated }: ProtocolListProps) {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [filteredProtocols, setFilteredProtocols] = useState<Protocol[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProtocols() {
      try {
        const response = await fetch('/api/protocols');
        const data = await response.json();
        setProtocols(data);
        setFilteredProtocols(data);
      } catch (error) {
        console.error('Error fetching protocols:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProtocols();
  }, []);

  useEffect(() => {
    let filtered = protocols;

    if (searchTerm) {
      filtered = filtered.filter(protocol =>
        protocol.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGrade !== 'All') {
      filtered = filtered.filter(protocol =>
        protocol.overall_grade.startsWith(selectedGrade)
      );
    }

    setFilteredProtocols(filtered);
  }, [searchTerm, selectedGrade, protocols]);

  const grades = ['All', 'A', 'B', 'C', 'D'];

  // Nombre de protocoles à afficher
  const visibleProtocols = isAuthenticated ? filteredProtocols : filteredProtocols.slice(0, 15);
  const hiddenCount = filteredProtocols.length - visibleProtocols.length;

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">All DeFi Protocols</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Comprehensive risk analysis for {protocols.length} protocols, updated daily
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search protocols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {grades.map((grade) => (
              <Button
                key={grade}
                variant={selectedGrade === grade ? 'default' : 'outline'}
                onClick={() => setSelectedGrade(grade)}
                size="sm"
              >
                {grade}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">#</th>
                <th className="text-left p-4 font-semibold">Protocol</th>
                <th className="text-left p-4 font-semibold">Score</th>
                <th className="text-left p-4 font-semibold">TVL</th>
                <th className="text-left p-4 font-semibold">Age</th>
                <th className="text-left p-4 font-semibold">Chain</th>
                <th className="text-left p-4 font-semibold">Risk</th>
                <th className="text-left p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {visibleProtocols.map((protocol, index) => (
                <tr key={protocol.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium">{protocol.name}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                      {protocol.overall_grade} {protocol.overall_score}
                    </span>
                  </td>
                  <td className="p-4">{protocol.tvl}</td>
                  <td className="p-4">{protocol.age}</td>
                  <td className="p-4">{protocol.chain}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      protocol.risk_level === 'Low' ? 'bg-green-100 text-green-700' :
                      protocol.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {protocol.risk_level}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link 
                      href={`/protocols/${protocol.slug}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isAuthenticated && hiddenCount > 0 && (
          <div className="mt-12 p-8 border-2 border-dashed rounded-lg text-center bg-muted/30">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-2">
              🔒 Sign Up to See {hiddenCount} More Protocols
            </h3>
            <p className="text-muted-foreground mb-6">
              Create a free account to access all protocols with detailed analysis
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
