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
