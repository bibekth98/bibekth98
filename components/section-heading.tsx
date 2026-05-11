import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  description: string;
  badge?: ReactNode;
};

export function SectionHeading({ title, description, badge }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {badge ? <div className="mb-4 inline-flex">{badge}</div> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}
