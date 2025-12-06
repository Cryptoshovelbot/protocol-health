import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last updated: December 6, 2025</p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing Protocol Health, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Permitted Use</h3>
              <p className="text-muted-foreground mb-2">You may use Protocol Health to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>View risk scores and protocol analysis</li>
                <li>Create a free account</li>
                <li>Access all available features</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Prohibited Use</h3>
              <p className="text-muted-foreground mb-2">You may not:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Scrape or automatically extract data</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Use the service for illegal purposes</li>
                <li>Reverse engineer any part of the service</li>
              </ul>
            </section>

            <section className="mb-12 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold mb-4 text-amber-900 dark:text-amber-100">
                Important Disclaimer
              </h2>
              <p className="text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                Protocol Health provides informational content only. Our risk scores and analysis 
                do not constitute financial advice. Cryptocurrency investments carry significant risk, 
                and you should conduct your own research before making any investment decisions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">No Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The service is provided as is without warranties of any kind. We do not guarantee 
                the accuracy, completeness, or timeliness of the information provided.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Protocol Health shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the 
                service constitutes acceptance of modified terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms are governed by and construed in accordance with applicable 
                international laws.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about these terms? Contact us at:{' '}
                <a href="mailto:hello@protocol-health.io" className="text-primary hover:underline">
                  hello@protocol-health.io
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
