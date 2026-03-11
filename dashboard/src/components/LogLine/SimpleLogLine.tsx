import { useState } from "react";
import type { FetchLog, RenderLog, UseStateLog } from "../../../../src/types";
import { typeColors } from "../../config";
import Collapsible from "../Collapsible";
import DurationLabel from "./DurationLabel";

type Props = {
  log: RenderLog | FetchLog | UseStateLog;
  label: string;
  thresholds: {
    warning: number;
    danger: number;
  };
};

export default function SimpleLogLine({ log, label, thresholds }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 rounded px-2 py-1 border border-gray-800 hover:border-gray-600 transition-all flex flex-col gap-2">
      <button
        className="w-full cursor-pointer flex justify-between flex-wrap gap-2 text-left"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <div className={`${typeColors[log.type]} select-none flex-1`}>
          {label}
        </div>

        <DurationLabel
          duration={log.duration}
          timestamp={log.timestamp}
          thresholds={thresholds}
        />
      </button>

      {open &&
        Object.entries(log.payload).map(([key, value]) => (
          <Collapsible key={key} label={key} value={value} />
        ))}
    </div>
  );
}
