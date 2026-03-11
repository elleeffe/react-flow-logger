// dashboard/src/App.tsx
import { useEffect, useRef, useState } from "react";
import type { ReactFlowLog } from "../../src/types";
import ClearLogsButton from "./components/ClearLogs";
import Header from "./components/Header";
import LogLine from "./components/LogLine";
import LogTypeFilter from "./components/LogTypeFilter";

export default function App() {
	const [logs, setLogs] = useState<ReactFlowLog[]>([]);
	const [filterTypes, setFilterTypes] = useState<ReactFlowLog["type"][]>([]);
	const bottomRef = useRef<HTMLDivElement>(null);

	// Connetti WebSocket
	useEffect(() => {
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";

		// <-- CORRETTO: porta 5000, non window.location.host
		const socket = new WebSocket(`${protocol}://localhost:5000`);

		socket.onmessage = (event) => {
			const log: ReactFlowLog = JSON.parse(event.data);
			setLogs((prev) => [...prev, log]);
		};

		return () => socket.close();
	}, []);

	// Scroll automatico in fondo
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [logs]);

	const visibleLogs =
		filterTypes.length === 0
			? logs
			: logs.filter((l) => filterTypes.includes(l.type));

	return (
		<div className="min-h-screen font-mono text-sm bg-black text-gray-100">
			<Header>
				<div className="flex items-center gap-3 justify-between flex-wrap w-full lg:w-auto lg:flex-1">
					<LogTypeFilter selected={filterTypes} onChange={setFilterTypes} />
					<ClearLogsButton onClick={() => setLogs([])} />
				</div>
			</Header>
			<div className="space-y-2 p-6">
				{visibleLogs.map((log, i) => (
					<LogLine
						key={`log-${log.timestamp}-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							i
						}`}
						log={log}
					/>
				))}

				{/* cursore lampeggiante terminale */}
				<div ref={bottomRef} className="mt-2 flex items-center">
					<span className="animate-pulse text-green-400">█</span>
				</div>
			</div>
		</div>
	);
}
