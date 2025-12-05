import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Protocol Health</h1>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-muted-foreground mb-8">
              Protocol Health is a risk intelligence platform that helps DeFi investors make safer decisions by providing transparent, data-driven security scores for decentralized finance protocols.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To bring transparency and trust to DeFi by providing accessible, comprehensive risk analysis for all protocols.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the standard for DeFi risk assessment, helping billions make informed investment decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Community First</h3>
                <p className="text-muted-foreground">
                  We believe DeFi should be accessible to everyone. Our platform is free and open to all investors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Data-Driven</h3>
                <p className="text-muted-foreground">
                  Our scores are based on objective metrics from trusted sources, updated daily to reflect current conditions.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">Why Protocol Health?</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  DeFi protocols handle billions in assets, yet investors often lack clear information about security risks. Traditional ratings agencies do not cover crypto, and most users rely on incomplete data or gut feeling.
                </p>
                <p>
                  Protocol Health solves this by analyzing protocols across five critical dimensions: security, TVL stability, decentralization, financial health, and community strength. We aggregate data from multiple sources and present it in an easy-to-understand format.
                </p>
                <p>
                  Our goal is simple: help you make safer DeFi decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
