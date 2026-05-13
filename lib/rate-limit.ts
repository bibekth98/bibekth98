type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

export function enforceRateLimit(
  key: string,
  options: {
    limit: number;
    windowMs: number;
  },
) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return;
  }

  if (current.count >= options.limit) {
    const waitSeconds = Math.ceil((current.resetAt - now) / 1000);
    throw new Error(`Rate limit exceeded. Try again in ${waitSeconds} seconds.`);
  }

  current.count += 1;
  store.set(key, current);
}
