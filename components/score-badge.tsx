import { Badge } from '@/components/ui/badge';
import { getGradeColor, getRiskColor } from '@/lib/scoring';
import { Grade, RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  grade: Grade;
  risk?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export function ScoreBadge({ 
  score, 
  grade, 
  risk,
  size = 'md',
  showScore = true 
}: ScoreBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-lg px-4 py-2 font-bold',
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        className={cn(
          getGradeColor(grade),
          sizeClasses[size],
          'font-mono'
        )}
        variant="outline"
      >
        {grade} {showScore && `${score}`}
      </Badge>
      {risk && (
        <span className={cn(
          getRiskColor(risk),
          'text-xs font-medium'
        )}>
          {risk} Risk
        </span>
      )}
    </div>
  );
}
