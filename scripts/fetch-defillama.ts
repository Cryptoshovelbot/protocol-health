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
}

function calculateScores(protocol: DefiLlamaProtocol) {
  let security = 15;
  const ageInDays = protocol.listedAt ? Math.floor((Date.now() / 1000 - protocol.listedAt) / 86400) : 0;
  if (ageInDays > 1000) security += 10;
  else if (ageInDays > 500) security += 7;
  else if (ageInDays > 200) security += 4;
  if (protocol.tvl > 1000000000) security += 5;
  
  let tvlStability = 10;
  if (protocol.tvl > 5000000000) tvlStability += 10;
  else if (protocol.tvl > 1000000000) tvlStability += 7;
  else if (protocol.tvl > 500000000) tvlStability += 5;
  else if (protocol.tvl > 100000000) tvlStability += 3;
  
  let decentralization = 10;
  if (protocol.chains && protocol.chains.length > 3) decentralization += 10;
  else if (protocol.chains && protocol.chains.length > 1) decentralization += 5;
  
  let financial = 10;
  if (protocol.tvl > 5000000000) financial += 10;
  else if (protocol.tvl > 1000000000) financial += 7;
  else if (protocol.tvl > 500000000) financial += 5;
  else if (protocol.tvl > 100000000) financial += 3;
  
  let community = 5;
  if (ageInDays > 500) community += 3;
  if (protocol.chains && protocol.chains.length > 1) community += 2;
  
  const total = security + tvlStability + decentralization + financial + community;
  let grade = 'F';
  if (total >= 90) grade = 'A';
  else if (total >= 80) grade = 'A-';
  else if (total >= 70) grade = 'B';
  else if (total >= 60) grade = 'C';
  else if (total >= 50) grade = 'D';
  
  let risk = 'High';
  if (total >= 80) risk = 'Low';
  else if (total >= 60) risk = 'Medium';
  
  return { score_overall: total, score_security: security, score_tvl_stability: tvlStability, score_decentralization: decentralization, score_financial: financial, score_community: community, grade, risk };
}

async function fetchProtocols() {
  try {
    console.log('🔍 Fetching protocols from DeFiLlama...');
    const response = await fetch(`${DEFILLAMA_API}/protocols`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const protocols: DefiLlamaProtocol[] = await response.json();
    const topProtocols = protocols.sort((a, b) => b.tvl - a.tvl).slice(0, 50);
    console.log(`📊 Found ${topProtocols.length} protocols to process`);
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    let inserted = 0, updated = 0, errors = 0;
    for (const protocol of topProtocols) {
      try {
        const scores = calculateScores(protocol);
        const protocolData = {
          name: protocol.name, slug: protocol.slug, logo_url: protocol.logo || null, website: protocol.url || null,
          chain: protocol.chains && protocol.chains.length > 1 ? 'Multi-chain' : protocol.chain || 'Unknown',
          tvl: Math.floor(protocol.tvl), volume_24h: 0,
          age_days: protocol.listedAt ? Math.floor((Date.now() / 1000 - protocol.listedAt) / 86400) : null,
          score_overall: scores.score_overall, score_security: scores.score_security, score_tvl_stability: scores.score_tvl_stability,
          score_decentralization: scores.score_decentralization, score_financial: scores.score_financial, score_community: scores.score_community,
          grade: scores.grade, risk_level: scores.risk,
        };
        const { error } = await supabase.from('protocols').upsert(protocolData, { onConflict: 'slug' });
        if (error) { console.error(`❌ Error processing ${protocol.name}:`, error); errors++; }
        else { console.log(`✅ Updated: ${protocol.name}`); updated++; }
      } catch (error) { console.error(`❌ Error processing ${protocol.name}:`, error); errors++; }
    }
    console.log('\n🎉 Done!'); console.log(`✨ Inserted: ${inserted}`); console.log(`✅ Updated: ${updated}`); console.log(`❌ Errors: ${errors}`);
  } catch (error) { console.error('Failed to fetch protocols:', error); process.exit(1); }
}

fetchProtocols();
