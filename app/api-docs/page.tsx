import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';

export default function APIPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Code className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold">API Documentation</h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-12">
            Access Protocol Health data programmatically
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We're working on a public API that will allow developers to integrate Protocol Health risk scores into their own applications.
              </p>
              <p className="text-muted-foreground">
                Interested in early access? Contact us at hello@protocolhealth.io
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planned Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• RESTful API endpoints for all protocol scores</li>
                <li>• Historical data access</li>
                <li>• Real-time score updates via webhooks</li>
                <li>• Rate limiting with API keys</li>
                <li>• Comprehensive documentation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
