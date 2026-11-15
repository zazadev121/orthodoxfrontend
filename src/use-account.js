import { useEffect, useState } from "react";
import { auth, api } from "./api";
// One shared session/role state drives the header and admin route.
export function useAccount() {
  const [session, setSession] = useState(null),
    [checking, setChecking] = useState(!!auth),
    [sessionError, setSessionError] = useState(null);
  const [role, setRole] = useState({
    token: null,
    allowed: false,
    error: null,
  });
  useEffect(() => {
    if (!auth) return;
    let alive = true,
      version = 0;
    const { data } = auth.auth.onAuthStateChange((_event, current) => {
      version++;
      if (alive) {
        setSession(current);
        setChecking(false);
        setSessionError(null);
      }
    });
    const started = version;
    auth.auth
      .getSession()
      .then(({ data, error }) => {
        if (alive && started === version) {
          setSession(data.session);
          setSessionError(error);
          setChecking(false);
        }
      })
      .catch((error) => {
        if (alive) {
          setSessionError(error);
          setChecking(false);
        }
      });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);
  const token = session?.access_token;
  useEffect(() => {
    if (!token) {
      setRole({ token: null, allowed: false, error: null });
      return;
    }
    let alive = true;
    setRole({ token, allowed: false, error: null });
    api("/admin/me", { token })
      .then(() => {
        if (alive) setRole({ token, allowed: true, error: null });
      })
      .catch((error) => {
        if (alive) setRole({ token, allowed: false, error });
      });
    return () => {
      alive = false;
    };
  }, [token]);
  return {
    session,
    checking,
    allowed: !!token && role.token === token && role.allowed,
    error: sessionError || (role.token === token ? role.error : null),
  };
}
