import { createClient } from '@supabase/supabase-js';

const DEFILLAMA_API = 'https://api.llama.fi';

interface DefiLlamaProtocol {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  url?: string;
  tvl: number;
  chains?: string[];
  chain?: string;
  listedAt?: number;
  audits?: string;
  audit_links?: string[];
}

async function getExploitPenalty(slug: string, supabase: any): Promise<number> {
  const { data: exploits } = await supabase
    .from('protocol_exploits')
    .select('exploit_date, amount_lost_usd')
    .eq('protocol_slug', slug);

  if (!exploits || exploits.length === 0) return 0;

  let penalty = 0;
  const now = new Date();

  for (const exploit of exploits) {
    const exploitDate = new Date(exploit.exploit_date);
    const daysSince = (now.getTime() - exploitDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Recent exploits are worse
    if (daysSince < 365) {
      penalty += 15; // Exploited in last year: -15 points
    } else if (daysSince < 730) {
      penalty += 10; // Exploited 1-2 years ago: -10 points
    } else {
      penalty += 5; // Exploited 2+ years ago: -5 points
    }
    
    // Large exploits add extra penalty
    if (exploit.amount_lost_usd > 50000000) {
      penalty += 5; // $50M+ exploit: additional -5 points
    }
  }

  return Math.min(penalty, 25); // Max penalty: -25 points
}

function calculateScoresV2(protocol: DefiLlamaProtocol, exploitPenalty: number) {
  // SECURITY (35 points max)
  let security = 15; // Base
  
  // Age scoring (10 points max)
  const ageInDays = protocol.listedAt ? Math.floor((Date.now() / 1000 - protocol.listedAt) / 86400) : 0;
  if (ageInDays > 1000) security += 10;
  else if (ageInDays > 500) security += 7;
  else if (ageInDays > 200) security += 4;
  
  // TVL as security signal (5 points max)
  if (protocol.tvl > 1000000000) security += 5;
  
  // Audit count (10 points max)
  const auditCount = protocol.audit_links ? protocol.audit_links.length : 0;
  if (auditCount >= 5) security += 10;
  else if (auditCount >= 3) security += 7;
  else if (auditCount >= 1) security += 4;
  
  // Apply exploit penalty
  security -= exploitPenalty;
  security = Math.max(0, security); // Can't go negative
  
  // TVL STABILITY (20 points max)
  let tvlStability = 10;
  if (protocol.tvl > 5000000000) tvlStability += 10;
  else if (protocol.tvl > 1000000000) tvlStability += 7;
  else if (protocol.tvl > 500000000) tvlStability += 5;
  else if (protocol.tvl > 100000000) tvlStability += 3;
  if (protocol.tvl > 10000000000) tvlStability = Math.min(20, tvlStability + 2);
  
  // DECENTRALIZATION (20 points max)
  let decentralization = 10;
  if (protocol.chains && protocol.chains.length >= 5) decentralization += 10;
  else if (protocol.chains && protocol.chains.length >= 3) decentralization += 7;
  else if (protocol.chains && protocol.chains.length >= 2) decentralization += 5;
  
  // FINANCIAL HEALTH (15 points max)
  let financial = 8;
  if (protocol.tvl > 5000000000) financial += 7;
  else if (protocol.tvl > 1000000000) financial += 5;
  else if (protocol.tvl > 500000000) financial += 3;
  else if (protocol.tvl > 100000000) financial += 2;
  
  // COMMUNITY (10 points max)
  let community = 5;
  if (ageInDays > 500) community += 3;
  if (protocol.chains && protocol.chains.length > 1) community += 2;
  
  // TOTAL SCORE
  const total = security + tvlStability + decentralization + financial + community;
  
  // GRADE
  let grade = 'F';
  if (total >= 90) grade = 'A';
  else if (total >= 85) grade = 'A-';
  else if (total >= 75) grade = 'B+';
  else if (total >= 70) grade = 'B';
  else if (total >= 65) grade = 'B-';
  else if (total >= 60) grade = 'C+';
  else if (total >= 55) grade = 'C';
  else if (total >= 50) grade = 'D';
  
  // RISK LEVEL
  let risk = 'High';
  if (total >= 85) risk = 'Low';
  else if (total >= 70) risk = 'Medium';
  
  return { 
    score_overall: total, 
    score_security: security, 
    score_tvl_stability: tvlStability, 
    score_decentralization: decentralization, 
    score_financial: financial, 
    score_community: community, 
    audit_count: auditCount,
    grade, 
    risk 
  };
}

async function fetchProtocols() {
  try {
    console.log('🔍 Fetching protocols from DeFiLlama (Scoring v2.1)...');
    const response = await fetch(`${DEFILLAMA_API}/protocols`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const protocols: DefiLlamaProtocol[] = await response.json();
    const topProtocols = protocols.sort((a, b) => b.tvl - a.tvl).slice(0, 50);
    
    console.log(`📊 Found ${topProtocols.length} protocols to process`);
    console.log('🆕 Scoring v2.1: Exploit history integration');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    let updated = 0, errors = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (const protocol of topProtocols) {
      try {
        const exploitPenalty = await getExploitPenalty(protocol.slug, supabase);
        const scores = calculateScoresV2(protocol, exploitPenalty);
        
        const protocolData = {
          name: protocol.name, 
          slug: protocol.slug, 
          logo_url: protocol.logo || null, 
          website: protocol.url || null,
          chain: protocol.chains && protocol.chains.length > 1 ? 'Multi-chain' : protocol.chain || 'Unknown',
          tvl: Math.floor(protocol.tvl), 
          volume_24h: 0,
          age_days: protocol.listedAt ? Math.floor((Date.now() / 1000 - protocol.listedAt) / 86400) : null,
          score_overall: scores.score_overall, 
          score_security: scores.score_security, 
          score_tvl_stability: scores.score_tvl_stability,
          score_decentralization: scores.score_decentralization, 
          score_financial: scores.score_financial, 
          score_community: scores.score_community,
          audit_count: scores.audit_count,
          grade: scores.grade, 
          risk_level: scores.risk,
        };
        
        const { data: upserted, error } = await supabase
          .from('protocols')
          .upsert(protocolData, { onConflict: 'slug' })
          .select('id')
          .single();
        
        if (error) { 
          console.error(`❌ Error: ${protocol.name}`); 
          errors++; 
        } else { 
          const exploitFlag = exploitPenalty > 0 ? ` ⚠️ (-${exploitPenalty} exploit penalty)` : '';
          console.log(`✅ ${protocol.name}: ${scores.grade} (${scores.score_overall})${exploitFlag}`);
          updated++;
          
          if (upserted?.id) {
            await supabase.from('protocol_history').insert({
              protocol_id: upserted.id, 
              date: today, 
              score_overall: scores.score_overall,
              score_security: scores.score_security, 
              score_tvl_stability: scores.score_tvl_stability,
              score_decentralization: scores.score_decentralization, 
              score_financial: scores.score_financial,
              score_community: scores.score_community, 
              tvl: Math.floor(protocol.tvl), 
              grade: scores.grade,
            });
          }
        }
      } catch (error) { 
        console.error(`Error processing ${protocol.name}:`, error);
        errors++; 
      }
    }
    
    // Calculate ranks
    const { data: allProtocols } = await supabase
      .from('protocols')
      .select('id, score_overall')
      .order('score_overall', { ascending: false });
      
    if (allProtocols) {
      for (let i = 0; i < allProtocols.length; i++) {
        await supabase.from('protocol_history')
          .update({ rank: i + 1 })
          .eq('protocol_id', allProtocols[i].id)
          .eq('date', today);
      }
    }
    
    console.log(`\n🎉 Scoring v2.1 Complete!`);
    console.log(`✅ Updated: ${updated}, ❌ Errors: ${errors}`);
  } catch (error) { 
    console.error('Failed:', error); 
    process.exit(1); 
  }
}

fetchProtocols();
