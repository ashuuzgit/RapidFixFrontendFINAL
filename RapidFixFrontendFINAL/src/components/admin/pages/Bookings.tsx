"use client";
import { useState, useEffect } from "react";
import { C, BOOKING_STATUS_CFG, BOOKING_SOURCE_CFG } from "@/lib/constants";
import { bookingsApi, jobsApi } from "@/lib/api";
import type { Booking, BookingStatus, Column } from "@/lib/types";

// ── Responsive hook ───────────────────────────────────────────────────────────

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

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
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
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
        whiteSpace: "nowrap",
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
  isMobile: boolean;
}

function AddBookingModal({
  onClose,
  onCreated,
  isMobile,
}: AddBookingModalProps) {
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

  // Mobile: slide-up sheet; Desktop: centred modal
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 51,
        background: C.surface,
        borderRadius: "12px 12px 0 0",
        border: `1px solid ${C.border}`,
        borderBottom: "none",
        padding: "20px 16px 32px",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
        maxHeight: "90dvh",
        overflowY: "auto",
      }
    : {
        background: C.surface,
        borderRadius: 6,
        border: `1px solid ${C.border}`,
        width: 440,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={panelStyle}>
        {/* Drag handle on mobile */}
        {isMobile && (
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 99,
              background: C.border,
              margin: "0 auto 16px",
            }}
          />
        )}

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
              flex: isMobile ? 1 : undefined,
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
  isMobile: boolean;
}

function BookingDrawer({ booking, onClose, onUpdated, isMobile }: DrawerProps) {
  const [confirming, setConfirming] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setConfirming(true);
    setError(null);
    try {
      await bookingsApi.confirm(booking.id);
      onUpdated({ ...booking, status: "converted" });
    } catch (e: any) {
      setError(e?.error ?? "Failed to confirm");
    } finally {
      setConfirming(false);
    }
  }

  async function convertToJob() {
    setConverting(true);
    setError(null);
    try {
      await jobsApi.create({
        booking_id: booking.id,
        customer_id: booking.customers!.id,
        vehicle_id: booking.vehicles?.id ?? undefined,
        service_description: booking.service_notes ?? undefined,
        estimated_completion: booking.slot_at ?? undefined,
      });
      onUpdated({ ...booking, status: "arrived" });
      onClose();
    } catch (e: any) {
      setError(e?.error ?? "Failed to convert to job");
    } finally {
      setConverting(false);
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

  const vehicleLabel = booking.vehicles
    ? `${booking.vehicles.make ?? ""} ${booking.vehicles.model ?? ""}${booking.vehicles.registration ? " · " + booking.vehicles.registration : ""}`.trim()
    : null;

  // Mobile: bottom sheet; Desktop: right-side drawer
  const drawerStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 41,
        background: C.surface,
        borderRadius: "12px 12px 0 0",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        maxHeight: "85dvh",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.1)",
      }
    : {
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
      };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.25)",
        }}
        onClick={onClose}
      />

      {/* Drawer / Sheet */}
      <div style={drawerStyle}>
        {/* Drag handle (mobile only) */}
        {isMobile && (
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 99,
              background: C.border,
              margin: "12px auto 0",
              flexShrink: 0,
            }}
          />
        )}

        {/* Header */}
        <div
          style={{
            padding: isMobile ? "12px 16px" : "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
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
            padding: isMobile ? "12px 16px" : "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Mono v={booking.id} />
          <StatusBadge status={booking.status} />
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile ? "16px 16px" : 20,
          }}
        >
          {fieldRow("Customer", booking.customers?.name ?? "—")}
          {fieldRow("Phone", <Mono v={booking.customers?.phone ?? "—"} />)}
          {fieldRow(
            "Vehicle",
            vehicleLabel ?? <span style={{ color: C.textMuted }}>—</span>,
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
            padding: isMobile ? "12px 16px 24px" : "14px 20px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          {booking.status === "pending" && (
            <button
              onClick={confirm}
              disabled={confirming}
              style={{
                flex: isMobile ? 1 : undefined,
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

          {booking.status === "confirmed" && (
            <button
              onClick={convertToJob}
              disabled={converting}
              style={{
                flex: isMobile ? 1 : undefined,
                padding: "7px 16px",
                borderRadius: 4,
                fontSize: 13,
                background: converting ? C.textMuted : C.accent,
                border: "none",
                color: "#fff",
                cursor: converting ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {converting ? "Creating Job…" : "→ Convert to Job"}
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
  { label: "Converted", value: "converted" },
  { label: "Arrived", value: "arrived" },
  { label: "Cancelled", value: "cancelled" },
];

// ── Booking Card (mobile) ─────────────────────────────────────────────────────

function BookingCard({
  booking,
  onClick,
}: {
  booking: Booking;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 14px",
        borderBottom: `1px solid ${C.borderFaint}`,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "transparent",
        transition: "background 0.1s",
      }}
      onTouchStart={(e) => (e.currentTarget.style.background = C.bg)}
      onTouchEnd={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Row 1: name + status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>
          {booking.customers?.name ?? "—"}
        </span>
        <StatusBadge status={booking.status} />
      </div>

      {/* Row 2: phone + slot */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Mono v={booking.customers?.phone ?? "—"} />
        <Muted v={formatSlot(booking.slot_at)} />
      </div>

      {/* Row 3: service + source */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: C.textSec,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {booking.service_notes ?? (
            <span style={{ color: C.textMuted }}>No notes</span>
          )}
        </span>
        <SourceChip source={booking.source} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function Bookings() {
  const width = useWindowWidth();
  const isMobile = width < 640;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [date, setDate] = useState("");
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
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: isMobile ? 10 : 12,
        }}
      >
        {/* Filter tabs — horizontally scrollable on mobile */}
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: 2,
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              padding: 3,
              minWidth: "max-content",
            }}
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                style={{
                  padding: isMobile ? "5px 10px" : "5px 12px",
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
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date + count + button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: isMobile ? "space-between" : "flex-end",
          }}
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              flex: isMobile ? 1 : undefined,
              padding: "6px 10px",
              borderRadius: 4,
              fontSize: 13,
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.text,
              outline: "none",
              cursor: "pointer",
              minWidth: 0,
            }}
          />
          {!loading && (
            <span
              style={{
                fontSize: 12,
                color: C.textSec,
                whiteSpace: "nowrap",
              }}
            >
              {total} booking{total !== 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: isMobile ? "7px 12px" : "7px 14px",
              borderRadius: 4,
              background: C.accent,
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <i className="ti ti-plus" style={{ fontSize: 14 }} />
            {isMobile ? "New" : "New Booking"}
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

      {/* Table / Card list */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {loading ? (
          // Skeleton
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
                {(isMobile
                  ? [140, 80, 100]
                  : [90, 140, 120, 140, 130, 70, 80]
                ).map((w, j) => (
                  <div
                    key={j}
                    style={{
                      height: 12,
                      borderRadius: 3,
                      background: C.borderFaint,
                      width: w,
                      animation: "pulse 1.5s ease-in-out infinite",
                      flexShrink: 0,
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
        ) : isMobile ? (
          // ── Mobile: card list ──
          <div>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => setSelected(booking)}
              />
            ))}
          </div>
        ) : (
          // ── Desktop: table ──
          <>
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
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
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
          <span style={{ fontSize: 12, color: C.textSec }}>
            {page} / {totalPages}
          </span>
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
          isMobile={isMobile}
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
          isMobile={isMobile}
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
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
