import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getTableName, listAdminListings } from "@/lib/listings";
import { requireAdminAccess } from "@/lib/auth";
import { listingResources, type ListingResource } from "@/types/listings";

function getResource(raw: string): ListingResource {
  if (listingResources.includes(raw as ListingResource)) {
    return raw as ListingResource;
  }

  throw new Error("Invalid resource");
}

function normalizePayload(payload: unknown) {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Invalid payload");
  }

  const body = payload as Record<string, unknown>;
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const location = String(body.location ?? "").trim();
  const price_text = String(body.price_text ?? "").trim();
  const contact_email = String(body.contact_email ?? "").trim();

  if (!title || !description || !location || !price_text || !contact_email) {
    throw new Error("Missing required fields");
  }

  return { title, description, location, price_text, contact_email };
}

export async function GET(_: NextRequest, context: { params: Promise<{ resource: string }> }) {
  try {
    await requireAdminAccess();
    const { resource: rawResource } = await context.params;
    const resource = getResource(rawResource);
    const items = await listAdminListings(resource);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ resource: string }> }) {
  try {
    const { userId } = await requireAdminAccess();
    const { resource: rawResource } = await context.params;
    const resource = getResource(rawResource);

    enforceRateLimit(`${userId}:${resource}:post`, { limit: 20, windowMs: 60_000 });

    const payload = normalizePayload(await request.json());
    const supabase = createSupabaseServiceRoleClient();

    const { error } = await supabase.from(getTableName(resource)).insert(payload);
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create listing" }, { status: 400 });
  }
}
