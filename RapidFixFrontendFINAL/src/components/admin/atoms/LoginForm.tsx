"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { C } from "@/lib/constants";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !password) return setError("Email and password required");
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // AuthContext sets staff — the admin shell re-renders automatically
    } catch (e: any) {
      setError(e?.error ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "9px 11px",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 4,
    fontSize: 13,
    color: C.text,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
      }}
    >
      <div
        style={{
          width: 360,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: 32,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>
            RepairOSS
          </div>
          <div style={{ fontSize: 13, color: C.textSec, marginTop: 4 }}>
            Sign in to your account
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.textSec,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 5,
              }}
            >
              Email
            </label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="you@repaiross.com"
              autoFocus
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.textSec,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 5,
              }}
            >
              Password
            </label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: 12,
              padding: "8px 10px",
              background: "#fef2f2",
              border: `1px solid #fecaca`,
              borderRadius: 4,
              fontSize: 12,
              color: C.danger,
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "10px",
            borderRadius: 4,
            background: loading ? C.textMuted : C.accent,
            border: "none",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
