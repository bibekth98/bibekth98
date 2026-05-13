import Stripe from "stripe";
import { env } from "@/lib/env";

let cachedStripe: Stripe | null = null;

export function getStripe() {
  if (cachedStripe) {
    return cachedStripe;
  }

  if (!env.stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  cachedStripe = new Stripe(env.stripeSecretKey, {
    apiVersion: "2026-04-22.dahlia",
  });

  return cachedStripe;
}
