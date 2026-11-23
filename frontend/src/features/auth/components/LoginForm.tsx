import { useLogin } from "../hooks/useLogin";

function GoogleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.21c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.46h3.14c1.84-1.69 2.91-4.18 2.91-7.23Z" />
      <path fill="#34A853" d="M12 21.75c2.62 0 4.82-.87 6.42-2.35l-3.14-2.44c-.87.58-1.98.93-3.28.93-2.53 0-4.67-1.71-5.44-4.01H3.32v2.52A9.75 9.75 0 0 0 12 21.75Z" />
      <path fill="#FBBC05" d="M6.56 13.88A5.86 5.86 0 0 1 6.25 12c0-.65.11-1.28.31-1.88V7.6H3.32A9.75 9.75 0 0 0 2.25 12c0 1.58.38 3.07 1.07 4.4l3.24-2.52Z" />
      <path fill="#EA4335" d="M12 6.11c1.42 0 2.69.49 3.69 1.44l2.77-2.77A9.37 9.37 0 0 0 12 2.25a9.75 9.75 0 0 0-8.68 5.35l3.24 2.52C7.33 7.82 9.47 6.11 12 6.11Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LoginForm() {
  const { loginWithGoogle } = useLogin();

  return (
    <section className="login-card" aria-labelledby="login-title">
      <header className="login-card__header">
        <h1 id="login-title">Sign in to PulseFlow</h1>
        <p>
          Choose your preferred sign-in method to continue to
          <br />
          your workspace.
        </p>
      </header>

      <div className="login-card__body">
        <button className="google-button" type="button" onClick={loginWithGoogle}>
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <div className="login-divider" />

        <div className="security-note">
          <LockIcon />
          <span>Enterprise-grade security &amp; SOC 2 compliant</span>
        </div>

        <p className="legal-copy">
          By continuing, you agree to PulseFlow&apos;s{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
}
