import type { HookThresholds } from "../components/ThresholdsModal";

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

const STORAGE_KEY = "reactFlowLoggerThresholds";

export function loadThresholds(): HookThresholds | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Errore nel caricamento delle soglie", e);
    return null;
  }
}

export function saveThresholds(thresholds: HookThresholds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
  } catch (e) {
    console.error("Errore nel salvataggio delle soglie", e);
  }
}
