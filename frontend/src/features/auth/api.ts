import type { AuthUser } from "./types";

type ApiResponse<T> = { status: number; message: string; data: T | null };
type CurrentUserResponse = { user: AuthUser };

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not load your account (HTTP ${response.status}).`);
  }

  const result = (await response.json()) as ApiResponse<CurrentUserResponse>;
  if (!result.data) throw new Error("Account response is missing data.");
  return result.data.user;
}

export function startGoogleLogin() {
  window.location.assign("/api/auth/google");
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not sign out (HTTP ${response.status}).`);
  }
}