#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverPath = path.join(__dirname, "server/index.js");

console.log("🚀 Starting React Flow Logger on http://localhost:5000");

spawn("node", [serverPath], {
	stdio: "inherit",
});
