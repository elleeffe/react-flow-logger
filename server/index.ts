import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { WebSocketServer } from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 5000;

app.use(express.static(path.join(__dirname, "../dashboard")));

const server = app.listen(PORT, () => {
  console.log("React Flow Logger running on http://localhost:5000");
});

const wss = new WebSocketServer({ server });

let clients: any[] = [];

wss.on("connection", (ws) => {
  clients.push(ws);

  ws.on("message", (message) => {
    clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter((c) => c !== ws);
  });
});
