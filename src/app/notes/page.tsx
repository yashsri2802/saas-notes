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
      <main
        style={{
          maxWidth: 720,
          margin: "2rem auto",
          fontFamily: "system-ui,sans-serif",
        }}
      >
        <h1>Notes</h1>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "2rem auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Notes</h1>
      {!token && (
        <p>
          Please <a href="/login">login</a>.
        </p>
      )}
      {plan === "FREE" && notes.length >= 3 && (
        <div
          style={{
            background: "#fff3cd",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <strong>Free plan limit reached.</strong> Upgrade to Pro for unlimited
          notes.
          <div>
            <a href="/upgrade">
              <button>Upgrade to Pro</button>
            </a>
          </div>
        </div>
      )}
      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={createNote}
          disabled={plan === "FREE" && notes.length >= 3}
        >
          Create
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            {editId === n.id ? (
              <span>
                <input
                  placeholder="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  placeholder="Content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </span>
            ) : (
              <span>
                <strong>{n.title}</strong> - {n.content}{" "}
                <button onClick={() => startEdit(n)}>Edit</button>
                <button onClick={() => deleteNote(n.id)}>Delete</button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
