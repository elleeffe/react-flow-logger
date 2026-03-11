export function formatTime(ts: number) {
	const d = new Date(ts);
	return `${d.toLocaleTimeString()}.${String(d.getMilliseconds()).padStart(3, "0")}`;
}
