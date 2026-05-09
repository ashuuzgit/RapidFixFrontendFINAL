"use client";
import { useState, useEffect, useCallback } from "react";
import { C, LEAD_STATUS_CFG } from "@/lib/constants";
import { leadsApi } from "@/lib/api";
import type { Lead, LeadStatus } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const FILTERS: { label: string; value: LeadStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Follow up", value: "follow_up" },
  { label: "Converted", value: "converted" },
  { label: "Spam", value: "spam" },
];

const SOURCE_CFG: Record<string, { label: string; bg: string; text: string }> =
  {
    website_popup: { label: "Website", bg: "#eff6ff", text: "#1d4ed8" },
    whatsapp: { label: "WhatsApp", bg: "#f0fdf4", text: "#166534" },
    phone: { label: "Phone", bg: "#faf5ff", text: "#6d28d9" },
    manual: { label: "Manual", bg: "#f9fafb", text: "#374151" },
  };

function formatIST(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function SourceBadge({ source }: { source?: string }) {
  const cfg = SOURCE_CFG[source ?? ""] ?? {
    label: source ?? "—",
    bg: "#f9fafb",
    text: "#374151",
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.text,
      }}
    >
      {cfg.label}
    </span>
  );
}

function StatusBadge({
  leadId,
  current,
  onChanged,
}: {
  leadId: string;
  current: LeadStatus;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const cfg = LEAD_STATUS_CFG[current];

  async function select(status: LeadStatus) {
    if (status === current) {
      setOpen(false);
      return;
    }
    setSaving(true);
    try {
      await leadsApi.update(leadId, { status });
      onChanged();
    } finally {
      setSaving(false);
      setOpen(false);
    }
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={saving}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 8px",
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 600,
          background: cfg.bg,
          color: cfg.text,
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: cfg.dot,
            display: "inline-block",
          }}
        />
        {cfg.label}
        <span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              zIndex: 20,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              minWidth: 130,
              overflow: "hidden",
            }}
          >
            {(
              Object.entries(LEAD_STATUS_CFG) as [LeadStatus, typeof cfg][]
            ).map(([key, s]) => (
              <button
                key={key}
                onClick={() => select(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: 12,
                  background: key === current ? C.bg : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: C.text,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: s.dot,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CopyPhone({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12 }}>
        {phone}
      </span>
      <button
        onClick={copy}
        title="Copy phone number"
        style={{
          padding: "2px 6px",
          fontSize: 11,
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          background: copied ? "#f0fdf4" : C.surface,
          color: copied ? "#166534" : C.textSec,
          cursor: "pointer",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const LIMIT = 25;

export function Leads() {
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadsApi.list({
        status: filter === "all" ? undefined : filter,
        page,
        limit: LIMIT,
      });
      setLeads(res.data);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.error ?? "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const totalPages = Math.ceil(total / LIMIT);

  const cols = [
    { label: "Phone", width: "22%" },
    { label: "Name", width: "18%" },
    { label: "Source", width: "12%" },
    { label: "Status", width: "14%" },
    { label: "Assigned", width: "14%" },
    { label: "Received", width: "20%" },
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
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            background: "#f0f2f5",
            padding: 2,
            borderRadius: 4,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "5px 11px",
                fontSize: 12,
                borderRadius: 3,
                border: "none",
                background: filter === f.value ? C.surface : "transparent",
                color: filter === f.value ? C.text : C.textSec,
                fontWeight: filter === f.value ? 500 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow:
                  filter === f.value ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!loading && (
          <span style={{ fontSize: 12, color: C.textSec }}>
            {total} lead{total !== 1 ? "s" : ""}
          </span>
        )}
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
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          <button
            onClick={fetchLeads}
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
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols.map((c) => c.width).join(" "),
            padding: "9px 16px",
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {cols.map((col) => (
            <span
              key={col.label}
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

        {/* Body */}
        {loading ? (
          <div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "12px 16px",
                  borderBottom: `1px solid ${C.borderFaint}`,
                }}
              >
                {[160, 120, 80, 90, 100, 140].map((w, j) => (
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
        ) : leads.length === 0 ? (
          <div
            style={{
              padding: "48px 0",
              textAlign: "center",
              color: C.textMuted,
              fontSize: 13,
            }}
          >
            <i
              className="ti ti-message-circle-off"
              style={{ fontSize: 28, display: "block", marginBottom: 8 }}
            />
            No leads {filter !== "all" ? `with status "${filter}"` : "yet"}
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              style={{
                display: "grid",
                gridTemplateColumns: cols.map((c) => c.width).join(" "),
                padding: "11px 16px",
                borderBottom: `1px solid ${C.borderFaint}`,
                alignItems: "center",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.bg)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Phone + copy */}
              <div>
                <CopyPhone phone={lead.phone} />
              </div>

              {/* Name */}
              <div
                style={{
                  fontSize: 13,
                  color: lead.customer_name ? C.text : C.textMuted,
                }}
              >
                {lead.customer_name ?? <span style={{ fontSize: 12 }}>—</span>}
              </div>

              {/* Source */}
              <div>
                <SourceBadge source={lead.source ?? undefined} />
              </div>

              {/* Status */}
              <div>
                <StatusBadge
                  leadId={lead.id}
                  current={lead.status}
                  onChanged={fetchLeads}
                />
              </div>

              {/* Assigned */}
              <div
                style={{
                  fontSize: 12,
                  color: lead.staff ? C.text : C.textMuted,
                }}
              >
                {lead.staff?.name ?? <span>Unassigned</span>}
              </div>

              {/* Timestamp IST */}
              <div style={{ fontSize: 12, color: C.textSec }}>
                {formatIST(lead.created_at)}
              </div>
            </div>
          ))
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
