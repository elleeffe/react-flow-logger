# React Flow Logger

Runtime flow logger for React applications (Dev only). Monitor fetch calls, state changes, renders, and hooks in a dedicated local dashboard.

---

## ✨ What is it?

React Flow Logger is a lightweight devtool that:

- Logs all fetch calls (start/end + status)
- Logs `useState` changes
- Logs `useEffect` triggers
- Logs `useMemo` recalculations
- Logs `useCallback` invocations
- Logs component renders (via HOC)
- Streams everything in real-time to a local dashboard

All logs are queued if the dashboard is not yet connected, ensuring you don't miss any events.

Dashboard runs on: **http://localhost:5000**

---

## 🚀 Installation

```bash
npm install github:elleeffe/react-flow-logger
```

or

```bash
pnpm add github:elleeffe/react-flow-logger
```

---

## 🖥 Start the Dashboard

After installation, simply run:

```bash
npx react-flow-logger
```

This will:

1. Start a local WebSocket server (port 5000)
2. Serve the dashboard UI
3. Auto-reconnect logs from your React app if not connected yet
4. Open dashboard at **http://localhost:5000**

> ⚠️ The dashboard must be running to view logs. Otherwise, logs fallback to `console.log`.

---

## 📦 Usage in Your React App

Import the hooks or HOC you want to monitor.

### 🔹 `useStateLogger`

```jsx
import { useStateLogger } from "react-flow-logger";

const [count, setCount] = useStateLogger("counter", 0);
```

Logs every state update.

---

### 🔹 `useEffectLogger`

```jsx
import { useEffectLogger } from "react-flow-logger";

useEffectLogger("fetchUsers", () => {
  fetch("/api/users");
}, []);
```

Logs effect triggers and dependencies.

---

### 🔹 `useMemoLogger`

```jsx
const computed = useMemoLogger(
  "expensiveCalc",
  () => heavyCalculation(data),
  [data]
);
```

Logs memo recalculations.

---

### 🔹 `useCallbackLogger`

```jsx
const handleClick = useCallbackLogger(
  "handleClick",
  () => console.log("clicked"),
  []
);
```

Logs callback invocations.

---

### 🔹 `withLogger` (Component Render Logging)

```jsx
import { withLogger } from "react-flow-logger";

function MyComponent() {
  return <>Hello</>;
}

export default withLogger(MyComponent);
```

Logs every render.

---

## 🌐 Fetch Interception

In development mode, the library automatically intercepts:

- `window.fetch`

and logs:

- Fetch start
- Fetch end (with status)

No configuration required.

---

## ⚙️ How It Works

```
Your React App
      ↓
React Flow Logger runtime (browser)
      ↓ WebSocket
Local Server (port 5000)
      ↓
Dashboard UI (real-time logs)
```

If the dashboard is not running:

- Logs are queued and sent once the dashboard connects
- Falls back to `console.log`
- No runtime errors occur

---

## 🔒 Dev Mode Only

The logger is completely silent in production builds:

```js
process.env.NODE_ENV === "development"
// or
import.meta.env.DEV
```

---

## 🧠 Architecture

The package contains:

- **Runtime logger** (browser)
- **WebSocket server** with auto-reconnect & queuing
- **Dashboard** (Vite + React)
- **CLI entrypoint**

Users only need:

```bash
npx react-flow-logger
```

---

## 📁 Project Structure

```
react-flow-logger/
 ├─ src/              # runtime library
 ├─ server/           # WebSocket server
 ├─ dashboard/        # Vite dashboard app
 ├─ cli.ts            # CLI entrypoint
 └─ dist/             # built output
```

---

## 🎯 Use Cases

- Debug complex state flows
- Monitor async data loading
- Understand render behavior
- Visualize hook activity
- Track fetch lifecycle
- Inspect logs in real-time dashboard

---

## 🧩 Example Workflow

```bash
# 1️⃣ Start logger server & dashboard
npx react-flow-logger

# 2️⃣ Run your React app
npm run dev

# 3️⃣ Open dashboard
# http://localhost:5000
```

Start interacting with your app — logs will appear live.

---

## 📜 License

MIT

---

## 👨‍💻 Author

Built with ❤️ for React developers.
