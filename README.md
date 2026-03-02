# React Flow Logger

Runtime flow logger for React applications (Dev only). Monitor fetch calls, state changes, renders and hooks in a dedicated local dashboard.

## ✨ What is it?

React Flow Logger is a lightweight devtool that:
* Logs all `fetch` calls
* Logs `useState` changes
* Logs `useEffect` triggers
* Logs `useMemo` recalculations
* Logs `useCallback` invocations
* Logs component renders (via HOC)

And streams everything to a local dashboard running on:

```
http://localhost:5000
```

## 🚀 Installation

```bash
npm install github:elleeffe/react-flow-logger
```

or

```bash
pnpm add github:elleeffe/react-flow-logger
```

## 🖥 Start the Dashboard

After installation, simply run:

```bash
npx react-flow-logger
```

This will:
* Start a local WebSocket server
* Serve the dashboard UI
* Open at: `http://localhost:5000`

## 📦 Usage in Your React App

Import the hooks or HOC you want to monitor.

### 🔹 useStateLogger

```js
import { useStateLogger } from "react-flow-logger";

const [count, setCount] = useStateLogger("counter", 0);
```

Logs every state update.

### 🔹 useEffectLogger

```js
import { useEffectLogger } from "react-flow-logger";

useEffectLogger("fetchUsers", () => {
  fetch("/api/users");
}, []);
```

Logs effect triggers and dependencies.

### 🔹 useMemoLogger

```js
const computed = useMemoLogger(
  "expensiveCalc",
  () => heavyCalculation(data),
  [data]
);
```

Logs memo recalculations.

### 🔹 useCallbackLogger

```js
const handleClick = useCallbackLogger(
  "handleClick",
  () => {
    console.log("clicked");
  },
  []
);
```

Logs callback invocations.

### 🔹 withLogger (Component Render Logging)

```js
import { withLogger } from "react-flow-logger";

function MyComponent() {
  return Hello;
}

export default withLogger(MyComponent);
```

Logs every render.

## 🌐 Fetch Interception

In development mode, the library automatically intercepts:

```
window.fetch
```

and logs:
* Fetch start
* Fetch end (with status)

No configuration required.

## ⚙️ How It Works

```
Your React App
      ↓
React Flow Logger runtime
      ↓ WebSocket
Local Server (port 5000)
      ↓
Dashboard UI
```

If the dashboard is not running:
* Logs fall back to `console.log`
* No crashes
* No runtime errors

## 🔒 Dev Mode Only

The logger is active only when:

```js
process.env.NODE_ENV === "development"
```

or

```js
import.meta.env.DEV
```

It is completely silent in production builds.

## 🧠 Architecture

The package contains:
* Runtime logger (browser)
* WebSocket server
* Dashboard (Vite + React)
* CLI entrypoint

Everything is bundled inside the npm package.

Users only need:

```bash
npx react-flow-logger
```

## 📁 Project Structure

```
react-flow-logger/
 ├─ src/              # runtime library
 ├─ server/           # WebSocket server
 ├─ dashboard/        # Vite dashboard app
 ├─ cli.ts            # CLI entrypoint
 └─ dist/             # built output
```

## 🎯 Use Cases

* Debug complex state flows
* Monitor async data loading
* Understand render behavior
* Visualize hook activity
* Track fetch lifecycle

## 🧩 Example Workflow

```bash
# 1️⃣ Start logger
npx react-flow-logger

# 2️⃣ Run your React app
npm run dev

# 3️⃣ Open dashboard
http://localhost:5000
```

Start interacting with your app — logs will appear live.

## 📜 License

MIT

## 👨‍💻 Author

Built with ❤️ for React developers.