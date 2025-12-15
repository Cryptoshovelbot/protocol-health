import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface SecurityIncident {
  exploit_date: string;
  amount_lost_usd: number;
  description: string;
  source_url: string | null;
}

interface SecurityHistoryProps {
  incidents: SecurityIncident[];
  protocolName: string;
}

export function SecurityHistory({ incidents, protocolName }: SecurityHistoryProps) {
  if (!incidents || incidents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle>Security History</CardTitle>
          </div>
          <CardDescription>No security incidents reported</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Clean Security Record</p>
              <p className="text-sm text-green-700">
                {protocolName} has no recorded security incidents or exploits
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return 'No funds lost';
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B lost`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M lost`;
    return `$${amount.toLocaleString()} lost`;
  };

  const getSeverityColor = (amount: number) => {
    if (amount === 0) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (amount > 50000000) return 'bg-red-100 text-red-800 border-red-200';
    if (amount > 10000000) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const totalLost = incidents.reduce((sum, inc) => sum + inc.amount_lost_usd, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle>Security History</CardTitle>
          </div>
          <Badge variant="destructive" className="text-sm">
            {incidents.length} incident{incidents.length > 1 ? 's' : ''}
          </Badge>
        </div>
        <CardDescription>
          Total losses: {formatAmount(totalLost)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents
            .sort((a, b) => new Date(b.exploit_date).getTime() - new Date(a.exploit_date).getTime())
            .map((incident, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(incident.amount_lost_usd)}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-semibold">
                        {formatDate(incident.exploit_date)}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{incident.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {formatAmount(incident.amount_lost_usd)}
                    </Badge>
                  </div>
                  {incident.source_url && (
                    
                      href={incident.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 hover:underline flex-shrink-0"
                    >
                      Source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Note:</strong> Security incidents impact the overall protocol score. 
            Recent incidents have a larger penalty than historical ones.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
