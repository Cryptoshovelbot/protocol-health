'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Lock } from 'lucide-react';
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

interface Props {
  protocols: Protocol[];
  isAuthenticated: boolean;
}

export function ProtocolListStatic({ protocols, isAuthenticated }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');

  let filtered = protocols;

  if (searchTerm) {
    filtered = filtered.filter(protocol =>
      protocol.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedGrade !== 'All') {
    filtered = filtered.filter(protocol =>
      protocol.grade?.startsWith(selectedGrade)
    );
  }

  const grades = ['All', 'A', 'B', 'C', 'D'];
  const visibleProtocols = isAuthenticated ? filtered : filtered.slice(0, 15);
  const hiddenCount = filtered.length - visibleProtocols.length;

  const formatTVL = (tvl: number) => {
    if (!tvl) return 'N/A';
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
    return `$${(tvl / 1e3).toFixed(1)}K`;
  };

  const formatAge = (days: number) => {
    if (!days) return 'N/A';
    const years = Math.floor(days / 365);
    return years > 0 ? `${years}yr` : `${days}d`;
  };

  // Fonction pour déterminer la couleur du score selon la note
  const getScoreColor = (grade: string) => {
    if (!grade) return 'bg-gray-100 text-gray-700 border-gray-200';
    
    const letter = grade.charAt(0).toUpperCase();
    
    switch(letter) {
      case 'A':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'B':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'D':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'F':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(protocol.grade)}`}>
                      {protocol.grade || 'N/A'} {protocol.score_overall || 0}
                    </span>
                  </td>
                  <td className="p-4">{formatTVL(protocol.tvl)}</td>
                  <td className="p-4">{formatAge(protocol.age_days)}</td>
                  <td className="p-4">{protocol.chain}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      protocol.risk_level === 'Low' ? 'bg-green-100 text-green-700' :
                      protocol.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {protocol.risk_level || 'N/A'}
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
                <Button size="lg">Sign Up Free</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Login</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
