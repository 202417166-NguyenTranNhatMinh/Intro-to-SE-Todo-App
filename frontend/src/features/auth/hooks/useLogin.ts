import { startGoogleLogin } from "../api";

export function useLogin() {
  return {
    loginWithGoogle: startGoogleLogin,
  };
}