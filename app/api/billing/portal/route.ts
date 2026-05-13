import { auth } from "@clerk/nextjs/server";
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

    enforceRateLimit(`${userId}:portal`, { limit: 20, windowMs: 60_000 });

    const supabase = createSupabaseServiceRoleClient();
    const stripe = getStripe();

    const { data } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (!data?.stripe_customer_id) {
      return NextResponse.json({ error: "No active customer record found" }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${origin}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to open billing portal" },
      { status: 400 },
    );
  }
}
