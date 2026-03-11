import type { ReactFlowLog } from "../../../../src/types";
import CallbackLogLine from "./CallbackLogLine";
import EffectLogLine from "./EffectLogLine";
import FetchLogLine from "./FetchLogLine";
import MemoLogLine from "./MemoLogLine";
import RenderLogLine from "./RenderLogLine";
import StateLogLine from "./StateLogLine";

export default function LogLine({ log }: { log: ReactFlowLog }) {
	switch (log.type) {
		case "render":
			return <RenderLogLine log={log} />;
		case "useState":
			return <StateLogLine log={log} />;
		case "useEffect":
			return <EffectLogLine log={log} />;
		case "useMemo":
			return <MemoLogLine log={log} />;
		case "useCallback":
			return <CallbackLogLine log={log} />;
		case "fetch:start":
		case "fetch:end":
			return <FetchLogLine log={log} />;
		default:
			//@ts-expect-error
			return <div>Unknown log type: {log.type}</div>;
	}
}
