// dashboard/src/App.tsx
import { type DependencyList, useEffect, useRef, useState } from "react";
import type { ReactFlowLog } from "../../src/types";
import ClearLogsButton from "./components/ClearLogs";
import Header from "./components/Header";
import LogLine from "./components/LogLine";
import LogTypeFilter from "./components/LogTypeFilter";

type DepsHistory = Record<string, { timestamp: number; deps: unknown[] }[]>;

function hasDeps(
	payload: ReactFlowLog["payload"],
): payload is { id: string; deps: DependencyList } {
	return (
		typeof payload === "object" &&
		payload !== null &&
		"id" in payload &&
		"deps" in payload &&
		Array.isArray((payload as any).deps)
	);
}

function getPrevDeps(
	log: ReactFlowLog,
	depsHistory: DepsHistory,
): DependencyList | undefined {
	if (!hasDeps(log.payload)) return undefined;

	const key = `${log.type}:${log.payload.id}`;
	const history = depsHistory[key];

	if (!history) return undefined;

	const prev = history
		.filter((entry) => entry.timestamp < log.timestamp)
		.slice(-1)[0];

	return prev?.deps as DependencyList | undefined;
}

export default function App() {
	const [logs, setLogs] = useState<ReactFlowLog[]>([]);
	const [filterTypes, setFilterTypes] = useState<ReactFlowLog["type"][]>([]);
	const [depsHistory, setDepsHistory] = useState<DepsHistory>({});

	const bottomRef = useRef<HTMLDivElement>(null);

	// Connetti WebSocket
	useEffect(() => {
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";

		const socket = new WebSocket(`${protocol}://localhost:5000`);

		socket.onmessage = (event) => {
			const log: ReactFlowLog = JSON.parse(event.data);

			setLogs((prev) => [...prev, log]);

			// aggiorniamo lo storico deps se il log contiene deps
			if (hasDeps(log.payload)) {
				const key = `${log.type}:${log.payload.id}`;

				setDepsHistory((prev) => {
					const history = prev[key] ?? [];

					return {
						...prev,
						[key]: [
							...history,
							{
								timestamp: log.timestamp,
								//@ts-expect-error
								deps: log.payload.deps,
							},
						],
					};
				});
			}
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
					<ClearLogsButton
						onClick={() => {
							setLogs([]);
							setDepsHistory({});
						}}
					/>
				</div>
			</Header>

			<div className="space-y-2 p-6">
				{visibleLogs.map((log, i) => {
					const prevDeps = getPrevDeps(log, depsHistory);

					return (
						<LogLine
							key={`log-${log.timestamp}-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								i
							}`}
							log={log}
							prevDeps={prevDeps}
						/>
					);
				})}

				{/* cursore lampeggiante terminale */}
				<div ref={bottomRef} className="mt-2 flex items-center">
					<span className="animate-pulse text-green-400">█</span>
				</div>
			</div>
		</div>
	);
}
