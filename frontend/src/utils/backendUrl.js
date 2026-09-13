/**
 * Resolves the backend base URL dynamically for production & development.
 * Backend production URL: https://propsestate.onrender.com
 */
export const getBackendBaseUrl = () => {
  let raw = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_BACKEND_URL;

  if (typeof raw === "string" && raw.trim()) {
    let clean = raw.trim();
    if (clean.includes("||")) {
      const parts = clean.split("||").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      clean = parts.find((p) => p.startsWith("https://") || p.startsWith("http://")) || parts[0];
    }
    clean = clean.replace(/^["']|["']$/g, "").replace(/\/+$/, "").replace(/\/api$/, "");
    if (clean && clean !== "undefined" && clean !== "null") {
      // In production browser, if env var points to localhost, default to production backend
      if (
        typeof window !== "undefined" &&
        window.location &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1" &&
        clean.includes("localhost")
      ) {
        return "https://propsestate.onrender.com";
      }
      return clean;
    }
  }

  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://propsestate.onrender.com";
  }

  return "http://localhost:8080";
};

export const getImageUrl = (url, fallback) => {
  const defaultFallback = fallback || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
  if (!url) return defaultFallback;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = getBackendBaseUrl();
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};

