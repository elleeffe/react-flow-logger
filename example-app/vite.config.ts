// https://vite.dev/config/

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
	},
	optimizeDeps: {
		exclude: ["react-flow-logger"],
	},
});
