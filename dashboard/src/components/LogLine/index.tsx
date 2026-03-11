import type { DependencyList } from "react";
import type { ReactFlowLog } from "../../../../src/types";
import FetchLogLine from "./FetchLogLine";
import LogLineWithDeps from "./LogLineWithDeps";
import RenderLogLine from "./RenderLogLine";
import StateLogLine from "./StateLogLine";

type Props = { log: ReactFlowLog; prevDeps?: DependencyList };

export default function LogLine({ log, prevDeps }: Props) {
  switch (log.type) {
    case "render":
      return <RenderLogLine log={log} />;
    case "useState":
      return <StateLogLine log={log} />;
    case "useEffect":
    case "useMemo":
    case "useCallback":
      return <LogLineWithDeps log={log} prevDeps={prevDeps} />;
    case "fetch:start":
    case "fetch:end":
      return <FetchLogLine log={log} />;
    default:
      //@ts-expect-error
      return <div>Unknown log type: {log.type}</div>;
  }
}
