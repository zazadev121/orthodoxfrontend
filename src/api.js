import { createClient } from "@supabase/supabase-js";
const base = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(
  /\/$/,
  "",
);
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const auth = url && key ? createClient(url, key) : null;
export async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${base}/api${path}`, {
    ...options,
    signal: AbortSignal.timeout(40000),
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.details?.map((d) => `${d.field}: ${d.message}`).join(" · ") ||
        data.error ||
        `HTTP ${response.status}`,
    );
    error.code = data.code;
    throw error;
  }
  return data;
}
