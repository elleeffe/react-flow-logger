// src/index.ts
import * as React from "react";

// --- Controllo dev + SSR ---
const isDev =
  (typeof process !== "undefined" && process.env.NODE_ENV === "development") ||
  ((typeof import.meta !== "undefined" && (import.meta as any).env?.DEV));

if (isDev && typeof window !== "undefined") {
  console.log(
    "%c[React Flow Logger] Active in Dev Mode",
    "color: #00ff88; font-weight: bold;"
  );

  // --- Intercetta fetch ---
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    console.log("[React Flow Logger] FETCH START", args[0]);
    const res = await originalFetch(...args);
    console.log("[React Flow Logger] FETCH END", args[0], res.status);
    return res;
  };
}

// --- Hook wrapper useState ---
export function useStateLogger<T>(initial: T | (() => T)) {
  const [state, setState] = React.useState(initial);
  const wrappedSetState = (value: T | ((prev: T) => T)) => {
    const next = typeof value === "function" ? (value as Function)(state) : value;
    console.log("[React Flow Logger] useState change:", next);
    setState(value);
  };
  return [state, wrappedSetState] as const;
}

// --- Hook wrapper useEffect ---
export function useEffectLogger(effect: React.EffectCallback, deps?: React.DependencyList) {
  React.useEffect(() => {
    console.log("[React Flow Logger] useEffect triggered", deps);
    return effect();
  }, deps);
}

// --- HOC wrapper componenti per log render ---
export function withLogger<P extends object>(
  Component: React.ComponentType<P>
) {
  return (props: P) => {
    console.log(
      `[React Flow Logger] Render component: ${
        Component.displayName || Component.name || "Anonymous"
      }`
    );
    return <Component {...props} />;
  };
}