import { type DependencyList, useState } from "react";
import type {
  UseCallbackLog,
  UseEffectLog,
  UseMemoLog,
} from "../../../../src/types";
import { typeColors } from "../../config";
import Collapsible from "../Collapsible";
import DurationLabel from "./DurationLabel";

type Props = {
  log: UseEffectLog | UseMemoLog | UseCallbackLog;
  prevDeps?: DependencyList;
  thresholds: {
    warning: number;
    danger: number;
  };
};

export default function LogLineWithDeps({ log, prevDeps, thresholds }: Props) {
  const [open, setOpen] = useState(false);
  const deps = log.payload.deps;

  const depsDiff = deps
    .map((dep, i) => {
      const prev = prevDeps?.[i];
      const changed = prevDeps ? prev !== dep : false;

      if (!changed) return null;

      return {
        prev,
        next: dep,
      };
    })
    .filter(Boolean);

  return (
    <div className="bg-gray-900 rounded px-2 py-1 border border-gray-800 hover:border-gray-600 transition-all flex flex-col gap-2">
      <button
        className="w-full cursor-pointer flex justify-between flex-wrap gap-2 text-left"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <div className={`${typeColors[log.type]} select-none flex-1`}>
          [{log.type}] {log.payload.id}
        </div>

        <DurationLabel
          duration={log.duration}
          timestamp={log.timestamp}
          thresholds={thresholds}
        />
      </button>

      {open && (
        <>
          {Object.entries(log.payload)
            .filter(([key]) => key !== "deps")
            .map(([key, value]) => (
              <Collapsible key={key} label={key} value={value} />
            ))}
          {depsDiff.length > 0 && (
            <Collapsible label="Deps changed" value={depsDiff} />
          )}
        </>
      )}
    </div>
  );
}
