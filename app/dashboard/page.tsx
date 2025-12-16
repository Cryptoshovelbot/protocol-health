import { redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Bell, Star } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function DashboardPage() {
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
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Dashboard</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Welcome! 🎉
                </CardTitle>
                <CardDescription>Your account is now active</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Email:</p>
                <p className="font-mono text-sm">{user.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Protocol Health</CardTitle>
                <CardDescription>DeFi Risk Scoring Platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your dashboard is being built. Stay tuned for protocol ratings and risk scores!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Configure your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Account created
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Explore protocols (coming soon)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Set up watchlist (coming soon)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Configure alerts (coming soon)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>View All Protocols</CardTitle>
                    <CardDescription>Access risk scores for 30 DeFi protocols</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/protocols">
                  <Button className="w-full" variant="outline">
                    Explore Protocols <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>Back to Homepage</CardTitle>
                    <CardDescription>Learn more about Protocol Health</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/">
                  <Button className="w-full" variant="outline">
                    Go to Homepage <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Coming Soon</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Watchlist</h4>
                  <p className="text-sm text-muted-foreground">
                    Track your favorite protocols and get real-time updates
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Risk Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when risk scores change
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Portfolio Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyze the overall risk of your DeFi portfolio
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
