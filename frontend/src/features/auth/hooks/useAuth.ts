import { useCallback, useEffect, useState } from "react";
import { getCurrentUser, logout } from "../api";
import type { AuthUser } from "../types";

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: AuthUser }
  | { status: "error"; message: string };

export function useAuth() {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  const refresh = useCallback(async () => {
    setState({ status: "loading" });

    try {
      const user = await getCurrentUser();
      setState(user ? { status: "authenticated", user } : { status: "unauthenticated" });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Could not load your account.",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    try {
      await logout();
      setState({ status: "unauthenticated" });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Could not sign out.",
      });
    }
  }, []);

  return { ...state, refresh, signOut };
}