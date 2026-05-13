export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") {
    return;
  }

  type PlausibleFn = (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;

  const plausible = (window as Window & { plausible?: PlausibleFn }).plausible;

  if (!plausible) {
    return;
  }

  plausible(name, props ? { props } : undefined);
}
