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
    <main
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        fontFamily: "system-ui,sans-serif",
      }}
    >
      <h1>SaaS Notes</h1>
      <p>Health:{status}</p>
      <p>
        <a href="/login">Login</a>
      </p>
      <p>
        <a href="/notes">Notes</a>
      </p>
    </main>
  );
}
