"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    fetch("/api/health").then(async (r) =>
      setStatus(JSON.stringify(await r.json()))
    );
  }, []);

  return (
    <section
      style={{
        display: "grid",
        gap: "24px",
        gridTemplateColumns: "1fr",
        alignItems: "center",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          Write, organize, and grow with{" "}
          <span style={{ color: "#6d28d9" }}>SaaS Notes</span>
        </h1>
        <p style={{ color: "#475569", fontSize: 18, marginBottom: 16 }}>
          A clean, fast notes app with multi-tenant access, free vs pro limits,
          and a delightful UI.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <a className="btn btn-primary" href="/notes">
            Open Notes
          </a>
          <a className="btn btn-outline" href="/login">
            Login
          </a>
        </div>
        <p style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>
          Health: {status}
        </p>
      </div>
      <div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                height: 12,
                width: "50%",
                borderRadius: 8,
                background: "#e2e8f0",
              }}
            />
            <div
              style={{
                height: 12,
                width: "66%",
                borderRadius: 8,
                background: "#e2e8f0",
              }}
            />
            <div
              style={{
                height: 12,
                width: "33%",
                borderRadius: 8,
                background: "#e2e8f0",
              }}
            />
            <div
              style={{
                height: 160,
                borderRadius: 16,
                background: "linear-gradient(135deg,#a78bfa,#6d28d9)",
              }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <span className="btn btn-outline">Learn more</span>
              <span className="btn btn-primary">Get started</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
