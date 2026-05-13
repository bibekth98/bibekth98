import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    enforceRateLimit(`${userId}:checkout`, { limit: 10, windowMs: 60_000 });

    const body = (await request.json()) as { priceId?: string };

    if (!body.priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const stripe = getStripe();
    const supabase = createSupabaseServiceRoleClient();

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    let customerId = existing?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email, metadata: { clerkUserId: userId } });
      customerId = customer.id;
    }

    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      success_url: `${origin}/pricing?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      line_items: [{ price: body.priceId, quantity: 1 }],
      metadata: {
        clerkUserId: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout failed" }, { status: 400 });
  }
}
