"use client";
import { useState, useEffect, useRef } from "react";
import { C } from "@/lib/constants";
import { customersApi } from "@/lib/api";
import { Badge } from "../atoms/Badge";
import { DataTable } from "../atoms/DataTable";
import type { Customer, Column } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const Mono = ({ v }: { v: string }) => (
  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12 }}>{v}</span>
);
const Muted = ({ v }: { v: string }) => (
  <span style={{ color: C.textSec, fontSize: 12 }}>{v}</span>
);

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ── Add Customer Modal ────────────────────────────────────────────────────────

interface AddCustomerModalProps {
  onClose: () => void;
  onCreated: (c: Customer) => void;
}

function AddCustomerModal({ onClose, onCreated }: AddCustomerModalProps) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", whatsapp_opt_in: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.name.trim()) return setError("Name is required");
    if (!form.phone.trim()) return setError("Phone is required");
    setSaving(true);
    setError(null);
    try {
      const customer = await customersApi.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        whatsapp_opt_in: form.whatsapp_opt_in,
      });
      onCreated(customer);
    } catch (e: any) {
      setError(e?.error ?? "Failed to create customer");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px",
    background: C.bg, border: `1px solid ${C.border}`,
    borderRadius: 4, fontSize: 13, color: C.text,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: C.textSec,
    textTransform: "uppercase", letterSpacing: "0.05em",
    display: "block", marginBottom: 5,
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: C.surface, borderRadius: 6,
        border: `1px solid ${C.border}`,
        width: 420, padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: C.text }}>Add Customer</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.textSec, fontSize: 18, lineHeight: 1 }}
          >×</button>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input ref={nameRef} style={inputStyle} value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Rahul Sharma" />
          </div>
          <div>
            <label style={labelStyle}>Phone *</label>
            <input style={inputStyle} value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91 98000 00000" />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="rahul@example.com" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.whatsapp_opt_in}
              onChange={(e) => set("whatsapp_opt_in", e.target.checked)}
              style={{ accentColor: C.accent, width: 14, height: 14 }}
            />
            <span style={{ fontSize: 13, color: C.text }}>WhatsApp opt-in</span>
          </label>
        </div>

        {error && (
          <div style={{
            marginTop: 12, padding: "8px 10px",
            background: "#fef2f2", border: `1px solid #fecaca`,
            borderRadius: 4, fontSize: 12, color: C.danger,
          }}>{error}</div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              padding: "7px 14px", borderRadius: 4, fontSize: 13,
              background: "none", border: `1px solid ${C.border}`,
              color: C.textSec, cursor: "pointer",
            }}
          >Cancel</button>
          <button
            onClick={submit}
            disabled={saving}
            style={{
              padding: "7px 16px", borderRadius: 4, fontSize: 13,
              background: saving ? C.textMuted : C.accent,
              border: "none", color: "#fff",
              cursor: saving ? "not-allowed" : "pointer", fontWeight: 600,
            }}
          >{saving ? "Saving…" : "Add Customer"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Customer Detail Drawer ────────────────────────────────────────────────────

interface DrawerProps {
  customer: Customer;
  onClose: () => void;
  onUpdated: (c: Customer) => void;
}

function CustomerDrawer({ customer, onClose, onUpdated }: DrawerProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: customer.name,
    email: customer.email ?? "",
    whatsapp_opt_in: customer.whatsapp_opt_in,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const updated = await customersApi.update(customer.id, {
        name: form.name.trim() || undefined,
        email: form.email.trim() || undefined,
        whatsapp_opt_in: form.whatsapp_opt_in,
      });
      onUpdated(updated);
      setEditing(false);
    } catch (e: any) {
      setError(e?.error ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  const fieldRow = (label: string, value: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: C.text }}>{value}</span>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "7px 10px",
    background: C.bg, border: `1px solid ${C.border}`,
    borderRadius: 4, fontSize: 13, color: C.text,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.25)" }}
        onClick={onClose}
      />
      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 360, zIndex: 41,
        background: C.surface, borderLeft: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
      }}>
        {/* Drawer header */}
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>Customer Detail</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.textSec, fontSize: 20, lineHeight: 1 }}
          >×</button>
        </div>

        {/* Avatar + name */}
        <div style={{
          padding: "20px", borderBottom: `1px solid ${C.borderFaint}`,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: C.accent + "20",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: C.accent,
          }}>
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{customer.name}</div>
            <div style={{ fontSize: 12, color: C.textSec }}>{customer.phone}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {!editing ? (
            <>
              {fieldRow("Phone", <Mono v={customer.phone} />)}
              {fieldRow("Email", customer.email ?? <span style={{ color: C.textMuted }}>—</span>)}
              {fieldRow("WhatsApp", (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 12, fontWeight: 500,
                  color: customer.whatsapp_opt_in ? C.success : C.textMuted,
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: customer.whatsapp_opt_in ? C.success : C.textMuted,
                    display: "inline-block",
                  }} />
                  {customer.whatsapp_opt_in ? "Opted in" : "Opted out"}
                </span>
              ))}
              {fieldRow("Member since", formatDate(customer.created_at))}
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>Name</label>
                <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>Email</label>
                <input style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="optional" />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.whatsapp_opt_in}
                  onChange={(e) => set("whatsapp_opt_in", e.target.checked)}
                  style={{ accentColor: C.accent, width: 14, height: 14 }}
                />
                <span style={{ fontSize: 13, color: C.text }}>WhatsApp opt-in</span>
              </label>
              {error && (
                <div style={{ padding: "7px 10px", background: "#fef2f2", border: `1px solid #fecaca`, borderRadius: 4, fontSize: 12, color: C.danger }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: "14px 20px", borderTop: `1px solid ${C.border}`,
          display: "flex", gap: 8, justifyContent: "flex-end",
        }}>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: "7px 16px", borderRadius: 4, fontSize: 13,
                background: C.accent, border: "none",
                color: "#fff", cursor: "pointer", fontWeight: 600,
              }}
            >Edit</button>
          ) : (
            <>
              <button
                onClick={() => { setEditing(false); setError(null); }}
                style={{
                  padding: "7px 14px", borderRadius: 4, fontSize: 13,
                  background: "none", border: `1px solid ${C.border}`,
                  color: C.textSec, cursor: "pointer",
                }}
              >Cancel</button>
              <button
                onClick={save}
                disabled={saving}
                style={{
                  padding: "7px 16px", borderRadius: 4, fontSize: 13,
                  background: saving ? C.textMuted : C.accent,
                  border: "none", color: "#fff",
                  cursor: saving ? "not-allowed" : "pointer", fontWeight: 600,
                }}
              >{saving ? "Saving…" : "Save"}</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const LIMIT = 20;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    load();
  }, [debouncedSearch, page]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await customersApi.list({
        search: debouncedSearch || undefined,
        page,
        limit: LIMIT,
      });
      setCustomers(res.data);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.error ?? "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  const cols: Column<Customer>[] = [
    {
      key: "name",
      label: "Name",
      render: (r) => (
        <span style={{ fontWeight: 500, color: C.text }}>{r.name}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (r) => <Mono v={r.phone} />,
    },
    {
      key: "email",
      label: "Email",
      render: (r) =>
        r.email ? (
          <Muted v={r.email} />
        ) : (
          <span style={{ color: C.textMuted, fontSize: 12 }}>—</span>
        ),
    },
    {
      key: "whatsapp_opt_in",
      label: "WhatsApp",
      render: (r) => (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11, fontWeight: 500,
          color: r.whatsapp_opt_in ? C.success : C.textMuted,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: r.whatsapp_opt_in ? C.success : C.textMuted,
            display: "inline-block",
          }} />
          {r.whatsapp_opt_in ? "Opted in" : "Opted out"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (r) => <Muted v={formatDate(r.created_at)} />,
    },
  ];

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16, gap: 12,
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <i className="ti ti-search" style={{
            position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)",
            color: C.textMuted, fontSize: 14, pointerEvents: "none",
          }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            style={{
              width: "100%", paddingLeft: 32, paddingRight: 10,
              paddingTop: 8, paddingBottom: 8,
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 4, fontSize: 13, color: C.text,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Count + Add */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!loading && (
            <span style={{ fontSize: 12, color: C.textSec }}>
              {total.toLocaleString()} customer{total !== 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 4,
              background: C.accent, border: "none",
              color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <i className="ti ti-plus" style={{ fontSize: 14 }} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          marginBottom: 12, padding: "9px 12px",
          background: "#fef2f2", border: `1px solid #fecaca`,
          borderRadius: 4, fontSize: 13, color: C.danger,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>{error}</span>
          <button
            onClick={load}
            style={{ background: "none", border: "none", color: C.danger, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
          >Retry</button>
        </div>
      )}

      {/* Table */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 4, overflow: "hidden",
      }}>
        {loading ? (
          // Skeleton rows
          <div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                display: "flex", gap: 16, padding: "12px 16px",
                borderBottom: `1px solid ${C.borderFaint}`,
              }}>
                {[180, 130, 160, 80, 90].map((w, j) => (
                  <div key={j} style={{
                    height: 12, borderRadius: 3,
                    background: C.borderFaint,
                    width: w,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }} />
                ))}
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div style={{
            padding: "48px 0", textAlign: "center",
            color: C.textMuted, fontSize: 13,
          }}>
            <i className="ti ti-users-off" style={{ fontSize: 28, display: "block", marginBottom: 8 }} />
            {debouncedSearch ? `No customers matching "${debouncedSearch}"` : "No customers yet"}
          </div>
        ) : (
          <div>
            {/* Header row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.4fr 2fr 1fr 1fr",
              padding: "9px 16px",
              background: C.bg,
              borderBottom: `1px solid ${C.border}`,
            }}>
              {cols.map((col) => (
                <span key={String(col.key)} style={{
                  fontSize: 11, fontWeight: 600,
                  color: C.textSec, textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {col.label}
                </span>
              ))}
            </div>

            {/* Data rows */}
            {customers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => setSelected(customer)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.4fr 2fr 1fr 1fr",
                  padding: "11px 16px",
                  borderBottom: `1px solid ${C.borderFaint}`,
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {cols.map((col) => (
                  <div key={String(col.key)} style={{ display: "flex", alignItems: "center" }}>
                    {col.render ? col.render(customer) : String(customer[col.key as keyof Customer] ?? "—")}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex", justifyContent: "flex-end",
          alignItems: "center", gap: 8, marginTop: 12,
        }}>
          <span style={{ fontSize: 12, color: C.textSec }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "5px 10px", borderRadius: 4, fontSize: 12,
              background: C.surface, border: `1px solid ${C.border}`,
              color: page === 1 ? C.textMuted : C.text,
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >← Prev</button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "5px 10px", borderRadius: 4, fontSize: 12,
              background: C.surface, border: `1px solid ${C.border}`,
              color: page === totalPages ? C.textMuted : C.text,
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >Next →</button>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onCreated={(c) => {
            setCustomers((prev) => [c, ...prev]);
            setTotal((t) => t + 1);
            setShowAdd(false);
          }}
        />
      )}

      {selected && (
        <CustomerDrawer
          customer={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setCustomers((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
            setSelected(updated);
          }}
        />
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}