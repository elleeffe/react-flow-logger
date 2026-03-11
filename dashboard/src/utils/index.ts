export function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleTimeString()}.${String(d.getMilliseconds()).padStart(3, "0")}`;
}

export function formatDurationWithThreshold(
  duration: number,
  warning: number,
  danger: number,
): string {
  if (duration >= danger) {
    return `⛔ ${duration.toFixed(2)}ms`; // danger
  } else if (duration >= warning) {
    return `⚠️ ${duration.toFixed(2)}ms`; // warning
  } else {
    return `✅ ${duration.toFixed(2)}ms`; // ok
  }
}
