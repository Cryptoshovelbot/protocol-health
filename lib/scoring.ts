import { Protocol, Grade, RiskLevel, ScoreBreakdown } from '@/types';
import { fetchTVLHistory, calculateTVLVolatility, getProtocolAge } from './data-fetchers/defillama';

export function calculateScore(
  protocol: any,
  tvlHistory?: any[]
): {
  score: number;
  breakdown: ScoreBreakdown;
  grade: Grade;
  risk: RiskLevel;
} {
  const breakdown: ScoreBreakdown = {
    security: calculateSecurityScore(protocol),
    tvlStability: calculateTVLStabilityScore(protocol, tvlHistory),
    decentralization: calculateDecentralizationScore(protocol),
    financialHealth: calculateFinancialScore(protocol),
    community: calculateCommunityScore(protocol),
  };

  const totalScore = 
    breakdown.security.score +
    breakdown.tvlStability.score +
    breakdown.decentralization.score +
    breakdown.financialHealth.score +
    breakdown.community.score;

  const grade = getGrade(totalScore);
  const risk = getRiskLevel(totalScore);

  return {
    score: Math.round(totalScore),
    breakdown,
    grade,
    risk,
  };
}

function calculateSecurityScore(protocol: any): ScoreBreakdown['security'] {
  const maxScore = 30;
  let score = 0;
  
  // Has audits? (10 points)
  const hasAudits = protocol.audits === '1' || protocol.audit_links?.length > 0;
  const auditCount = protocol.audit_links?.length || 0;
  const auditScore = hasAudits ? Math.min(10, 5 + auditCount) : 0;
  
  // Age (10 points) - >1 year = 10pts, linear below
  const ageInDays = getProtocolAge(protocol.listedAt);
  const ageScore = Math.min(10, (ageInDays / 365) * 10);
  
  // Exploit history (10 points) - assuming no exploits for MVP
  const exploitCount = 0; // Would need external data source
  const exploitScore = Math.max(0, 10 - (exploitCount * 2));
  
  score = auditScore + ageScore + exploitScore;
  
  return {
    score: Math.round(score),
    max: maxScore,
    details: {
      hasAudits,
      auditCount,
      age: ageInDays,
      exploitHistory: exploitCount,
    },
  };
}

function calculateTVLStabilityScore(protocol: any, tvlHistory?: any[]): ScoreBreakdown['tvlStability'] {
  const maxScore = 20;
  let score = 0;
  
  // Calculate 90-day volatility
  const volatility = tvlHistory ? calculateTVLVolatility(tvlHistory) : 50;
  
  // Lower volatility = higher score
  // 0% volatility = 20 points, 100% volatility = 0 points
  score = Math.max(0, maxScore * (1 - volatility / 100));
  
  return {
    score: Math.round(score),
    max: maxScore,
    volatility,
  };
}

function calculateDecentralizationScore(protocol: any): ScoreBreakdown['decentralization'] {
  const maxScore = 20;
  let score = 0;
  
  // Token distribution (10 points) - simplified for MVP
  // Assume medium distribution for all
  const tokenDistributionScore = 5;
  
  // Governance activity (10 points) - simplified for MVP
  // Check if protocol has governance module
  const hasGovernance = protocol.category?.toLowerCase().includes('governance') || 
                        protocol.name.toLowerCase().includes('dao');
  const governanceScore = hasGovernance ? 7 : 3;
  
  score = tokenDistributionScore + governanceScore;
  
  return {
    score: Math.round(score),
    max: maxScore,
    details: {
      tokenDistribution: tokenDistributionScore,
      governanceActivity: governanceScore,
    },
  };
}

function calculateFinancialScore(protocol: any): ScoreBreakdown['financialHealth'] {
  const maxScore = 20;
  let score = 0;
  
  // Revenue trend (10 points) - based on TVL trend for MVP
  const tvlChange = protocol.change_7d || 0;
  const revenueTrendScore = tvlChange > 0 ? 
    Math.min(10, 5 + tvlChange / 2) : 
    Math.max(0, 5 + tvlChange / 4);
  
  // Treasury size (10 points) - based on TVL size for MVP
  const tvl = protocol.tvl || 0;
  let treasuryScore = 0;
  if (tvl > 1000000000) treasuryScore = 10; // >$1B
  else if (tvl > 500000000) treasuryScore = 8; // >$500M
  else if (tvl > 100000000) treasuryScore = 6; // >$100M
  else if (tvl > 50000000) treasuryScore = 4; // >$50M
  else if (tvl > 10000000) treasuryScore = 2; // >$10M
  
  score = revenueTrendScore + treasuryScore;
  
  return {
    score: Math.round(score),
    max: maxScore,
    details: {
      revenueTrend: revenueTrendScore,
      treasurySize: treasuryScore,
    },
  };
}

function calculateCommunityScore(protocol: any): ScoreBreakdown['community'] {
  const maxScore = 10;
  let score = 0;
  
  // GitHub activity (5 points) - simplified for MVP
  // Check if protocol has github/open source indicators
  const isOpenSource = protocol.category !== 'CEX' && 
                       !protocol.name.toLowerCase().includes('binance');
  const githubScore = isOpenSource ? 3 : 1;
  
  // Social engagement (5 points) - based on TVL rank for MVP
  const tvl = protocol.tvl || 0;
  let socialScore = 0;
  if (tvl > 1000000000) socialScore = 5; // Top tier
  else if (tvl > 100000000) socialScore = 4;
  else if (tvl > 10000000) socialScore = 3;
  else if (tvl > 1000000) socialScore = 2;
  else socialScore = 1;
  
  score = githubScore + socialScore;
  
  return {
    score: Math.round(score),
    max: maxScore,
    details: {
      githubActivity: githubScore,
      socialEngagement: socialScore,
    },
  };
}

export function getGrade(score: number): Grade {
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  if (score >= 45) return 'D+';
  if (score >= 40) return 'D';
  return 'F';
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'Low';
  if (score >= 50) return 'Medium';
  return 'High';
}

export function getGradeColor(grade: Grade): string {
  if (grade.startsWith('A')) return 'text-grade-a';
  if (grade.startsWith('B')) return 'text-grade-b';
  if (grade.startsWith('C')) return 'text-grade-c';
  if (grade.startsWith('D')) return 'text-grade-d';
  return 'text-grade-f';
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'Low': return 'text-risk-low';
    case 'Medium': return 'text-risk-medium';
    case 'High': return 'text-risk-high';
  }
}
