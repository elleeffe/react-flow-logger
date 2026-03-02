// dashboard/src/App.tsx
import { useEffect, useRef, useState } from "react";
import type { ReactFlowLog } from "../../src/types";

type CollapsibleProps = {
  label: string;
  value: unknown;
};

function Collapsible({ label, value }: CollapsibleProps) {
  const [open, setOpen] = useState(false);
  const isObject = typeof value === "object" && value !== null;

  return (
    <div className="ml-6 mt-1">
      <div
        className="cursor-pointer text-gray-400 hover:text-gray-100 select-none transition-colors"
        onClick={() => setOpen(!open)}
      >
        {label}: {isObject ? (open ? "" : "{…}") : String(value)}
      </div>
      {open && isObject && (
        <div className="ml-4 mt-1 p-2 bg-gray-900 rounded text-gray-300 border border-gray-700">
          <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const typeColors: Record<string, string> = {
  useState: "text-blue-400",
  useEffect: "text-yellow-400",
  useMemo: "text-purple-400",
  useCallback: "text-pink-400",
  render: "text-green-400",
  "fetch:start": "text-red-400",
  "fetch:end": "text-red-600",
};

// formatta timestamp in HH:MM:SS.mmm
function formatTime(ts: number) {
  const d = new Date(ts);
  return (
    d.toLocaleTimeString() +
    "." +
    String(d.getMilliseconds()).padStart(3, "0")
  );
}

export default function App() {
  const [logs, setLogs] = useState<ReactFlowLog[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Connetti WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${window.location.host}`);

    socket.onmessage = (event) => {
      const log: ReactFlowLog = JSON.parse(event.data);
      setLogs((prev) => [...prev, log]);
    };

    return () => socket.close();
  }, []);

  // Scroll automatico in fondo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="min-h-screen p-6 font-mono text-sm bg-black text-gray-100">
      <div className="space-y-2">
        {logs.map((log, i) => (
          <LogLine key={i} log={log} />
        ))}
      </div>

      {/* cursore lampeggiante terminale */}
      <div ref={bottomRef} className="mt-2 flex items-center">
        <span className="animate-pulse text-green-400">█</span>
      </div>
    </div>
  );
}

function LogLine({ log }: { log: ReactFlowLog }) {
  const [open, setOpen] = useState(false);
  const color = typeColors[log.type] || "text-green-400";
  const entries = Object.entries(log.payload);

  const logId = "id" in log.payload ? (log.payload as any).id : "";
  const time = formatTime(log.timestamp);

  return (
    <div className="bg-gray-900 rounded px-2 py-1 border border-gray-800 hover:border-gray-600 transition-all flex flex-col gap-2">
      {/* log principale cliccabile */}
      <div className="w-full cursor-pointer flex justify-between flex-wrap gap-2" onClick={() => setOpen(!open)}>
        <div className={`${color} select-none flex-1`}>
          [{log.type}] {logId}
        </div>

        {/* timestamp a destra */}
        <div className="text-gray-500 text-xs flex-shrink-0">{time}</div>
      </div>

      {/* payload collassabile */}
      {open &&
        entries.map(([key, value]) => (
          <Collapsible key={key} label={key} value={value} />
        ))}
    </div>
  );
}