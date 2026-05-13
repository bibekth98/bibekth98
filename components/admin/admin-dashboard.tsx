"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/plausible";
import type { ListingRecord, ListingResource } from "@/types/listings";
import { listingResources } from "@/types/listings";

type AdminDashboardProps = {
  initialData: Record<ListingResource, ListingRecord[]>;
};

type FormState = {
  title: string;
  description: string;
  location: string;
  price_text: string;
  contact_email: string;
};

const blankForm: FormState = {
  title: "",
  description: "",
  location: "",
  price_text: "",
  contact_email: "",
};

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [resource, setResource] = useState<ListingResource>("jobs");
  const [data, setData] = useState(initialData);
  const [form, setForm] = useState<FormState>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const selectedItems = useMemo(() => data[resource] ?? [], [data, resource]);

  async function refreshSelected() {
    const response = await fetch(`/api/admin/${resource}`, { cache: "no-store" });
    const payload = (await response.json()) as { items: ListingRecord[]; error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to refresh data");
    }

    setData((prev) => ({ ...prev, [resource]: payload.items }));
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const method = editingId ? "PATCH" : "POST";
    const endpoint = editingId ? `/api/admin/${resource}/${editingId}` : `/api/admin/${resource}`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save listing");
      }

      await refreshSelected();
      setForm(blankForm);
      setEditingId(null);
      setMessage(editingId ? "Listing updated." : "Listing created.");
      trackEvent("admin_listing_saved", { resource, mode: editingId ? "update" : "create" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeItem(id: string) {
    setMessage("");
    try {
      const response = await fetch(`/api/admin/${resource}/${id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to delete listing");
      }
      await refreshSelected();
      trackEvent("admin_listing_deleted", { resource });
      setMessage("Listing deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete listing");
    }
  }

  function beginEdit(item: ListingRecord) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      location: item.location,
      price_text: item.price_text,
      contact_email: item.contact_email,
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {listingResources.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setResource(item);
              setEditingId(null);
              setForm(blankForm);
            }}
            className={`rounded-lg px-4 py-2 text-sm capitalize ${
              resource === item
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-black/10 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <form onSubmit={submitForm} className="grid gap-3 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold capitalize">{editingId ? `Edit ${resource} listing` : `Create ${resource} listing`}</h2>
        <input
          required
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Title"
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
        />
        <textarea
          required
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Description"
          className="min-h-28 rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
        />
        <div className="grid gap-3 md:grid-cols-3">
          <input
            required
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="Location"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
          <input
            required
            value={form.price_text}
            onChange={(event) => setForm((prev) => ({ ...prev, price_text: event.target.value }))}
            placeholder="Price or compensation"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
          <input
            required
            type="email"
            value={form.contact_email}
            onChange={(event) => setForm((prev) => ({ ...prev, contact_email: event.target.value }))}
            placeholder="Contact email"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </div>
        <div className="flex gap-2">
          <button
            disabled={submitting}
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {submitting ? "Saving..." : editingId ? "Update listing" : "Create listing"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(blankForm);
              }}
              className="rounded-lg border border-black/10 px-4 py-2 text-sm dark:border-white/10"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      {message ? <p className="text-sm text-zinc-600 dark:text-zinc-300">{message}</p> : null}

      <section className="space-y-3">
        {selectedItems.map((item) => (
          <article key={item.id} className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{item.description}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {item.location} · {item.price_text} · {item.contact_email}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => beginEdit(item)}
                className="rounded-lg border border-black/10 px-3 py-1.5 text-xs dark:border-white/10"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
