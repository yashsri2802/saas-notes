"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@acme.test");
  const [password, setPassword] = useState("password");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Login Failed");
      return;
    }

    const data = await res.json();
    setToken(data.token);
    localStorage.setItem("token", data.token);
  }

  return (
    <section style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="card" style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>
          Welcome back
        </h1>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#475569" }}>Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#475569" }}>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        {error && (
          <p style={{ marginTop: 12, fontSize: 12, color: "#dc2626" }}>
            {error}
          </p>
        )}
        {token && (
          <p style={{ marginTop: 12, fontSize: 12, color: "#059669" }}>
            Token saved to localStorage. Login Successful!
          </p>
        )}
        <p style={{ marginTop: 16, fontSize: 12, color: "#64748b" }}>
          Test: admin@acme.test, user@acme.test, admin@globex.test,
          user@globex.test (password: password)
        </p>
      </div>
    </section>
  );
}
