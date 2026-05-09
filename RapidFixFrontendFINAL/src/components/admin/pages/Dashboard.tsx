"use client";
import { useState, useEffect } from "react";
import { C, JOB_STATUS_CFG } from "@/lib/constants";
import { dashboardApi, jobsApi, bookingsApi } from "@/lib/api";
import { Badge } from "../atoms/Badge";
import { SectionHeader } from "../atoms/Sectionheader";
import { DataTable } from "../atoms/DataTable";
import type { Page, Job, Booking, Column, DashboardData } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Renders a value in monospace — used for IDs, phone numbers, reg plates
const Mono = ({ v }: { v: string }) => (
  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12 }}>
    {v}
  </span>
);

// Renders secondary/muted text — used for model names, timestamps, etc.
const Muted = ({ v }: { v: string }) => (
  <span style={{ color: C.textSec, fontSize: 12 }}>{v}</span>
);

// Formats a number as Indian rupees e.g. 124500 → ₹1,24,500
function formatRupees(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

// Converts an ISO timestamp to a human-readable relative time string
// e.g. "10 min ago", "2 hrs ago", "3d ago"
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Returns today's date as YYYY-MM-DD — used to filter today's bookings
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// ── Skeleton block ────────────────────────────────────────────────────────────

// Generic animated placeholder shown while data is loading.
// w = width (px or CSS string), h = height in px (default 12)
function Skeleton({ w, h = 12 }: { w: number | string; h?: number }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 3,
        background: C.borderFaint,
        // "pulse" keyframe is defined in the <style> block at the bottom of Dashboard
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string; // Card title e.g. "Open Jobs"
  value: string; // Large primary number/value
  sub: string; // Small subtitle line below value
  icon: string; // Tabler icon class e.g. "ti-tool"
  accent: string; // Top border + icon color
  loading: boolean; // Shows skeleton when true
  onClick?: () => void;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  loading,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        padding: "16px 18px",
        borderTop: `3px solid ${accent}`,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        if (onClick)
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: C.textSec,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
        <i className={`ti ${icon}`} style={{ fontSize: 16, color: accent }} />
      </div>

      {loading ? (
        <>
          <Skeleton w={80} h={20} />
          <div style={{ marginTop: 6 }}>
            <Skeleton w={110} />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: C.text,
              marginBottom: 4,
            }}
          >
            {value}
          </div>
          <div style={{ fontSize: 11, color: C.textSec }}>{sub}</div>
        </>
      )}
    </div>
  );
}

// ── Table Column Definitions ──────────────────────────────────────────────────

// Columns for the Recent Jobs table.
// Each `render` fn receives a Job row and returns JSX for that cell.
const jobCols: Column<Job>[] = [
  // Truncate UUID to first 8 chars to keep the column narrow
  {
    key: "id",
    label: "Job ID",
    render: (r) => <Mono v={r.id.slice(0, 8) + "…"} />,
  },
  {
    key: "customers",
    label: "Customer",
    render: (r) => <>{r.customers?.name ?? "—"}</>,
  },
  {
    key: "vehicle_reg",
    label: "Reg No.",
    render: (r) => <Mono v={r.vehicles?.registration ?? "—"} />,
  },
  // Combine make + model into one muted string, trim extra whitespace
  {
    key: "vehicle_model",
    label: "Model",
    render: (r) => (
      <Muted
        v={`${r.vehicles?.make ?? ""} ${r.vehicles?.model ?? ""}`.trim()}
      />
    ),
  },
  // Badge uses JOB_STATUS_CFG to pick the right color per status
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge status={r.status} />,
  },
  {
    key: "mechanic",
    label: "Mechanic",
    render: (r) => (
      <>
        {r.mechanic?.name ?? (
          <span style={{ color: C.textMuted }}>Unassigned</span>
        )}
      </>
    ),
  },
  // Convert ISO updated_at to relative time string
  {
    key: "updated_at",
    label: "Updated",
    render: (r) => <Muted v={timeAgo(r.updated_at)} />,
  },
];

// Columns for the Today's Bookings table
const bookingCols: Column<Booking>[] = [
  {
    key: "id",
    label: "Booking",
    render: (r) => <Mono v={r.id.slice(0, 8) + "…"} />,
  },
  {
    key: "customer_name",
    label: "Customer",
    render: (r) => <>{r.customers?.name ?? "—"}</>,
  },
  {
    key: "customer_phone",
    label: "Phone",
    render: (r) => <Mono v={r.customers?.phone ?? "—"} />,
  },
  {
    key: "service_notes",
    label: "Service",
    render: (r) => <>{r.service_notes ?? "—"}</>,
  },
  // Show only the time portion of slot_at (date is always today on this table)
  {
    key: "slot_at",
    label: "Slot",
    render: (r) => (
      <Muted
        v={
          r.slot_at
            ? new Date(r.slot_at).toLocaleString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "—"
        }
      />
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge status={r.status} />,
  },
];

// ── Main Component ────────────────────────────────────────────────────────────

interface DashboardProps {
  // setPage lets this component navigate to other pages (jobs, bookings)
  setPage: (p: Page) => void;
}

export function Dashboard({ setPage }: DashboardProps) {
  // dash holds the /dashboard snapshot: job counts, revenue, leads
  const [dash, setDash] = useState<DashboardData | null>(null);
  // jobs = 5 most recent jobs for the table preview
  const [jobs, setJobs] = useState<Job[]>([]);
  // bookings = today's bookings for the table preview
  const [bookings, setBookings] = useState<Booking[]>([]);
  // Single loading flag covers all 3 parallel requests
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load on mount only — dashboard doesn't re-fetch on filter changes
  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Fire all 3 requests in parallel — faster than sequential awaits
      const [dashData, jobsData, bookingsData] = await Promise.all([
        dashboardApi.get(), // GET /dashboard
        jobsApi.list({ limit: 5 }), // GET /jobs?limit=5
        bookingsApi.list({ date: todayISO(), limit: 5 }), // GET /bookings?date=YYYY-MM-DD&limit=5
      ]);
      setDash(dashData);
      setJobs(jobsData.data);
      setBookings(bookingsData.data);
    } catch (e: any) {
      // e.error comes from the api() core fetch which throws { error, status }
      setError(e?.error ?? "Failed to load dashboard");
    } finally {
      // Always turn off loading whether success or failure
      setLoading(false);
    }
  }

  // ── Derived stat values ───────────────────────────────────────────────────

  // Open jobs = everything that hasn't been delivered yet
  const openJobs = dash
    ? dash.jobs.received +
      dash.jobs.diagnosed +
      dash.jobs.in_progress +
      dash.jobs.ready
    : 0;

  // Build the stat cards array from live API data.
  // Computed on every render — no extra state needed.
  const STATS = [
    {
      label: "Open Jobs",
      value: String(openJobs),
      sub: `${dash?.jobs.received ?? 0} received · ${dash?.jobs.in_progress ?? 0} in progress`,
      icon: "ti-tool",
      accent: "#f48024",
      onClick: () => setPage("jobs"),
    },
    {
      label: "Today's Bookings",
      value: String(bookings.length),
      sub: `${bookings.filter((b) => b.status === "pending").length} pending confirmation`,
      icon: "ti-calendar",
      accent: C.info,
      onClick: () => setPage("bookings"),
    },
    {
      label: "Revenue (MTD)",
      value: formatRupees(dash?.revenue.month ?? 0),
      sub: `Today ${formatRupees(dash?.revenue.today ?? 0)} · Week ${formatRupees(dash?.revenue.week ?? 0)}`,
      icon: "ti-coin",
      accent: C.success,
      onClick: () => setPage("bills"),
    },
    {
      label: "New Leads Today",
      value: String(dash?.new_leads_today ?? 0),
      sub: "from WhatsApp",
      icon: "ti-message-circle-2",
      accent: C.warning,
      onClick: () => setPage("leads"),
    },
  ];

  return (
    <div>
      {/* Error banner — only shown when load() throws. Retry re-calls load(). */}
      {error && (
        <div
          style={{
            marginBottom: 16,
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

      {/* Stat cards — auto-fit grid so they wrap on narrow viewports */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {STATS.map((s) => (
          // Pass loading down so each card renders its own skeleton
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/*
        Job status pipeline bar — hidden while loading to avoid a flash of zeros.
        Shows the 4 active statuses with their dot color and live count.
        "delivered" is excluded — those jobs are done and don't need attention.
      */}
      {!loading && dash && (
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {(["received", "diagnosed", "in_progress", "ready"] as const).map(
            (s) => {
              const cfg = JOB_STATUS_CFG[s]; // color + label from constants
              return (
                <div
                  key={s}
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  {/* Colored dot matches the status badge color */}
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: cfg.dot,
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 12, color: C.textSec }}>
                    {cfg.label}
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: C.text }}
                  >
                    {dash.jobs[s]}
                  </span>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* Recent Jobs table — shows 5 most recent regardless of status */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
          marginBottom: 16,
        }}
      >
        <SectionHeader
          title="Recent Jobs"
          action="View all jobs →"
          onAction={() => setPage("jobs")} // navigates to the full Jobs page
        />
        {loading ? (
          // Skeleton rows while fetching — toolbar renders immediately above
          <div
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                {/* Widths roughly match the actual column widths */}
                {[80, 130, 100, 120, 70, 90, 70].map((w, j) => (
                  <Skeleton key={j} w={w} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <DataTable columns={jobCols} rows={jobs} />
        )}
      </div>

      {/* Today's Bookings table — filtered to today's date by the API */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
        }}
      >
        <SectionHeader
          title="Today's Bookings"
          action="View all →"
          onAction={() => setPage("bookings")}
        />
        {loading ? (
          <div
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                {[80, 130, 110, 150, 80, 70].map((w, j) => (
                  <Skeleton key={j} w={w} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <DataTable columns={bookingCols} rows={bookings} />
        )}
      </div>

      {/* Pulse animation used by all Skeleton blocks in this component */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
