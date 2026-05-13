export const listingResources = ["jobs", "accommodation", "marketplace"] as const;

export type ListingResource = (typeof listingResources)[number];

export type ListingRecord = {
  id: string;
  title: string;
  description: string;
  location: string;
  price_text: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
};

export type SubscriptionRecord = {
  id: string;
  clerk_user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};
