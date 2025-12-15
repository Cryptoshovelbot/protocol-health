'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreHistoryPoint {
  date: string;
  score_overall: number;
}

interface ScoreHistoryChartProps {
  data: ScoreHistoryPoint[];
  protocolName: string;
}

export function ScoreHistoryChart({ data, protocolName }: ScoreHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Score History</CardTitle>
          <CardDescription>Not enough historical data yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Check back in a few days to see score trends
          </p>
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map(point => ({
    score: point.score_overall,
    displayDate: new Date(point.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  const scores = data.map(d => d.score_overall);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const yMin = Math.max(0, minScore - 5);
  const yMax = Math.min(100, maxScore + 5);

  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const scoreDiff = lastScore - firstScore;
  
  let trendColor = 'text-muted-foreground';
  let trendText = 'No change';
  let trendBg = 'bg-slate-100';
  
  if (scoreDiff > 0) {
    trendColor = 'text-green-600';
    trendText = `+${scoreDiff} points`;
    trendBg = 'bg-green-50';
  } else if (scoreDiff < 0) {
    trendColor = 'text-red-600';
    trendText = `${scoreDiff} points`;
    trendBg = 'bg-red-50';
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Score History</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </div>
          <div className={`text-right px-4 py-2 rounded-lg ${trendBg}`}>
            <div className="text-3xl font-bold">{lastScore}</div>
            <div className={`text-sm font-semibold ${trendColor}`}>
              {trendText}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              domain={[yMin, yMax]}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(value: number) => [`${value}/100`, 'Score']}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
