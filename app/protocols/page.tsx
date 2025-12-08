import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProtocolListStatic } from '@/components/protocol-list-static';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProtocolsPage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const { data: { user } } = await supabase.auth.getUser();

  // Charger les protocoles côté serveur
  const supabaseData = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: protocols, error } = await supabaseData
    .from('protocols')
    .select('*')
    .order('score_overall', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Supabase error:', error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProtocolListStatic 
          protocols={protocols || []} 
          isAuthenticated={!!user} 
        />
      </main>
      <Footer />
    </div>
  );
}
