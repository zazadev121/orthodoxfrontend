import { createClient } from "@supabase/supabase-js";
const base = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(
  /\/$/,
  "",
);
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const auth = url && key ? createClient(url, key) : null;
export async function api(
  path,
  { token, headers = {}, signal, ...options } = {},
) {
  const requestSignal =
    signal && AbortSignal.any
      ? AbortSignal.any([signal, AbortSignal.timeout(40000)])
      : signal || AbortSignal.timeout(40000);
  let response;
  const target = new URL(path, "https://editorial.local");
  const isPublicRead =
    !token &&
    (!options.method || options.method === "GET") &&
    /^\/(cms\/catalog|authors\/[^/]+|quotes|prayers|writings(?:\/[^/]+)?|doctrines(?:\/[^/]+)?|bible\/(?:editorial|daily))$/.test(
      target.pathname,
    );
  if (url && key && isPublicRead) {
    const endpoint = new URL(`${url}/functions/v1/public-content`);
    endpoint.search = target.search;
    endpoint.searchParams.set("path", target.pathname);
    try {
      const edge = await fetch(endpoint, {
        signal: requestSignal,
        headers: { apikey: key },
      });
      // A missing/not-yet-deployed reader falls back to the existing API.
      if (
        edge.ok ||
        (edge.status === 404 &&
          (
            await edge
              .clone()
              .json()
              .catch(() => ({}))
          ).code !== "NOT_FOUND")
      )
        response = edge;
    } catch (error) {
      if (requestSignal.aborted) throw error;
    }
  }
  if (!response)
    response = await fetch(`${base}/api${path}`, {
      ...options,
      signal: requestSignal,
      headers: {
        ...(typeof options.body === "string"
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
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
    error.status = response.status;
    throw error;
  }
  return data;
}
