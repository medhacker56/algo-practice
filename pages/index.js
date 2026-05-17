import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = mode === "login"
        ? { action: "login", email, password }
        : { action: "register", email, password, name };

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">{mode === "login" ? "Sign in" : "Register"}</h1>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <form onSubmit={submit} className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="block text-sm">Name</label>
                <input className="mt-1 p-2 border rounded w-full" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            <div>
              <label className="block text-sm">Email</label>
              <input type="email" required className="mt-1 p-2 border rounded w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm">Password</label>
              <input type="password" required className="mt-1 p-2 border rounded w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="flex items-center justify-between">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
              <button type="button" className="text-sm text-gray-600" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Create an account" : "Have an account? Sign in"}</button>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-500">
            Demo credentials: <strong>demo@algo.app</strong> / <strong>password123</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
