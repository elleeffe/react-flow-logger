import type { DependencyList } from "react";

export type BaseLog = {
  timestamp: number;
  duration: number;
};

export type UseStateLog = BaseLog & {
  type: "useState";
  payload: { id: string; prev: unknown; next: unknown };
};

export type UseEffectLog = BaseLog & {
  type: "useEffect";
  payload: { id: string; deps: DependencyList };
};

export type UseMemoLog = BaseLog & {
  type: "useMemo";
  payload: { id: string; deps: DependencyList; result?: unknown };
};

export type FetchLog = BaseLog & {
  type: "fetch:start" | "fetch:end";
  payload: { url: string; status?: number; response?: string };
};

export type UseCallbackLog = BaseLog & {
  type: "useCallback";
  payload: { id: string; deps: DependencyList };
};

export type RenderLog = BaseLog & {
  type: "render";
  payload: { component: string };
};

export type ReactFlowLog =
  | UseStateLog
  | UseEffectLog
  | UseMemoLog
  | FetchLog
  | UseCallbackLog
  | RenderLog;

export type ReactFlowLogType = ReactFlowLog["type"];
