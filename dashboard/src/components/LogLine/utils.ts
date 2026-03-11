// formatta timestamp in HH:MM:SS.mmm
export function formatTime(ts: number) {
	const d = new Date(ts);
	return `${d.toLocaleTimeString()}.${String(d.getMilliseconds()).padStart(3, "0")}`;
}

export const typeColors: Record<string, string> = {
	useState: "text-blue-400",
	useEffect: "text-yellow-400",
	useMemo: "text-purple-400",
	useCallback: "text-pink-400",
	render: "text-green-400",
	"fetch:start": "text-red-400",
	"fetch:end": "text-red-600",
};
