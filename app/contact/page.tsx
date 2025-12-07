import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail, MessageSquare, Twitter } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border rounded-lg text-center hover:border-primary transition-colors">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Email</h3>
              <a 
                href="mailto:hello@protocol-health.io" 
                className="text-primary hover:underline"
              >
                hello@protocol-health.io
              </a>
            </div>

            <div className="p-6 border rounded-lg text-center hover:border-primary transition-colors">
              <Twitter className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Twitter</h3>
              <a 
                href="https://x.com/protocolhealth_" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @protocolhealth_
              </a>
            </div>

            <div className="p-6 border rounded-lg text-center hover:border-primary transition-colors">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Share your thoughts and help us improve
              </p>
            </div>
          </div>

          <div className="bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">General Inquiries</h2>
            <p className="text-muted-foreground mb-4">
              For general questions, partnerships, or media inquiries, please reach out via email at{' '}
              <a href="mailto:hello@protocol-health.io" className="text-primary hover:underline">
                hello@protocol-health.io
              </a>
            </p>
            <p className="text-muted-foreground">
              We typically respond within 24-48 hours.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
