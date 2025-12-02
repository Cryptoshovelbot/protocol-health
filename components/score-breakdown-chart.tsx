'use client';

import { Progress } from '@/components/ui/progress';
import { ScoreBreakdown } from '@/types';

interface ScoreBreakdownChartProps {
  breakdown: ScoreBreakdown;
}

export function ScoreBreakdownChart({ breakdown }: ScoreBreakdownChartProps) {
  const items = [
    {
      label: 'Security',
      score: breakdown.security.score,
      max: breakdown.security.max,
      color: 'bg-blue-500',
    },
    {
      label: 'TVL Stability',
      score: breakdown.tvlStability.score,
      max: breakdown.tvlStability.max,
      color: 'bg-green-500',
    },
    {
      label: 'Decentralization',
      score: breakdown.decentralization.score,
      max: breakdown.decentralization.max,
      color: 'bg-purple-500',
    },
    {
      label: 'Financial Health',
      score: breakdown.financialHealth.score,
      max: breakdown.financialHealth.max,
      color: 'bg-yellow-500',
    },
    {
      label: 'Community',
      score: breakdown.community.score,
      max: breakdown.community.max,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-sm text-muted-foreground">
              {item.score}/{item.max}
            </span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full transition-all ${item.color}`}
              style={{ width: `${(item.score / item.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
