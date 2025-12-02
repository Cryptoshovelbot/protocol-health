export interface Protocol {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website?: string;
  
  // On-chain data
  chain: string;
  contract_address?: string;
  
  // Metrics
  tvl: number;
  volume_24h?: number;
  users_count?: number;
  age_days: number;
  
  // Scores
  score_overall: number;
  score_security: number;
  score_tvl_stability: number;
  score_decentralization: number;
  score_financial: number;
  score_community: number;
  grade: Grade;
  risk_level: RiskLevel;
  
  // Metadata
  last_updated: Date;
  created_at: Date;
}

export type Grade = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Tier = 'free' | 'pro';

export interface UserProfile {
  id: string;
  tier: Tier;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_subscription_status?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  protocol_id: string;
  created_at: Date;
  protocol?: Protocol;
}

export interface ScoreHistory {
  id: string;
  protocol_id: string;
  score_overall: number;
  grade: Grade;
  recorded_at: Date;
}

export interface Alert {
  id: string;
  user_id: string;
  protocol_id: string;
  type: 'score_drop' | 'score_rise' | 'exploit_detected';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  is_read: boolean;
  created_at: Date;
  protocol?: Protocol;
}

export interface ScoreBreakdown {
  security: {
    score: number;
    max: number;
    details: {
      hasAudits: boolean;
      auditCount: number;
      age: number;
      exploitHistory: number;
    };
  };
  tvlStability: {
    score: number;
    max: number;
    volatility: number;
  };
  decentralization: {
    score: number;
    max: number;
    details: {
      tokenDistribution: number;
      governanceActivity: number;
    };
  };
  financialHealth: {
    score: number;
    max: number;
    details: {
      revenueTrend: number;
      treasurySize: number;
    };
  };
  community: {
    score: number;
    max: number;
    details: {
      githubActivity: number;
      socialEngagement: number;
    };
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
