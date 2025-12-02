import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreBadge } from '@/components/score-badge';
import { formatNumber } from '@/lib/utils';
import { Protocol } from '@/types';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface ProtocolCardProps {
  protocol: Protocol;
  rank?: number;
}

export function ProtocolCard({ protocol, rank }: ProtocolCardProps) {
  return (
    <Link href={`/protocols/${protocol.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            {rank && (
              <span className="text-2xl font-bold text-muted-foreground">
                #{rank}
              </span>
            )}
            {protocol.logo_url && (
              <Image
                src={protocol.logo_url}
                alt={protocol.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <CardTitle className="text-xl">{protocol.name}</CardTitle>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value Locked</p>
              <p className="text-2xl font-bold">{formatNumber(protocol.tvl)}</p>
            </div>
            <ScoreBadge 
              score={protocol.score_overall} 
              grade={protocol.grade}
              risk={protocol.risk_level}
            />
          </div>
          {protocol.volume_24h && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>24h Volume:</span>
              <span className="font-medium text-foreground">
                {formatNumber(protocol.volume_24h)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
