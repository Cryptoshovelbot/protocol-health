import { createClient } from '@supabase/supabase-js';

async function checkSlugs() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from('protocols')
    .select('slug, name')
    .order('score_overall', { ascending: false })
    .limit(50);

  console.log('Top 50 protocol slugs:\n');
  data?.forEach(p => console.log(`${p.slug.padEnd(30)} - ${p.name}`));
}

checkSlugs();
