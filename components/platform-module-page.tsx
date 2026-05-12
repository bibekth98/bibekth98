import Link from "next/link";

type ModulePageItem = {
  title: string;
  description: string;
  meta: string;
};

type PlatformModulePageProps = {
  title: string;
  description: string;
  items: ModulePageItem[];
};

export function PlatformModulePage({ title, description, items }: PlatformModulePageProps) {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="inline-flex rounded-full border border-black/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:border-white/15 dark:text-zinc-300">
            International Student Life Platform
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
        </header>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{item.meta}</p>
              <h2 className="mt-3 text-lg font-semibold text-black dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.description}</p>
            </article>
          ))}
        </section>

        <Link
          href="/"
          className="inline-flex rounded-xl border border-black/15 px-4 py-2 text-sm font-medium transition hover:border-black hover:bg-zinc-50 dark:border-white/20 dark:hover:border-white dark:hover:bg-zinc-900"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
