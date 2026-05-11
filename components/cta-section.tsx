import Link from "next/link";

export function CTASection() {
  return (
    <section className="px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-black px-8 py-14 text-center text-white shadow-xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Start your career journey today.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
          Build your professional profile, apply to student-friendly jobs, and stand out to Australian employers.
        </p>
        <Link
          href="/auth"
          className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Get Started Free
        </Link>
      </div>
    </section>
  );
}
