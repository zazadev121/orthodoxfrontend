import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "./api.js";
import { mergeWords } from "./editorial.js";
import { baseEditorialWords } from "./editorial-words.js";
const Context = createContext(null);
export function EditorialProvider({ children }) {
  const [catalog, setCatalog] = useState({
    ready: null,
    authors: [],
    doctrines: [],
    blocks: [],
    editions: [],
  });
  const [version, setVersion] = useState(0),
    [error, setError] = useState(null);
  const request = useRef(0);
  const refresh = useCallback(async () => {
    const id = ++request.current;
    try {
      const next = await api("/cms/catalog");
      if (id === request.current) {
        setCatalog(next);
        setError(null);
        setVersion((v) => v + 1);
      }
      return next;
    } catch (e) {
      if (id === request.current) {
        if (e.message === "HTTP 404")
          setCatalog((old) => ({ ...old, ready: false }));
        else setError(e);
      }
      throw e;
    }
  }, []);
  useEffect(() => {
    const reload = () => refresh().catch(() => {});
    reload();
    const onVisible = () => {
      if (document.visibilityState === "visible") reload();
    };
    const timer = setInterval(onVisible, 30000);
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel("orthodox-editorial-updates");
    if (channel) channel.onmessage = reload;
    window.addEventListener("focus", reload);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("editorial-updated", reload);
    return () => {
      request.current++;
      clearInterval(timer);
      channel?.close();
      window.removeEventListener("focus", reload);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("editorial-updated", reload);
    };
  }, [refresh]);
  const value = {
    ...catalog,
    version,
    error,
    refresh,
    words: (base, prefix, language) =>
      mergeWords(base, catalog.blocks, prefix, language),
    text: (key, language, fallback = "") => {
      const b = catalog.blocks.find((row) => row.key === key);
      return b ? (b[`text_${language}`] ?? fallback) : fallback;
    },
    visible: (key) =>
      catalog.blocks.find((row) => row.key === `visibility.home.${key}`)
        ?.text_en !== "false",
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useEditorial() {
  const value = useContext(Context);
  if (!value) throw Error("EditorialProvider is required.");
  return value;
}
export function useEditorialWords(language) {
  const cms = useEditorial();
  return cms.words(baseEditorialWords(language), "editorial", language);
}
export function notifyEditorialChange() {
  window.dispatchEvent(new Event("editorial-updated"));
  if (typeof BroadcastChannel !== "undefined") {
    const c = new BroadcastChannel("orthodox-editorial-updates");
    c.postMessage({ changed: true });
    c.close();
  }
}
export function useEditorialResource(path, { enabled = true } = {}) {
  const { version } = useEditorial();
  const [state, setState] = useState({
    path: null,
    data: null,
    error: null,
    loading: true,
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const controller = new AbortController();
    setState((s) => ({
      ...s,
      path,
      data: s.path === path ? s.data : null,
      loading: !s.data || s.path !== path,
      error: null,
    }));
    api(path, { signal: controller.signal })
      .then((data) => {
        if (active) setState({ path, data, error: null, loading: false });
      })
      .catch((error) => {
        if (active) setState((s) => ({ ...s, path, error, loading: false }));
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [path, version, enabled, attempt]);
  return { ...state, retry: () => setAttempt((v) => v + 1) };
}
