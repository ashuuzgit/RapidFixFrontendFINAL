"use client";
import { useState } from "react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

type Role = "owner" | "mechanic";
type Page =
  | "dashboard"
  | "jobs"
  | "bookings"
  | "bills"
  | "customers"
  | "leads"
  | "inbox"
  | "settings";
type JobStatus =
  | "in_progress"
  | "awaiting_parts"
  | "completed"
  | "pending"
  | "cancelled";
type BookingStatus = "confirmed" | "pending" | "cancelled";

interface Job {
  id: string;
  customer: string;
  vehicle: string;
  model: string;
  status: JobStatus;
  mechanic: string;
  amount: string;
  updated: string;
}
interface Booking {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  service: string;
  slot: string;
  status: BookingStatus;
}
interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: string;
  accent: string;
}
interface NavItem {
  id: Page;
  label: string;
  icon: string;
}
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

// ── TOKENS ────────────────────────────────────────────────────────────────────

const C = {
  sb: "#1b2332",
  sbBorder: "#26344a",
  sbText: "#7d97b8",
  sbActive: "#243044",
  accent: "#f48024",
  bg: "#f3f5f7",
  surface: "#ffffff",
  border: "#e1e5eb",
  borderFaint: "#f0f2f5",
  text: "#1a202c",
  textSec: "#6b7280",
} as const;

const STATUS_CFG: Record<
  JobStatus | BookingStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  in_progress: {
    bg: "#eff6ff",
    text: "#1d4ed8",
    dot: "#3b82f6",
    label: "In Progress",
  },
  awaiting_parts: {
    bg: "#fffbeb",
    text: "#92400e",
    dot: "#f59e0b",
    label: "Awaiting Parts",
  },
  completed: {
    bg: "#ecfdf5",
    text: "#065f46",
    dot: "#10b981",
    label: "Completed",
  },
  pending: { bg: "#f9fafb", text: "#374151", dot: "#9ca3af", label: "Pending" },
  confirmed: {
    bg: "#ecfdf5",
    text: "#065f46",
    dot: "#10b981",
    label: "Confirmed",
  },
  cancelled: {
    bg: "#fef2f2",
    text: "#991b1b",
    dot: "#ef4444",
    label: "Cancelled",
  },
};

// ── SEED DATA ─────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  {
    label: "Open Jobs",
    value: "14",
    sub: "3 added today",
    icon: "ti-tool",
    accent: "#f48024",
  },
  {
    label: "Today's Bookings",
    value: "7",
    sub: "2 pending confirmation",
    icon: "ti-calendar",
    accent: "#3b82f6",
  },
  {
    label: "Revenue (MTD)",
    value: "₹1,24,500",
    sub: "+8% vs last month",
    icon: "ti-coin",
    accent: "#10b981",
  },
  {
    label: "Pending Bills",
    value: "5",
    sub: "₹34,200 outstanding",
    icon: "ti-receipt",
    accent: "#f59e0b",
  },
];

const JOBS: Job[] = [
  {
    id: "JOB-1042",
    customer: "Rahul Sharma",
    vehicle: "MH12 AB 1234",
    model: "Maruti Alto",
    status: "in_progress",
    mechanic: "Ramesh K.",
    amount: "₹3,200",
    updated: "10 min ago",
  },
  {
    id: "JOB-1041",
    customer: "Priya Desai",
    vehicle: "DL09 CD 5678",
    model: "Honda City",
    status: "awaiting_parts",
    mechanic: "Suresh P.",
    amount: "₹8,500",
    updated: "2 hrs ago",
  },
  {
    id: "JOB-1040",
    customer: "Amit Verma",
    vehicle: "KA03 EF 9012",
    model: "Hyundai i20",
    status: "completed",
    mechanic: "Ramesh K.",
    amount: "₹12,000",
    updated: "Yesterday",
  },
  {
    id: "JOB-1039",
    customer: "Neha Gupta",
    vehicle: "MH04 GH 3456",
    model: "Toyota Innova",
    status: "pending",
    mechanic: "Unassigned",
    amount: "₹4,500",
    updated: "Yesterday",
  },
  {
    id: "JOB-1038",
    customer: "Sanjay Mehta",
    vehicle: "GJ01 IJ 7890",
    model: "Swift Dzire",
    status: "completed",
    mechanic: "Vikram S.",
    amount: "₹6,750",
    updated: "2 days ago",
  },
  {
    id: "JOB-1037",
    customer: "Deepa Nair",
    vehicle: "MH02 KL 2345",
    model: "WagonR",
    status: "in_progress",
    mechanic: "Suresh P.",
    amount: "₹2,100",
    updated: "3 hrs ago",
  },
  {
    id: "JOB-1036",
    customer: "Arjun Pillai",
    vehicle: "TN09 MN 6789",
    model: "Creta",
    status: "pending",
    mechanic: "Unassigned",
    amount: "₹15,000",
    updated: "3 days ago",
  },
];

const BOOKINGS: Booking[] = [
  {
    id: "BKG-234",
    customer: "Deepak Nair",
    phone: "+91 98200 12345",
    vehicle: "MH12 PQ 4321",
    service: "Oil Change + Filter",
    slot: "Today, 11:00 AM",
    status: "confirmed",
  },
  {
    id: "BKG-235",
    customer: "Anita Singh",
    phone: "+91 97300 54321",
    vehicle: "DL08 RS 8765",
    service: "AC Service",
    slot: "Today, 2:30 PM",
    status: "confirmed",
  },
  {
    id: "BKG-236",
    customer: "Kiran Rao",
    phone: "+91 99400 11111",
    vehicle: "KA05 TU 2468",
    service: "Full Service",
    slot: "Tomorrow, 10:00 AM",
    status: "pending",
  },
  {
    id: "BKG-237",
    customer: "Meera Joshi",
    phone: "+91 96100 22222",
    vehicle: "MH03 VW 1357",
    service: "Brake Service",
    slot: "Tomorrow, 12:00 PM",
    status: "pending",
  },
];

const NAV_OWNER: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
  { id: "jobs", label: "Jobs", icon: "ti-tool" },
  { id: "bookings", label: "Bookings", icon: "ti-calendar" },
  { id: "bills", label: "Bills", icon: "ti-receipt" },
  { id: "customers", label: "Customers", icon: "ti-users" },
  { id: "leads", label: "Leads", icon: "ti-message-circle-2" },
  { id: "inbox", label: "Inbox", icon: "ti-inbox" },
  { id: "settings", label: "Settings", icon: "ti-settings" },
];
const NAV_MECHANIC: NavItem[] = [
  { id: "jobs", label: "My Jobs", icon: "ti-tool" },
];

const JOB_FILTERS = [
  "All",
  "Pending",
  "In Progress",
  "Awaiting Parts",
  "Completed",
] as const;
type JobFilter = (typeof JOB_FILTERS)[number];
const FILTER_MAP: Partial<Record<JobFilter, JobStatus>> = {
  "In Progress": "in_progress",
  Pending: "pending",
  "Awaiting Parts": "awaiting_parts",
  Completed: "completed",
};

// ── ATOMS ─────────────────────────────────────────────────────────────────────

function Badge({ status }: { status: JobStatus | BookingStatus }) {
  const s = STATUS_CFG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 3,
        fontSize: 11,
        fontWeight: 500,
        background: s.bg,
        color: s.text,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
}

const Mono = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12 }}>
    {children}
  </span>
);
const Muted = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: C.textSec, fontSize: 12 }}>{children}</span>
);

// ── DATA TABLE ────────────────────────────────────────────────────────────────

function DataTable<T>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr
            style={{
              background: "#f9fafb",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {columns.map((c) => (
              <th
                key={String(c.key)}
                style={{
                  padding: "8px 14px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.textSec,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="cf-row"
              style={{ borderBottom: `1px solid ${C.borderFaint}` }}
            >
              {columns.map((c) => (
                <td
                  key={String(c.key)}
                  style={{
                    padding: "10px 14px",
                    color: C.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.render ? c.render(row[c.key], row) : String(row[c.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div
      style={{
        padding: "13px 20px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
        {title}
      </span>
      {action && (
        <button
          onClick={onAction}
          style={{
            fontSize: 12,
            color: C.accent,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────

function Sidebar({
  page,
  setPage,
  role,
}: {
  page: Page;
  setPage: (p: Page) => void;
  role: Role;
}) {
  const nav = role === "owner" ? NAV_OWNER : NAV_MECHANIC;
  return (
    <div
      style={{
        width: 216,
        background: C.sb,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${C.sbBorder}`,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      <div
        style={{
          padding: "18px 18px 14px",
          borderBottom: `1px solid ${C.sbBorder}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 5,
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="ti ti-tool"
              style={{ color: "#fff", fontSize: 15 }}
              aria-hidden="true"
            />
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: 1.2,
              }}
            >
              RepairOS
            </div>
            <div style={{ color: C.sbText, fontSize: 10 }}>
              Workshop Manager
            </div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "6px 0" }}>
        {nav.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 20px 9px 16px",
                background: active ? C.sbActive : "transparent",
                border: "none",
                borderLeft: `2px solid ${active ? C.accent : "transparent"}`,
                color: active ? "#fff" : C.sbText,
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              <i
                className={`ti ${item.icon}`}
                style={{ fontSize: 15, flexShrink: 0 }}
                aria-hidden="true"
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div
        style={{ padding: "14px 16px", borderTop: `1px solid ${C.sbBorder}` }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#fff",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {role === "owner" ? "RO" : "MK"}
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>
              {role === "owner" ? "Rajesh (Owner)" : "Ramesh K."}
            </div>
            <div style={{ color: C.sbText, fontSize: 10 }}>
              {role === "owner" ? "Full Access" : "Mechanic View"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TOPBAR ────────────────────────────────────────────────────────────────────

function Topbar({
  page,
  role,
  setRole,
}: {
  page: Page;
  role: Role;
  setRole: (r: Role) => void;
}) {
  const label = NAV_OWNER.find((n) => n.id === page)?.label ?? page;
  return (
    <div
      style={{
        height: 50,
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: C.textSec }}>RepairOS</span>
        <span style={{ color: "#d1d5db", fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            display: "flex",
            background: "#f0f2f5",
            padding: 2,
            borderRadius: 4,
            gap: 1,
          }}
        >
          {(["owner", "mechanic"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: "4px 10px",
                borderRadius: 3,
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "inherit",
                background: role === r ? C.accent : "transparent",
                color: role === r ? "#fff" : C.textSec,
                border: "none",
                cursor: "pointer",
              }}
            >
              {r === "owner" ? "Owner" : "Mechanic"}
            </button>
          ))}
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.textSec,
          }}
        >
          <i
            className="ti ti-bell"
            style={{ fontSize: 18 }}
            aria-hidden="true"
          />
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.textSec,
          }}
        >
          <i
            className="ti ti-search"
            style={{ fontSize: 18 }}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

// ── PAGES ─────────────────────────────────────────────────────────────────────

function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  const jobCols: Column<Job>[] = [
    { key: "id", label: "Job ID", render: (v) => <Mono>{String(v)}</Mono> },
    { key: "customer", label: "Customer" },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (v) => <Mono>{String(v)}</Mono>,
    },
    {
      key: "model",
      label: "Model",
      render: (v) => <span style={{ color: C.textSec }}>{String(v)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (v) => <Badge status={v as JobStatus} />,
    },
    { key: "mechanic", label: "Mechanic" },
    { key: "amount", label: "Amount", render: (v) => <Mono>{String(v)}</Mono> },
    {
      key: "updated",
      label: "Updated",
      render: (v) => <Muted>{String(v)}</Muted>,
    },
  ];
  const bkgCols: Column<Booking>[] = [
    { key: "id", label: "Booking", render: (v) => <Mono>{String(v)}</Mono> },
    { key: "customer", label: "Customer" },
    { key: "phone", label: "Phone", render: (v) => <Mono>{String(v)}</Mono> },
    { key: "service", label: "Service" },
    { key: "slot", label: "Slot" },
    {
      key: "status",
      label: "Status",
      render: (v) => <Badge status={v as BookingStatus} />,
    },
  ];
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              padding: "16px 18px",
              borderTop: `3px solid ${s.accent}`,
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
                {s.label}
              </span>
              <i
                className={`ti ${s.icon}`}
                style={{ fontSize: 16, color: s.accent }}
                aria-hidden="true"
              />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: C.text,
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: C.textSec }}>{s.sub}</div>
          </div>
        ))}
      </div>
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
          onAction={() => setPage("jobs")}
        />
        <DataTable columns={jobCols} rows={JOBS.slice(0, 5)} />
      </div>
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
        <DataTable columns={bkgCols} rows={BOOKINGS} />
      </div>
    </div>
  );
}

function Jobs({ role }: { role: Role }) {
  const [filter, setFilter] = useState<JobFilter>("All");
  const base =
    role === "mechanic" ? JOBS.filter((j) => j.mechanic === "Ramesh K.") : JOBS;
  const rows =
    filter === "All"
      ? base
      : base.filter((j) => j.status === FILTER_MAP[filter]);
  const cols: Column<Job>[] = [
    { key: "id", label: "Job ID", render: (v) => <Mono>{String(v)}</Mono> },
    { key: "customer", label: "Customer" },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (v) => <Mono>{String(v)}</Mono>,
    },
    {
      key: "model",
      label: "Model",
      render: (v) => <span style={{ color: C.textSec }}>{String(v)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (v) => <Badge status={v as JobStatus} />,
    },
    { key: "mechanic", label: "Mechanic" },
    { key: "amount", label: "Amount", render: (v) => <Mono>{String(v)}</Mono> },
    {
      key: "updated",
      label: "Updated",
      render: (v) => <Muted>{String(v)}</Muted>,
    },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#f0f2f5",
            padding: 2,
            borderRadius: 4,
            gap: 1,
          }}
        >
          {JOB_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 11px",
                fontSize: 12,
                borderRadius: 3,
                fontFamily: "inherit",
                border: "none",
                background: filter === f ? C.surface : "transparent",
                color: filter === f ? C.text : C.textSec,
                fontWeight: filter === f ? 500 : 400,
                cursor: "pointer",
                boxShadow: filter === f ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        {role === "owner" && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <i
              className="ti ti-plus"
              style={{ fontSize: 14 }}
              aria-hidden="true"
            />
            New Job
          </button>
        )}
      </div>
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
        }}
      >
        <div
          style={{
            padding: "11px 14px 11px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: C.textSec }}>
            {rows.length} job{rows.length !== 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {["Filter", "Export"].map((lbl) => (
              <button
                key={lbl}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  borderRadius: 3,
                  cursor: "pointer",
                  color: C.textSec,
                  fontFamily: "inherit",
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        {rows.length > 0 ? (
          <DataTable columns={cols} rows={rows} />
        ) : (
          <div
            style={{ padding: "40px 0", textAlign: "center", color: C.textSec }}
          >
            No jobs matching this filter
          </div>
        )}
      </div>
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
        gap: 10,
      }}
    >
      <i
        className="ti ti-hammer"
        style={{ fontSize: 28, color: "#d1d5db" }}
        aria-hidden="true"
      />
      <div style={{ fontSize: 14, fontWeight: 500, color: C.textSec }}>
        {label} — coming in Part 2
      </div>
      <div style={{ fontSize: 12, color: "#9ca3af" }}>
        Bookings, Bills, Customers, Leads, Inbox &amp; Settings
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────

export default function Admin() {
  const [page, setPage] = useState<Page>("dashboard");
  const [role, setRole] = useState<Role>("owner");

  const effectivePage: Page =
    role === "mechanic" && page !== "jobs" ? "jobs" : page;

  const handleRoleChange = (r: Role) => {
    setRole(r);
    if (r === "mechanic") setPage("jobs");
  };

  const renderPage = () => {
    switch (effectivePage) {
      case "dashboard":
        return <Dashboard setPage={setPage} />;
      case "jobs":
        return <Jobs role={role} />;
      default: {
        const label =
          NAV_OWNER.find((n) => n.id === effectivePage)?.label ?? effectivePage;
        return <ComingSoon label={label} />;
      }
    }
  };

  return (
    <>
      <style>{`
        .cf-row:hover { background: #f9fafb !important; }
        * { box-sizing: border-box; }
        button:focus-visible { outline: 2px solid #f48024; outline-offset: 2px; }
      `}</style>
      <div
        style={{
          display: "flex",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",
          minHeight: 700,
          background: C.bg,
          fontSize: 13,
        }}
      >
        <Sidebar page={effectivePage} setPage={setPage} role={role} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Topbar page={effectivePage} role={role} setRole={handleRoleChange} />
          <main style={{ flex: 1, padding: "22px", overflowY: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
