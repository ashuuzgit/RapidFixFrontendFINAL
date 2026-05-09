"use client";
import { useState, useEffect, useCallback } from "react";
import { C, LEAD_STATUS_CFG } from "@/lib/constants";
import { leadsApi } from "@/lib/api";
import type { Lead, LeadStatus } from "@/lib/types";

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

// ── Card (mobile) ─────────────────────────────────────────────────────────────

function LeadCard({ lead, onChanged }: { lead: Lead; onChanged: () => void }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: `1px solid ${C.borderFaint}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Row 1: phone + status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <CopyPhone phone={lead.phone} />
        <StatusBadge
          leadId={lead.id}
          current={lead.status}
          onChanged={onChanged}
        />
      </div>

      {/* Row 2: name */}
      {lead.customer_name && (
        <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
          {lead.customer_name}
        </div>
      )}

      {/* Row 3: source + assigned + time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <SourceBadge source={lead.source ?? undefined} />
        <span style={{ fontSize: 11, color: C.textMuted }}>
          {lead.staff ? `→ ${lead.staff.name}` : "Unassigned"}
        </span>
        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>
          {formatIST(lead.created_at)}
        </span>
      </div>
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

  const desktopCols = [
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
        {/* Filter tabs — horizontally scrollable on mobile */}
        <div className="leads-filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "5px 11px",
                fontSize: 12,
                borderRadius: 3,
                border: "none",
                whiteSpace: "nowrap",
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
        {/* Desktop header */}
        <div
          className="leads-desktop-header"
          style={{
            display: "grid",
            gridTemplateColumns: desktopCols.map((c) => c.width).join(" "),
            padding: "9px 16px",
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {desktopCols.map((col) => (
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="leads-skeleton-row"
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${C.borderFaint}`,
                }}
              >
                {/* Desktop skeleton */}
                <div
                  className="leads-skeleton-desktop"
                  style={{ display: "flex", gap: 16 }}
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
                {/* Mobile skeleton */}
                <div
                  className="leads-skeleton-mobile"
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {[200, 120, 160].map((w, j) => (
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
            <div key={lead.id}>
              {/* Desktop row */}
              <div
                className="leads-desktop-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: desktopCols
                    .map((c) => c.width)
                    .join(" "),
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
                <div>
                  <CopyPhone phone={lead.phone} />
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: lead.customer_name ? C.text : C.textMuted,
                  }}
                >
                  {lead.customer_name ?? (
                    <span style={{ fontSize: 12 }}>—</span>
                  )}
                </div>
                <div>
                  <SourceBadge source={lead.source ?? undefined} />
                </div>
                <div>
                  <StatusBadge
                    leadId={lead.id}
                    current={lead.status}
                    onChanged={fetchLeads}
                  />
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: lead.staff ? C.text : C.textMuted,
                  }}
                >
                  {lead.staff?.name ?? "Unassigned"}
                </div>
                <div style={{ fontSize: 12, color: C.textSec }}>
                  {formatIST(lead.created_at)}
                </div>
              </div>

              {/* Mobile card */}
              <div className="leads-mobile-card">
                <LeadCard lead={lead} onChanged={fetchLeads} />
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
              padding: "7px 16px",
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
              padding: "7px 16px",
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

        /* Filter bar scrollable on mobile */
        .leads-filter-bar {
          display: flex;
          background: #f0f2f5;
          padding: 2px;
          border-radius: 4px;
          gap: 1px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          max-width: 100%;
        }
        .leads-filter-bar::-webkit-scrollbar { display: none; }

        /* Desktop: show table, hide cards */
        .leads-desktop-header { display: grid; }
        .leads-desktop-row    { display: grid; }
        .leads-mobile-card    { display: none; }
        .leads-skeleton-desktop { display: flex; }
        .leads-skeleton-mobile  { display: none; }

        /* Mobile: hide table, show cards */
        @media (max-width: 640px) {
          .leads-desktop-header { display: none !important; }
          .leads-desktop-row    { display: none !important; }
          .leads-mobile-card    { display: block; }
          .leads-skeleton-desktop { display: none; }
          .leads-skeleton-mobile  { display: flex; }
        }
      `}</style>
    </div>
  );
}
