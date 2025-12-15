import { createClient } from '@supabase/supabase-js';

export async function getRankChanges() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Get today's ranks
  const { data: todayData } = await supabase
    .from('protocol_history')
    .select('protocol_id, rank')
    .eq('date', today);

  // Get yesterday's ranks
  const { data: yesterdayData } = await supabase
    .from('protocol_history')
    .select('protocol_id, rank')
    .eq('date', yesterday);

  if (!todayData || !yesterdayData) return {};

  const rankChanges: Record<string, number> = {};

  todayData.forEach((today) => {
    const yesterday = yesterdayData.find(y => y.protocol_id === today.protocol_id);
    if (yesterday && yesterday.rank && today.rank) {
      rankChanges[today.protocol_id] = yesterday.rank - today.rank; // Positive = moved up
    }
  });

  return rankChanges;
}
