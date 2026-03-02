import { useEffect, useState } from "react";

type Log = {
  type: string;
  payload: any;
  timestamp: number;
};

export default function App() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onmessage = (event) => {
      const log = JSON.parse(event.data);
      setLogs((prev) => [log, ...prev]);
    };

    return () => socket.close();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h1>React Flow Logger</h1>
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <strong>{log.type}</strong>
          <pre>{JSON.stringify(log.payload, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}