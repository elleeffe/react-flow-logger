export type BaseLog = {
	timestamp: number; // sempre presente
};

export type UseStateLog = BaseLog & {
	type: "useState";
	payload: { id: string; next: unknown };
};

export type UseEffectLog = BaseLog & {
	type: "useEffect";
	payload: { id: string; deps?: unknown[] };
};

export type UseMemoLog = BaseLog & {
	type: "useMemo";
	payload: { id: string; deps: unknown[]; result?: unknown };
};

export type FetchLog = BaseLog & {
	type: "fetch:start" | "fetch:end";
	payload: { url: string; status?: number; response?: string };
};

export type ReactFlowLog =
	| UseStateLog
	| UseEffectLog
	| UseMemoLog
	| FetchLog
	| { type: string; payload: any; timestamp: number }; // fallback generico
