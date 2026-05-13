import { NextRequest, NextResponse } from "next/server";
import { listPublicListings } from "@/lib/listings";
import { listingResources, type ListingResource } from "@/types/listings";

function getResource(raw: string): ListingResource {
  if (listingResources.includes(raw as ListingResource)) {
    return raw as ListingResource;
  }

  throw new Error("Invalid resource");
}

export async function GET(_: NextRequest, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource: rawResource } = await context.params;
    const resource = getResource(rawResource);
    const items = await listPublicListings(resource);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Unable to load content" }, { status: 400 });
  }
}
