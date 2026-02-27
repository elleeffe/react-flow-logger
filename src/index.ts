// src/index.ts

// Controllo ambiente dev
const isDev =
  (typeof process !== "undefined" && process.env.NODE_ENV === "development") ||
  ((typeof import.meta !== "undefined" && (import.meta as any).env?.DEV));

// Controllo SSR: esegui solo in browser
if (isDev && typeof window !== "undefined") {
  console.log(
    "%c[React Flow Logger] Active in Dev Mode",
    "color: #00ff88; font-weight: bold;"
  );

  // Intercetta fetch automaticamente
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    console.log("[React Flow Logger] FETCH START", args[0]);
    const res = await originalFetch(...args);
    console.log("[React Flow Logger] FETCH END", args[0], res.status);
    return res;
  };
}