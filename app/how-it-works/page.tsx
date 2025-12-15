import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Users, DollarSign, Heart, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">How Protocol Health Works</h1>
            <p className="text-xl text-muted-foreground">
              Understanding our S&P-style rating system for DeFi protocols
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>The Rating System</CardTitle>
              <CardDescription>
                Every protocol is scored across 5 key dimensions, with a maximum total score of 100 points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Grade A (90-100)</span>
                  <Badge className="bg-grade-a text-white">Exceptional Safety</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Grade B (70-89)</span>
                  <Badge className="bg-grade-b text-white">Strong Performance</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Grade C (60-69)</span>
                  <Badge className="bg-grade-c text-white">Acceptable Risk</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Grade D (50-59)</span>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Grade F (0-49)</span>
                  <Badge variant="destructive">Very High Risk</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 mb-12">
            <h2 className="text-3xl font-bold">The 5 Key Dimensions</h2>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle>1. Security (30 points max)</CardTitle>
                    <CardDescription>Audit history, age, and exploit tracking</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Protocol Age:</strong> +10 points for 3+ years, +7 for 1.5+ years, +4 for 6+ months</li>
                  <li>• <strong>TVL as Security Signal:</strong> +5 points for $1B+ TVL (battle-tested by market)</li>
                  <li>• <strong>Base Score:</strong> 15 points (assumes basic security measures)</li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm"><strong>Example:</strong> Aave (3+ years, $10B TVL) = 15 + 10 + 5 = <strong>30/30</strong></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle>2. TVL Stability (20 points max)</CardTitle>
                    <CardDescription>Liquidity depth and protocol stability</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>$5B+ TVL:</strong> +10 points</li>
                  <li>• <strong>$1-5B TVL:</strong> +7 points</li>
                  <li>• <strong>$500M-1B:</strong> +5 points</li>
                  <li>• <strong>$100-500M:</strong> +3 points</li>
                  <li>• <strong>Base:</strong> 10 points</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <CardTitle>3. Decentralization (20 points max)</CardTitle>
                    <CardDescription>Multi-chain deployment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>4+ chains:</strong> +10 points</li>
                  <li>• <strong>2-3 chains:</strong> +5 points</li>
                  <li>• <strong>Base:</strong> 10 points</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                  <div>
                    <CardTitle>4. Financial Health (20 points max)</CardTitle>
                    <CardDescription>Revenue and sustainability</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Based on TVL tiers (same as TVL Stability)</li>
                  <li>• Higher TVL = more revenue potential</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-pink-600" />
                  <div>
                    <CardTitle>5. Community (10 points max)</CardTitle>
                    <CardDescription>Engagement tracking</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>1.5+ years:</strong> +3 points</li>
                  <li>• <strong>Multi-chain:</strong> +2 points</li>
                  <li>• <strong>Base:</strong> 5 points</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I trust a C-grade protocol?</h3>
                <p className="text-muted-foreground">
                  C-grade means acceptable risk. Not unsafe, but requires caution.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">How often are scores updated?</h3>
                <p className="text-muted-foreground">
                  Daily at 12:00 UTC. Track changes on protocol pages.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Is this financial advice?</h3>
                <p className="text-muted-foreground">
                  No. We provide risk analysis, not investment advice. DYOR.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <a href="/protocols" className="inline-flex items-center gap-2 text-primary hover:underline">
              View All Ratings <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
