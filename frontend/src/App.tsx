import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ user: User }>;
      })
      .then((data) => setUser(data?.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  function loginWithGoogle() {
    window.location.assign("http://localhost:4000/api/auth/google");
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <main>
        <h1>To-do AI</h1>
        <button type="button" onClick={loginWithGoogle}>
          Continue with Google
        </button>
      </main>
    );
  }

  return (
    <main>
      {user.avatarUrl && (
        <img src={user.avatarUrl} alt="" width={48} height={48} />
      )}
      <p>Signed in as {user.displayName}</p>
      <p>{user.email}</p>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </main>
  );
}

export default App;