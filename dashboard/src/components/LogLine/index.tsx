import type { DependencyList } from "react";
import type { ReactFlowLog } from "../../../../src/types";
import LogLineWithDeps from "./LogLineWithDeps";
import SimpleLogLine from "./SimpleLogLine";

type Props = {
  log: ReactFlowLog;
  prevDeps?: DependencyList;
  thresholds: {
    warning: number;
    danger: number;
  };
};

export default function LogLine({ log, prevDeps, thresholds }: Props) {
  switch (log.type) {
    case "render":
      return (
        <SimpleLogLine
          label={`[${log.type}] ${log.payload.component}`}
          log={log}
          thresholds={thresholds}
        />
      );
    case "useState":
      return (
        <SimpleLogLine
          label={`[${log.type}] ${log.payload.id}`}
          log={log}
          thresholds={thresholds}
        />
      );
    case "useEffect":
    case "useMemo":
    case "useCallback":
      return (
        <LogLineWithDeps
          log={log}
          prevDeps={prevDeps}
          thresholds={thresholds}
        />
      );
    case "fetch:start":
    case "fetch:end":
      return (
        <SimpleLogLine
          label={`[${log.type}] ${log.payload.url}`}
          log={log}
          thresholds={thresholds}
        />
      );
    default:
      //@ts-expect-error
      return <div>Unknown log type: {log.type}</div>;
  }
}
