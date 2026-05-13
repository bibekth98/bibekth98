import { createSupabasePublicClient, createSupabaseServiceRoleClient } from "@/lib/supabase";
import type { ListingRecord, ListingResource } from "@/types/listings";

const fallbackData: Record<ListingResource, ListingRecord[]> = {
  jobs: [
    {
      id: "job-fallback-1",
      title: "Retail Assistant",
      description: "Flexible evening shifts for students with customer service support.",
      location: "Sydney, NSW",
      price_text: "$30/hour",
      contact_email: "jobs@example.com",
      created_at: new Date(0).toISOString(),
      updated_at: new Date(0).toISOString(),
    },
  ],
  accommodation: [
    {
      id: "accommodation-fallback-1",
      title: "Shared apartment near CBD",
      description: "Two-bedroom apartment with bills included and tram access.",
      location: "Melbourne, VIC",
      price_text: "$320/week",
      contact_email: "housing@example.com",
      created_at: new Date(0).toISOString(),
      updated_at: new Date(0).toISOString(),
    },
  ],
  marketplace: [
    {
      id: "marketplace-fallback-1",
      title: "Study desk + chair",
      description: "Lightly used setup suitable for student rooms.",
      location: "Brisbane, QLD",
      price_text: "$120",
      contact_email: "marketplace@example.com",
      created_at: new Date(0).toISOString(),
      updated_at: new Date(0).toISOString(),
    },
  ],
};

const tableByResource: Record<ListingResource, string> = {
  jobs: "jobs",
  accommodation: "accommodation_listings",
  marketplace: "marketplace_items",
};

export function getTableName(resource: ListingResource) {
  return tableByResource[resource];
}

export async function listPublicListings(resource: ListingResource): Promise<ListingRecord[]> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from(getTableName(resource))
      .select("id,title,description,location,price_text,contact_email,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as ListingRecord[]) ?? [];
  } catch {
    return fallbackData[resource];
  }
}

export async function listAdminListings(resource: ListingResource): Promise<ListingRecord[]> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(getTableName(resource))
    .select("id,title,description,location,price_text,contact_email,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as ListingRecord[]) ?? [];
}
