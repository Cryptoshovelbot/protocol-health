import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare, Twitter } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Email</h3>
                <a href="mailto:hello@protocolhealth.io" className="text-blue-600 hover:underline">
                  hello@protocolhealth.io
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Twitter className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Twitter</h3>
                <a href="https://twitter.com/protocolhealth" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  @protocolhealth
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Share your thoughts and help us improve
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">General Inquiries</h2>
              <p className="text-muted-foreground mb-4">
                For general questions, partnerships, or media inquiries, please reach out via email at hello@protocolhealth.io
              </p>
              <p className="text-muted-foreground">
                We typically respond within 24-48 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
