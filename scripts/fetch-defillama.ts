import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface DefiLlamaProtocol {
  id: string;
  name: string;
  symbol: string;
  category: string;
  chains: string[];
  chain: string;
  tvl: number;
  slug: string;
  logo?: string;
  url?: string;
  listedAt?: number;
  chainTvls?: Record<string, number>;
}

function calculateScore(protocol: DefiLlamaProtocol): {
  score: number;
  grade: string;
  risk: string;
} {
  let score = 50;

  if (protocol.tvl > 5000000000) score += 25;
  else if (protocol.tvl > 1000000000) score += 20;
  else if (protocol.tvl > 500000000) score += 15;
  else if (protocol.tvl > 100000000) score += 10;
  else score += 5;

  if (protocol.listedAt) {
    const ageInDays = (Date.now() / 1000 - protocol.listedAt) / 86400;
    if (ageInDays > 1000) score += 15;
    else if (ageInDays > 500) score += 10;
    else if (ageInDays > 200) score += 5;
  }

  if (protocol.chains && protocol.chains.length > 1) {
    score += 10;
  }

  let grade = 'C';
  let risk = 'High';

  if (score >= 85) {
    grade = 'A';
    risk = 'Low';
  } else if (score >= 80) {
    grade = 'A-';
    risk = 'Low';
  } else if (score >= 75) {
    grade = 'B+';
    risk = 'Low';
  } else if (score >= 70) {
    grade = 'B';
    risk = 'Medium';
  } else if (score >= 65) {
    grade = 'B-';
    risk = 'Medium';
  } else if (score >= 60) {
    grade = 'C+';
    risk = 'Medium';
  }

  return { score, grade, risk };
}

async function fetchAndStoreProtocols() {
  console.log('🔍 Fetching protocols from DeFiLlama...');

  try {
    const response = await fetch('https://api.llama.fi/protocols');
    
    if (!response.ok) {
      throw new Error(`DeFiLlama API error: ${response.status}`);
    }

    const protocols: DefiLlamaProtocol[] = await response.json();
    
    const topProtocols = protocols
      .filter(p => p.tvl > 50000000)
      .sort((a, b) => b.tvl - a.tvl)
      .slice(0, 50);

    console.log(`📊 Found ${topProtocols.length} protocols to process`);

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const protocol of topProtocols) {
      try {
        const { score, grade, risk } = calculateScore(protocol);
        
        const chain = protocol.chains && protocol.chains.length > 1 
          ? 'Multi-chain' 
          : protocol.chain || 'Unknown';

        const ageInDays = protocol.listedAt 
          ? Math.floor((Date.now() / 1000 - protocol.listedAt) / 86400)
          : null;

        const protocolData = {
          name: protocol.name,
          slug: protocol.slug,
          logo_url: protocol.logo || null,
          website: protocol.url || null,
          chain: chain,
          tvl: Math.floor(protocol.tvl),
          volume_24h: 0,
          age_days: ageInDays,
          score_overall: score,
          grade: grade,
          risk_level: risk,
          last_updated: new Date().toISOString(),
        };

        const { data: existing } = await supabase
          .from('protocols')
          .select('id')
          .eq('slug', protocol.slug)
          .single();

        if (existing) {
          const { error } = await supabase
            .from('protocols')
            .update(protocolData)
            .eq('slug', protocol.slug);

          if (error) throw error;
          updated++;
          console.log(`✅ Updated: ${protocol.name}`);
        } else {
          const { error } = await supabase
            .from('protocols')
            .insert(protocolData);

          if (error) throw error;
          inserted++;
          console.log(`✨ Inserted: ${protocol.name}`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error processing ${protocol.name}:`, error);
      }
    }

    console.log('\n🎉 Done!');
    console.log(`✨ Inserted: ${inserted}`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Errors: ${errors}`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

fetchAndStoreProtocols();
