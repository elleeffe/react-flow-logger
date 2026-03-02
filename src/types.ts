// types.d.ts
export type UseStateLog = {
    type: "useState";
    payload: {
      id: string;
      next: unknown;
    };
  };
  
export type UseEffectLog = {
type: "useEffect";
payload: {
    id: string;
    deps?: readonly unknown[];
};
};

export type UseMemoLog = {
type: "useMemo";
payload: {
    id: string;
    deps: readonly unknown[];
};
};

export type UseCallbackLog = {
type: "useCallback";
payload: {
    id: string;
    deps: readonly unknown[];
};
};

export type RenderLog = {
type: "render";
payload: {
    component: string;
};
};

export type FetchStartLog = {
type: "fetch:start";
payload: {
    url: string;
};
};

export type FetchEndLog = {
type: "fetch:end";
payload: {
    url: string;
    status: number;
};
};

export type ReactFlowLog =
| UseStateLog
| UseEffectLog
| UseMemoLog
| UseCallbackLog
| RenderLog
| FetchStartLog
| FetchEndLog;