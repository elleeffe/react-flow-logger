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
export function useStateLogger<T>(id: string, initial: T | (() => T)) {
  const [state, setState] = React.useState(initial);
  const wrappedSetState = (value: T | ((prev: T) => T)) => {
    const next = typeof value === "function" ? (value as Function)(state) : value;
    if(isDev) {
      console.log(`[React Flow Logger] useState ${id} change:`, next);
    }
    setState(value);
  };
  return [state, wrappedSetState] as const;
}

// --- Hook wrapper useEffect ---
export function useEffectLogger(id: string, effect: React.EffectCallback, deps?: React.DependencyList) {
  React.useEffect(() => {
    if(isDev) {
      console.log(`[React Flow Logger] useEffect ${id} triggered`, deps);
    }
    return effect();
  }, deps);
}

// --- HOC wrapper componenti per log render ---
export function withLogger<P extends object>(
  Component: React.ComponentType<P>
) {
  return (props: P) => {
    if(isDev) {
      console.log(
        `[React Flow Logger] Render component: ${
          Component.displayName || Component.name || "Anonymous"
        }`
      );
    }
    return <Component {...props} />;
  };
}

// --- Hook wrapper useMemo ---
export function useMemoLogger<T>(
  id: string,
  factory: () => T,
  deps: React.DependencyList
): T {
  return React.useMemo(() => {
    const value = factory();

    if (isDev) {
      console.log(
        `[React Flow Logger] useMemo ${id} recalculated`,
        deps
      );
    }

    return value;
  }, deps);
}

// --- Hook wrapper useCallback ---
export function useCallbackLogger<T extends (...args: any[]) => any>(
  id: string,
  callback: T,
  deps: React.DependencyList
): T {
  return React.useCallback((...args: any[]) => {
    if (isDev) {
      console.log(
        `[React Flow Logger] useCallback ${id} invoked`,
        deps
      );
    }
    return callback(...args);
  }, deps) as T;
}