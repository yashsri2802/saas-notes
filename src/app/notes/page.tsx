"use client";
import { useEffect, useState } from "react";

type Note = { id: string; title: string; content: string; createdAt: string };

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<"FREE" | "PRO" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  async function load() {
    setError(null);
    const res = await fetch("/api/notes", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      setError("Failed to load notes");
      return;
    }
    const data = await res.json();
    setNotes(data.notes);
    setPlan(data.plan);
  }

  useEffect(() => {
    setMounted(true);
    try {
      const t = localStorage.getItem("token");
      setToken(t);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (token) {
      load();
    }
  }, [token]);

  async function createNote() {
    setError(null);
    if (plan === "FREE" && notes.length >= 3) {
      setError("Free plan limit reached. Upgrade to Pro to create more notes");
      return;
    }
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) {
      let msg = "Failed to create note";
      try {
        const j = await res.json();
        msg = j.error || msg;
      } catch {
        msg = await res.text();
      }
      setError(msg || "Failed to create note");
      await load();
      return;
    }
    setTitle("");
    setContent("");
    await load();
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    await load();
  }

  function startEdit(n: Note) {
    setEditId(n.id);
    setEditTitle(n.title);
    setEditContent(n.content);
  }

  function cancelEdit() {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  }

  async function saveEdit() {
    if (!editId) return;
    const res = await fetch(`/api/notes/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });

    if (!res.ok) {
      setError("Failed to update note");
      return;
    }
    cancelEdit();
    await load();
  }

  async function upgrade() {
    if (!token) return;
    const res = await fetch("/api/tenants/me/upgrade", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) await load();
  }

  if (!mounted) {
    return (
      <section>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>
          Notes
        </h1>
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>Notes</h1>
        <a className="btn btn-outline" href="/upgrade">
          Upgrade
        </a>
      </div>
      {!token && (
        <p style={{ color: "#475569" }}>
          Please{" "}
          <a
            href="/login"
            style={{ color: "#6d28d9", textDecoration: "underline" }}
          >
            login
          </a>
          .
        </p>
      )}
      {plan === "FREE" && notes.length >= 3 && (
        <div
          style={{
            borderRadius: 14,
            border: "1px solid #f59e0b33",
            background: "#fffbeb",
            padding: 16,
          }}
        >
          <p style={{ fontWeight: 600, color: "#92400e" }}>
            Free plan limit reached.
          </p>
          <p style={{ color: "#b45309", fontSize: 14 }}>
            Upgrade to Pro for unlimited notes.
          </p>
          <div style={{ marginTop: 8 }}>
            <a className="btn btn-primary" href="/upgrade">
              Upgrade to Pro
            </a>
          </div>
        </div>
      )}
      <div className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
        <div
          style={{ display: "grid", gap: 40, gridTemplateColumns: "0.3fr 0.65fr" }}
        >
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={createNote}
            disabled={plan === "FREE" && notes.length >= 3}
          >
            Create
          </button>
        </div>
      </div>
      {error && <p style={{ fontSize: 12, color: "#dc2626" }}>{error}</p>}
      <ul style={{ display: "grid", gap: 12 }}>
        {notes.map((n) => (
          <li key={n.id} className="card" style={{ padding: 16 }}>
            {editId === n.id ? (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <input
                  className="input"
                  placeholder="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-primary" onClick={saveEdit}>
                    Save
                  </button>
                  <button className="btn btn-outline" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <p style={{ fontWeight: 600 }}>{n.title}</p>
                  <p style={{ color: "#475569", fontSize: 14 }}>{n.content}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => startEdit(n)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => deleteNote(n.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
