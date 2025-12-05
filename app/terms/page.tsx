import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 5, 2024</p>

          <h2>Agreement to Terms</h2>
          <p>
            By accessing Protocol Health, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h2>Use of Service</h2>
          <h3>Permitted Use</h3>
          <p>You may use Protocol Health to:</p>
          <ul>
            <li>View risk scores and protocol analysis</li>
            <li>Create a free account</li>
            <li>Access all available features</li>
          </ul>

          <h3>Prohibited Use</h3>
          <p>You may not:</p>
          <ul>
            <li>Scrape or automatically extract data</li>
            <li>Attempt to gain unauthorized access</li>
            <li>Use the service for illegal purposes</li>
            <li>Reverse engineer any part of the service</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>
            <strong>IMPORTANT:</strong> Protocol Health provides informational content only. Our risk scores and analysis do not constitute financial advice. Cryptocurrency investments carry significant risk, and you should conduct your own research before making any investment decisions.
          </p>

          <h2>No Warranties</h2>
          <p>
            The service is provided as is without warranties of any kind. We do not guarantee the accuracy, completeness, or timeliness of the information provided.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Protocol Health shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with applicable international laws.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact us at: hello@protocolhealth.io
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
