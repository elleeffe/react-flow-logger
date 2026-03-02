import { ReactFlowLog } from "./types";

let socket: WebSocket | null = null;
let queue: string[] = [];
let isConnecting = false;

function connect() {
  if (typeof window === "undefined") return;

  if (socket || isConnecting) return;

  isConnecting = true;

  socket = new WebSocket("ws://localhost:5000");

  socket.onopen = () => {
    isConnecting = false;

    // flush queue
    while (queue.length > 0) {
      const msg = queue.shift();
      if (msg) socket?.send(msg);
    }
  };

  socket.onclose = () => {
    socket = null;
    isConnecting = false;

    // auto reconnect
    setTimeout(connect, 1000);
  };

  socket.onerror = () => {
    socket = null;
    isConnecting = false;
  };
}

export function emitLog(log: ReactFlowLog) {
  if (typeof window === "undefined") return;

  const message = JSON.stringify({
    ...log,
    timestamp: Date.now(),
  });

  console.log("[React Flow Logger]", log.type, log.payload);

  connect();

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    queue.push(message);
  }
}