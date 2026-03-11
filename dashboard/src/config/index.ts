import type { ReactFlowLog } from "../../../src/types";

export const ALL_TYPES: ReactFlowLog["type"][] = [
	"useState",
	"useEffect",
	"useMemo",
	"useCallback",
	"render",
	"fetch:start",
	"fetch:end",
];

export const typeColors: Record<string, string> = {
	useState: "text-blue-400",
	useEffect: "text-amber-400",
	useMemo: "text-purple-400",
	useCallback: "text-rose-400",
	render: "text-teal-400",
	"fetch:start": "text-red-400",
	"fetch:end": "text-red-600",
};
