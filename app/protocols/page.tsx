import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProtocolListServer } from '@/components/protocol-list-server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProtocolListServer userEmail={user?.email} />
      </main>
      <Footer />
    </div>
  );
}
