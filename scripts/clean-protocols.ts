import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const excludedKeywords = [
  'binance',
  'coinbase',
  'okx',
  'bitfinex',
  'bybit',
  'robinhood',
  'gemini',
  'bitget',
  'gate',
  'htx',
  'mexc',
  'deribit',
  'kucoin',
  'crypto-com',
  'bitmex',
  'bitstamp',
  'cex',
  'bridge',
  'wbtc',
  'staked eth',
  'bitcoin',
  'usdt0',
  'tether gold',
];

async function cleanProtocols() {
  console.log('🧹 Starting protocol cleanup...\n');

  try {
    const { data: protocols, error } = await supabase
      .from('protocols')
      .select('*');

    if (error) throw error;

    console.log(`📊 Found ${protocols.length} protocols in database\n`);

    let deleted = 0;
    const toDelete: string[] = [];

    for (const protocol of protocols) {
      const name = protocol.name.toLowerCase();
      const slug = protocol.slug.toLowerCase();
      
      const shouldExclude = excludedKeywords.some(keyword => 
        name.includes(keyword) || slug.includes(keyword)
      );

      if (shouldExclude) {
        toDelete.push(protocol.id);
        console.log(`❌ Will delete: ${protocol.name} (${protocol.slug})`);
      } else {
        console.log(`✅ Keep: ${protocol.name} (${protocol.slug})`);
      }
    }

    console.log(`\n📋 Summary:`);
    console.log(`   Total protocols: ${protocols.length}`);
    console.log(`   To delete: ${toDelete.length}`);
    console.log(`   To keep: ${protocols.length - toDelete.length}`);

    console.log('\n⚠️  This will DELETE the protocols listed above.');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    if (toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('protocols')
        .delete()
        .in('id', toDelete);

      if (deleteError) throw deleteError;

      console.log(`\n✨ Successfully deleted ${toDelete.length} protocols!`);
    } else {
      console.log('\n✨ No protocols to delete!');
    }

    const { data: remaining, error: countError } = await supabase
      .from('protocols')
      .select('name, slug')
      .order('score_overall', { ascending: false });

    if (!countError && remaining) {
      console.log(`\n🎉 Final list (${remaining.length} protocols):`);
      remaining.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} (${p.slug})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanProtocols();
