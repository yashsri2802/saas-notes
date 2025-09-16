"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [name, setName] = useState("Acme Admin");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      setToken(t);
    } catch {}
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Please login first.");
      return;
    }
    setProcessing(true);
    // Mock payment success; in real app integrate Stripe or similar
    await new Promise((r) => setTimeout(r, 800));
    const res = await fetch("/api/tenants/me/upgrade", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProcessing(false);
    if (!res.ok) {
      setError("Upgrade failed.");
      return;
    }
    router.push("/notes");
  }

  return (
    <section style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="card" style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Upgrade to Pro</h1>
        <p style={{ color: "#475569", marginBottom: 16 }}>
          Mock checkout. No real charge.
        </p>
        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#475569" }}>
              Card number
            </label>
            <input
              className="input"
              value={card}
              onChange={(e) => setCard(e.target.value)}
            />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#475569" }}>
              Name on card
            </label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={processing}
            className="btn btn-primary"
          >
            {processing ? "Processing…" : "Pay and Upgrade"}
          </button>
        </form>
        {error && (
          <p style={{ marginTop: 12, fontSize: 12, color: "#dc2626" }}>
            {error}
          </p>
        )}
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <a href="/notes" style={{ color: "#6d28d9", textDecoration: "none" }}>
            Cancel
          </a>
        </p>
      </div>
    </section>
  );
}
