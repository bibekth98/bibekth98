import type { Metadata } from "next";
import Link from "next/link";
import { authHighlights } from "@/data/content";

export const metadata: Metadata = {
  title: "Auth",
  description: "Sign in to access your GradBridge career dashboard.",
};

export default function AuthPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden border-r border-black/10 bg-zinc-100 p-12 dark:border-white/10 dark:bg-zinc-900 lg:block">
        <h1 className="text-3xl font-semibold tracking-tight">GradBridge</h1>
        <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-300">
          Your all-in-one career platform for resumes, cover letters, jobs, and internships in Australia.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
          {authHighlights.map((item) => (
            <li key={item.value} className="inline-flex items-center gap-2">
              <item.icon className="size-4" aria-hidden="true" />
              {item.value}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-lg dark:border-white/15 dark:bg-zinc-900">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Sign in to continue building your career profile.</p>
          <form className="mt-7 space-y-4" aria-label="Authentication form">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Email</span>
              <input
                type="email"
                required
                placeholder="you@student.edu.au"
                className="w-full rounded-xl border border-black/15 bg-transparent px-3 py-2.5 outline-none ring-black/20 placeholder:text-zinc-400 focus:ring-2 dark:border-white/20"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Password</span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/15 bg-transparent px-3 py-2.5 outline-none ring-black/20 placeholder:text-zinc-400 focus:ring-2 dark:border-white/20"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
            <Link href="/" className="hover:underline">
              Back to home
            </Link>
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
