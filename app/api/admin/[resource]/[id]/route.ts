import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getTableName } from "@/lib/listings";
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

  return { title, description, location, price_text, contact_email, updated_at: new Date().toISOString() };
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ resource: string; id: string }> }) {
  try {
    const { userId } = await requireAdminAccess();
    const { resource: rawResource, id } = await context.params;
    const resource = getResource(rawResource);

    enforceRateLimit(`${userId}:${resource}:patch`, { limit: 30, windowMs: 60_000 });

    const payload = normalizePayload(await request.json());
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from(getTableName(resource)).update(payload).eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update listing" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ resource: string; id: string }> }) {
  try {
    const { userId } = await requireAdminAccess();
    const { resource: rawResource, id } = await context.params;
    const resource = getResource(rawResource);

    enforceRateLimit(`${userId}:${resource}:delete`, { limit: 30, windowMs: 60_000 });

    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from(getTableName(resource)).delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete listing" }, { status: 400 });
  }
}
