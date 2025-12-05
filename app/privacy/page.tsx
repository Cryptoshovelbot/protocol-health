import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 5, 2024</p>

          <h2>Introduction</h2>
          <p>
            Protocol Health respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.
          </p>

          <h2>Information We Collect</h2>
          <h3>Account Information</h3>
          <p>When you create an account, we collect:</p>
          <ul>
            <li>Email address</li>
            <li>Password (encrypted)</li>
            <li>Account preferences</li>
          </ul>

          <h3>Usage Data</h3>
          <p>We automatically collect:</p>
          <ul>
            <li>Pages visited</li>
            <li>Time spent on site</li>
            <li>Browser type and version</li>
            <li>IP address</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Improve user experience</li>
            <li>Send important updates (if you opt-in)</li>
            <li>Analyze usage patterns</li>
          </ul>

          <h2>Data Protection</h2>
          <p>
            We implement appropriate security measures to protect your personal information. Your password is encrypted, and we use secure connections (HTTPS) for all data transmission.
          </p>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li>Supabase (authentication and database)</li>
            <li>Vercel (hosting)</li>
            <li>Upstash (caching)</li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            For privacy-related questions, contact us at: hello@protocolhealth.io
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
