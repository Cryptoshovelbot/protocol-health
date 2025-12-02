import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId;
          
          if (!userId) {
            console.error('No userId in session metadata');
            break;
          }

          // Update user profile to Pro tier
          const { error } = await supabase
            .from('user_profiles')
            .update({
              tier: 'pro',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              stripe_subscription_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (error) {
            console.error('Error updating user profile:', error);
          } else {
            console.log(`User ${userId} upgraded to Pro`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        const { error } = await supabase
          .from('user_profiles')
          .update({
            stripe_subscription_status: subscription.status,
            tier: subscription.status === 'active' ? 'pro' : 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Downgrade to free tier
        const { error } = await supabase
          .from('user_profiles')
          .update({
            tier: 'free',
            stripe_subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error canceling subscription:', error);
        } else {
          console.log(`Subscription ${subscription.id} canceled`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Handle failed payment
        const { error } = await supabase
          .from('user_profiles')
          .update({
            stripe_subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', invoice.customer as string);

        if (error) {
          console.error('Error handling failed payment:', error);
        }
        
        // TODO: Send email notification about failed payment
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
