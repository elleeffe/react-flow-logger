// src/index.ts
import * as React from "react";
import { emitLog } from "./logger";

// --- Controllo dev + SSR ---
const isDev =
  (typeof process !== "undefined" && process.env.NODE_ENV === "development") ||
  ((typeof import.meta !== "undefined" && (import.meta as any).env?.DEV));

if (isDev && typeof window !== "undefined") {
  // --- Intercetta fetch ---
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    emitLog({
      type: "fetch:start",
      payload: { url: String(args[0]) },
      timestamp: Date.now()
    });
    const res = await originalFetch(...args);
    emitLog({
      type: "fetch:end",
      payload: { 
        url: String(args[0]), 
        status: res.status, 
        response: await res.clone().text() 
      },
      timestamp: Date.now()
    });
    return res;
  };
}

// --- Hook wrapper useState ---
export function useStateLogger<T>(id: string, initial: T | (() => T)) {
  const [state, setState] = React.useState(initial);
  const wrappedSetState = (value: T | ((prev: T) => T)) => {
    const next = typeof value === "function" ? (value as Function)(state) : value;
    if(isDev) {
      emitLog({
        type: "useState",
        payload: { id, next },
        timestamp: Date.now()
      });
    }
    setState(value);
  };
  return [state, wrappedSetState] as const;
}

// --- Hook wrapper useEffect ---
export function useEffectLogger(id: string, effect: React.EffectCallback, deps: React.DependencyList) {
  React.useEffect(() => {
    if(isDev) {
      emitLog({
        type: "useEffect",
        payload: { id, deps },
        timestamp: Date.now()
      });
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
      emitLog({
        type: "render",
        payload: {
          component: Component.displayName || Component.name || "Anonymous"
        },
        timestamp: Date.now()
      });
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
  const value = React.useMemo(() => factory(), deps);

  if (isDev) {
    emitLog({
      type: "useMemo",
      payload: { id, deps, result: value },
      timestamp: Date.now()
    })
  }

  return value;
}

// --- Hook wrapper useCallback ---
export function useCallbackLogger<T extends (...args: any[]) => any>(
  id: string,
  callback: T,
  deps: React.DependencyList
): T {
  return React.useCallback((...args: any[]) => {
    if (isDev) {
      if (isDev) {
        emitLog({
          type: "useCallback",
          payload: { id, deps },
          timestamp: Date.now()
        });
      }
    }
    return callback(...args);
  }, deps) as T;
}
