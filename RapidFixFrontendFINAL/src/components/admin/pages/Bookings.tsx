"use client";
import { useState, useEffect } from "react";
import { C, BOOKING_STATUS_CFG, BOOKING_SOURCE_CFG } from "@/lib/constants";
import { bookingsApi } from "@/lib/api";
import type { Booking, BookingStatus, Column } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const Mono = ({ v }: { v: string }) => (
  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12 }}>
    {v}
  </span>
);
const Muted = ({ v }: { v: string }) => (
  <span style={{ color: C.textSec, fontSize: 12 }}>{v}</span>
);

function formatSlot(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = BOOKING_STATUS_CFG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 8px",
        borderRadius: 99,
        background: cfg.bg,
        color: cfg.text,
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
        }}
      />
      {cfg.label}
    </span>
  );
}

// ── Source Chip ───────────────────────────────────────────────────────────────

function SourceChip({ source }: { source: string }) {
  const cfg = BOOKING_SOURCE_CFG[source] ?? { bg: C.bg, text: C.textSec };
  const icons: Record<string, string> = {
    online: "ti-world",
    whatsapp: "ti-brand-whatsapp",
    phone: "ti-phone",
    walkin: "ti-walk",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        borderRadius: 99,
        background: cfg.bg,
        color: cfg.text,
        fontSize: 11,
        fontWeight: 500,
        textTransform: "capitalize",
      }}
    >
      <i
        className={`ti ${icons[source] ?? "ti-circle"}`}
        style={{ fontSize: 11 }}
      />
      {source}
    </span>
  );
}

// ── Add Booking Modal ─────────────────────────────────────────────────────────

interface AddBookingModalProps {
  onClose: () => void;
  onCreated: (b: Booking) => void;
}

function AddBookingModal({ onClose, onCreated }: AddBookingModalProps) {
  const [form, setForm] = useState({
    customer_id: "",
    source: "phone",
    slot_at: "",
    service_notes: "",
    location_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 4,
    fontSize: 13,
    color: C.text,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: C.textSec,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: 5,
  };

  async function submit() {
    if (!form.customer_id.trim()) return setError("Customer ID is required");
    setSaving(true);
    setError(null);
    try {
      const booking = await bookingsApi.create({
        location_id: form.location_id.trim(),
        customer_id: form.customer_id.trim(),
        source: form.source,
        slot_at: form.slot_at || undefined,
        service_notes: form.service_notes.trim() || undefined,
      });
      onCreated(booking);
    } catch (e: any) {
      setError(e?.error ?? "Failed to create booking");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: 6,
          border: `1px solid ${C.border}`,
          width: 440,
          padding: 24,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 15, color: C.text }}>
            New Booking
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.textSec,
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Customer ID *</label>
            <input
              style={inputStyle}
              value={form.customer_id}
              onChange={(e) => set("customer_id", e.target.value)}
              placeholder="UUID from customers list"
            />
          </div>
          <div>
            <label style={labelStyle}>Source</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
            >
              {["phone", "whatsapp", "online", "walkin"].map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Slot Date & Time</label>
            <input
              style={inputStyle}
              type="datetime-local"
              value={form.slot_at}
              onChange={(e) => set("slot_at", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Service Notes</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 68 }}
              value={form.service_notes}
              onChange={(e) => set("service_notes", e.target.value)}
              placeholder="Oil change, AC service…"
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

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 20,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "7px 14px",
              borderRadius: 4,
              fontSize: 13,
              background: "none",
              border: `1px solid ${C.border}`,
              color: C.textSec,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            style={{
              padding: "7px 16px",
              borderRadius: 4,
              fontSize: 13,
              background: saving ? C.textMuted : C.accent,
              border: "none",
              color: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {saving ? "Saving…" : "Create Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Booking Drawer ────────────────────────────────────────────────────────────

interface DrawerProps {
  booking: Booking;
  onClose: () => void;
  onUpdated: (b: Booking) => void;
}

function BookingDrawer({ booking, onClose, onUpdated }: DrawerProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setConfirming(true);
    setError(null);
    try {
      await bookingsApi.confirm(booking.id);
      // patch status locally
      onUpdated({ ...booking, status: "confirmed" });
    } catch (e: any) {
      setError(e?.error ?? "Failed to confirm");
    } finally {
      setConfirming(false);
    }
  }

  const fieldRow = (label: string, value: React.ReactNode) => (
    <div style={{ marginBottom: 14 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          display: "block",
          marginBottom: 3,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 13, color: C.text }}>{value}</span>
    </div>
  );

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.25)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 360,
          zIndex: 41,
          background: C.surface,
          borderLeft: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>
            Booking Detail
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.textSec,
              fontSize: 20,
            }}
          >
            ×
          </button>
        </div>

        {/* ID + status */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.borderFaint}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Mono v={booking.id} />
          <StatusBadge status={booking.status} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {fieldRow("Customer", booking.customers?.name ?? "—")}
          {fieldRow("Phone", <Mono v={booking.customers?.phone ?? "—"} />)}
          {fieldRow(
            "Vehicle",
            booking.vehicles ? (
              `${booking.vehicles.make ?? ""} ${booking.vehicles.model ?? ""} · ${booking.vehicles.registration ?? ""}`.trim()
            ) : (
              <span style={{ color: C.textMuted }}>—</span>
            ),
          )}
          {fieldRow("Slot", formatSlot(booking.slot_at))}
          {fieldRow("Source", <SourceChip source={booking.source} />)}
          {fieldRow(
            "Service",
            booking.service_notes ?? (
              <span style={{ color: C.textMuted }}>—</span>
            ),
          )}
          {fieldRow(
            "Confirmation sent",
            <span
              style={{
                color: booking.confirmation_sent ? C.success : C.textMuted,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {booking.confirmation_sent ? "✓ Sent" : "Not sent"}
            </span>,
          )}

          {error && (
            <div
              style={{
                padding: "8px 10px",
                background: "#fef2f2",
                border: `1px solid #fecaca`,
                borderRadius: 4,
                fontSize: 12,
                color: C.danger,
                marginTop: 8,
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          {booking.status === "pending" && (
            <button
              onClick={confirm}
              disabled={confirming}
              style={{
                padding: "7px 16px",
                borderRadius: 4,
                fontSize: 13,
                background: confirming ? C.textMuted : C.success,
                border: "none",
                color: "#fff",
                cursor: confirming ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {confirming ? "Confirming…" : "✓ Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Filter Tabs ───────────────────────────────────────────────────────────────

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Arrived", value: "arrived" },
  { label: "Cancelled", value: "cancelled" },
];

// ── Main Component ────────────────────────────────────────────────────────────

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [date, setDate] = useState(todayISO());
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);

  const LIMIT = 20;

  useEffect(() => {
    setPage(1);
  }, [statusFilter, date]);
  useEffect(() => {
    load();
  }, [statusFilter, date, page]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingsApi.list({
        status: statusFilter || undefined,
        date: date || undefined,
        page,
        limit: LIMIT,
      });
      setBookings(res.data);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.error ?? "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / LIMIT);

  const cols = [
    {
      key: "id",
      label: "Booking ID",
      render: (r: Booking) => <Mono v={r.id.slice(0, 8) + "…"} />,
    },
    {
      key: "customer",
      label: "Customer",
      render: (r: Booking) => (
        <span style={{ fontWeight: 500, color: C.text }}>
          {r.customers?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (r: Booking) => <Mono v={r.customers?.phone ?? "—"} />,
    },
    {
      key: "service",
      label: "Service",
      render: (r: Booking) => <Muted v={r.service_notes ?? "—"} />,
    },
    {
      key: "slot",
      label: "Slot",
      render: (r: Booking) => <Muted v={formatSlot(r.slot_at)} />,
    },
    {
      key: "source",
      label: "Source",
      render: (r: Booking) => <SourceChip source={r.source} />,
    },
    {
      key: "status",
      label: "Status",
      render: (r: Booking) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 2,
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: 3,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              style={{
                padding: "5px 12px",
                borderRadius: 3,
                fontSize: 12,
                fontWeight: 500,
                background:
                  statusFilter === f.value ? C.surface : "transparent",
                border:
                  statusFilter === f.value
                    ? `1px solid ${C.border}`
                    : "1px solid transparent",
                color: statusFilter === f.value ? C.text : C.textSec,
                cursor: "pointer",
                boxShadow:
                  statusFilter === f.value
                    ? "0 1px 3px rgba(0,0,0,0.06)"
                    : "none",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Date picker */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              fontSize: 13,
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.text,
              outline: "none",
              cursor: "pointer",
            }}
          />
          {/* Count */}
          {!loading && (
            <span style={{ fontSize: 12, color: C.textSec }}>
              {total} booking{total !== 1 ? "s" : ""}
            </span>
          )}
          {/* Add */}
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 4,
              background: C.accent,
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <i className="ti ti-plus" style={{ fontSize: 14 }} />
            New Booking
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: "9px 12px",
            background: "#fef2f2",
            border: `1px solid #fecaca`,
            borderRadius: 4,
            fontSize: 13,
            color: C.danger,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{error}</span>
          <button
            onClick={load}
            style={{
              background: "none",
              border: "none",
              color: C.danger,
              fontSize: 12,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "12px 16px",
                  borderBottom: `1px solid ${C.borderFaint}`,
                }}
              >
                {[90, 140, 120, 140, 130, 70, 80].map((w, j) => (
                  <div
                    key={j}
                    style={{
                      height: 12,
                      borderRadius: 3,
                      background: C.borderFaint,
                      width: w,
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div
            style={{
              padding: "48px 0",
              textAlign: "center",
              color: C.textMuted,
              fontSize: 13,
            }}
          >
            <i
              className="ti ti-calendar-off"
              style={{ fontSize: 28, display: "block", marginBottom: 8 }}
            />
            No bookings{" "}
            {date
              ? `for ${new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
              : "found"}
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1.5fr 1.3fr 1.8fr 1.4fr 0.9fr 1fr",
                padding: "9px 16px",
                background: C.bg,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {cols.map((col) => (
                <span
                  key={col.key}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.textSec,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {col.label}
                </span>
              ))}
            </div>

            {/* Rows */}
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelected(booking)}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1.1fr 1.5fr 1.3fr 1.8fr 1.4fr 0.9fr 1fr",
                  padding: "11px 16px",
                  borderBottom: `1px solid ${C.borderFaint}`,
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {cols.map((col) => (
                  <div
                    key={col.key}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {col.render(booking)}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
          <span style={{ fontSize: 12, color: C.textSec }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "5px 10px",
              borderRadius: 4,
              fontSize: 12,
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: page === 1 ? C.textMuted : C.text,
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "5px 10px",
              borderRadius: 4,
              fontSize: 12,
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: page === totalPages ? C.textMuted : C.text,
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddBookingModal
          onClose={() => setShowAdd(false)}
          onCreated={(b) => {
            setBookings((prev) => [b, ...prev]);
            setTotal((t) => t + 1);
            setShowAdd(false);
          }}
        />
      )}

      {selected && (
        <BookingDrawer
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setBookings((prev) =>
              prev.map((b) => (b.id === updated.id ? updated : b)),
            );
            setSelected(updated);
          }}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
