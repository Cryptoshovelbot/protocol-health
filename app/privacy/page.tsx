import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: December 6, 2025</p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Protocol Health respects your privacy and is committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Account Information</h3>
              <p className="text-muted-foreground mb-2">When you create an account, we collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Email address</li>
                <li>Password (encrypted)</li>
                <li>Account preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Usage Data</h3>
              <p className="text-muted-foreground mb-2">We automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Pages visited</li>
                <li>Time spent on site</li>
                <li>Browser type and version</li>
                <li>IP address</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-2">We use your data to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and maintain our services</li>
                <li>Improve user experience</li>
                <li>Send important updates (if you opt-in)</li>
                <li>Analyze usage patterns</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information. 
                Your password is encrypted, and we use secure connections (HTTPS) for all data transmission.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground mb-2">We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Supabase</strong> (authentication and database)</li>
                <li><strong>Vercel</strong> (hosting)</li>
                <li><strong>Upstash</strong> (caching)</li>
                <li><strong>PostHog</strong> (analytics)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:{' '}
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
