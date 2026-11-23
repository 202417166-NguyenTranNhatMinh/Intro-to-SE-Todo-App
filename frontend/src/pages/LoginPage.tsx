import { LoginForm } from "../features/auth/components/LoginForm";
import { useAuth } from "../features/auth/hooks/useAuth";

export function LoginPage() {
  const auth = useAuth();

  return (
    <main className="login-page">
      {auth.status === "loading" && (
        <section className="login-card login-card--message" aria-live="polite">
          <p>Loading your account...</p>
        </section>
      )}

      {auth.status === "unauthenticated" && <LoginForm />}

      {auth.status === "error" && (
        <section className="login-card login-card--message" role="alert">
          <h1>Could not load your account</h1>
          <p>{auth.message}</p>
          <button className="google-button" type="button" onClick={() => void auth.refresh()}>
            Try again
          </button>
        </section>
      )}

      {auth.status === "authenticated" && (
        <section className="login-card account-card" aria-labelledby="account-title">
          <header className="login-card__header">
            {auth.user.avatarUrl ? (
              <img
                className="account-avatar"
                src={auth.user.avatarUrl}
                alt=""
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="account-avatar account-avatar--placeholder" aria-hidden="true">
                {auth.user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 id="account-title">Welcome, {auth.user.displayName}</h1>
            <p>Your account information was loaded from the database.</p>
          </header>
          <dl className="account-details">
            <div>
              <dt>Name</dt>
              <dd>{auth.user.displayName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{auth.user.email}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>{auth.user.id}</dd>
            </div>
          </dl>
          <div className="account-actions">
            <button className="google-button" type="button" onClick={() => void auth.signOut()}>
              Sign out
            </button>
          </div>
        </section>
      )}
    </main>
  );
}