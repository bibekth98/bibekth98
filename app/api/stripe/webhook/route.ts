import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

function toIsoDate(unixTime?: number | null) {
  if (!unixTime) {
    return null;
  }

  return new Date(unixTime * 1000).toISOString();
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");

  if (!signature || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature configuration" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServiceRoleClient();

  if (
    event.type === "checkout.session.completed" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.deleted"
  ) {
    const object = event.data.object;

    let subscriptionId: string | null = null;
    let customerId: string | null = null;
    let priceId = "";
    let status = "";
    let currentPeriodEnd: string | null = null;
    let clerkUserId = "";

    if (event.type === "checkout.session.completed") {
      const session = object as Stripe.Checkout.Session;
      subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
      customerId = typeof session.customer === "string" ? session.customer : null;
      clerkUserId = session.metadata?.clerkUserId ?? "";

      if (subscriptionId) {
        const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as unknown as Stripe.Subscription;
        priceId = subscription.items.data[0]?.price?.id ?? "";
        status = subscription.status;
        currentPeriodEnd = toIsoDate(subscription.items.data[0]?.current_period_end ?? null);
      }
    } else {
      const subscription = object as Stripe.Subscription;
      subscriptionId = subscription.id;
      customerId = typeof subscription.customer === "string" ? subscription.customer : null;
      priceId = subscription.items.data[0]?.price?.id ?? "";
      status = subscription.status;
      currentPeriodEnd = toIsoDate(subscription.items.data[0]?.current_period_end ?? null);

      if (subscription.metadata?.clerkUserId) {
        clerkUserId = subscription.metadata.clerkUserId;
      } else if (customerId) {
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) {
          clerkUserId = customer.metadata?.clerkUserId ?? "";
        }
      }
    }

    if (subscriptionId && customerId && clerkUserId) {
      const { error } = await supabase.from("subscriptions").upsert(
        {
          clerk_user_id: clerkUserId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          stripe_price_id: priceId,
          status,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_user_id" },
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
