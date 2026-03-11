// src/index.ts
import * as React from "react";
import { emitLog } from "./logger";

// --- Controllo dev + SSR ---
const isDev =
  (typeof process !== "undefined" && process.env.NODE_ENV === "development") ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.DEV);

if (isDev && typeof window !== "undefined") {
  // --- Intercetta fetch ---
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    emitLog({
      type: "fetch:start",
      payload: { url: String(args[0]) },
      timestamp: Date.now(),
      duration: 0,
    });

    const start = performance.now(); // inizio timer
    const res = await originalFetch(...args);
    const end = performance.now(); // fine timer

    emitLog({
      type: "fetch:end",
      payload: {
        url: String(args[0]),
        status: res.status,
        response: await res.clone().text(),
      },
      duration: end - start,
      timestamp: Date.now(),
    });

    return res;
  };
}

// --- Hook wrapper useState ---
export function useStateLogger<T>(id: string, initial: T | (() => T)) {
  const [state, setState] = React.useState(initial);

  const wrappedSetState = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const start = performance.now();
      const next =
        typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
      const end = performance.now();

      if (isDev) {
        emitLog({
          type: "useState",
          payload: { id, prev, next },
          timestamp: Date.now(),
          duration: end - start,
        });
      }

      return next;
    });
  };

  return [state, wrappedSetState] as const;
}

// --- Hook wrapper useEffect ---
export function useEffectLogger(
  id: string,
  effect: React.EffectCallback,
  deps: React.DependencyList,
) {
  React.useEffect(() => {
    if (!isDev) return effect();

    const start = performance.now();
    const cleanup = effect();
    const end = performance.now();

    emitLog({
      type: "useEffect",
      payload: { id, deps },
      timestamp: Date.now(),
      duration: end - start,
    });

    return cleanup;
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  }, deps);
}

// --- HOC wrapper componenti per log render ---
export function withLogger<P extends object>(
  Component: React.ComponentType<P>,
) {
  return (props: P) => {
    if (isDev) {
      const start = performance.now();
      const element = <Component {...props} />;
      const end = performance.now();

      emitLog({
        type: "render",
        payload: {
          component: Component.displayName || Component.name || "Anonymous",
        },
        duration: end - start,
        timestamp: Date.now(),
      });

      return element;
    }

    return <Component {...props} />;
  };
}

// --- Hook wrapper useMemo ---
export function useMemoLogger<T>(
  id: string,
  factory: () => T,
  deps: React.DependencyList,
): T {
  return React.useMemo(() => {
    const start = performance.now();
    const value = factory();
    const end = performance.now();

    if (isDev) {
      emitLog({
        type: "useMemo",
        payload: { id, deps, result: value },
        timestamp: Date.now(),
        duration: end - start,
      });
    }

    return value;
    // biome-ignore lint/correctness/useExhaustiveDependencies: factory deps passed dynamically
  }, deps);
}

// --- Hook wrapper useCallback ---
export function useCallbackLogger<T extends (...args: any[]) => any>(
  id: string,
  callback: T,
  deps: React.DependencyList,
): T {
  return React.useCallback((...args: any[]) => {
    const start = performance.now();
    const result = callback(...args);
    const end = performance.now();

    if (isDev) {
      emitLog({
        type: "useCallback",
        payload: { id, deps },
        timestamp: Date.now(),
        duration: end - start,
      });
    }

    return result;
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  }, deps) as T;
}
