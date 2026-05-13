import type { ListingRecord } from "@/types/listings";

export function ListingGrid({
  title,
  description,
  emptyMessage,
  items,
}: {
  title: string;
  description: string;
  emptyMessage: string;
  items: ListingRecord[];
}) {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">{description}</p>
      {items.length === 0 ? <p className="mt-8 text-sm text-zinc-500">{emptyMessage}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.description}</p>
            <dl className="mt-4 space-y-1 text-sm text-zinc-500">
              <div>
                <dt className="inline font-medium text-zinc-700 dark:text-zinc-200">Location:</dt> {item.location}
              </div>
              <div>
                <dt className="inline font-medium text-zinc-700 dark:text-zinc-200">Price:</dt> {item.price_text}
              </div>
              <div>
                <dt className="inline font-medium text-zinc-700 dark:text-zinc-200">Contact:</dt> {item.contact_email}
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
