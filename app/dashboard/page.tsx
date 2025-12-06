import { redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createSupabaseServerClient } from '@/lib/supabase';
import { ArrowRight, Shield, Bell, Star } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  
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
            <form action="/api/auth/signout" method="post">
              <Button variant="outline" type="submit">Sign Out</Button>
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Welcome! 🎉
                </CardTitle>
                <CardDescription>Your account is now active</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Email:</p>
                <p className="font-medium">{user.email}</p>
              </CardContent>
            </Card>

            {/* Protocol Health Card */}
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

            {/* Next Steps Card */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Configure your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Account created</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">Explore protocols (coming soon)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">Set up watchlist (coming soon)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">Configure alerts (coming soon)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>View All Protocols</CardTitle>
                    <CardDescription>
                      Access risk scores for 30 DeFi protocols
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/protocols">
                  <Button className="w-full" size="lg">
                    Explore Protocols
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <Star className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle>Back to Homepage</CardTitle>
                    <CardDescription>
                      Learn more about Protocol Health
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/">
                  <Button variant="outline" className="w-full" size="lg">
                    Go to Homepage
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Features */}
          <Card className="mt-6 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Coming Soon
              </CardTitle>
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
