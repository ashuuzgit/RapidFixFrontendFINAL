"use client";
import { useState } from "react";
import { C } from "@/lib/constants";
import { DataTable } from "../atoms/DataTable";
import { Badge } from "../atoms/Badge";
import type { Role, Job, JobStatus, Column } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const Mono = ({ v }: { v: string }) => (
  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12 }}>
    {v}
  </span>
);
const Muted = ({ v }: { v: string }) => (
  <span style={{ color: C.textSec, fontSize: 12 }}>{v}</span>
);

// ── Filters ───────────────────────────────────────────────────────────────────

const FILTERS = [
  "All",
  "Received",
  "Diagnosed",
  "In Progress",
  "Ready",
  "Delivered",
] as const;
type JobFilter = (typeof FILTERS)[number];

const FILTER_MAP: Partial<Record<JobFilter, JobStatus>> = {
  Received: "received",
  Diagnosed: "diagnosed",
  "In Progress": "in_progress",
  Ready: "ready",
  Delivered: "delivered",
};

// ── Seed data ─────────────────────────────────────────────────────────────────

const JOBS: Job[] = [
  {
    id: "JOB-1042",
    status: "in_progress",
    customers: { id: "1", name: "Rahul Sharma", phone: "+91 98000 11111" },
    vehicles: {
      id: "1",
      make: "Maruti",
      model: "Alto",
      registration: "MH12 AB 1234",
      type: "car",
    },
    mechanic: { id: "1", name: "Ramesh K." },
    service_description: null,
    estimated_completion: null,
    odometer_in: null,
    created_at: "",
    updated_at: "10 min ago",
  },
  {
    id: "JOB-1041",
    status: "diagnosed",
    customers: { id: "2", name: "Priya Desai", phone: "+91 98000 22222" },
    vehicles: {
      id: "2",
      make: "Honda",
      model: "City",
      registration: "DL09 CD 5678",
      type: "car",
    },
    mechanic: { id: "2", name: "Suresh P." },
    service_description: null,
    estimated_completion: null,
    odometer_in: null,
    created_at: "",
    updated_at: "2 hrs ago",
  },
  {
    id: "JOB-1040",
    status: "delivered",
    customers: { id: "3", name: "Amit Verma", phone: "+91 98000 33333" },
    vehicles: {
      id: "3",
      make: "Hyundai",
      model: "i20",
      registration: "KA03 EF 9012",
      type: "car",
    },
    mechanic: { id: "1", name: "Ramesh K." },
    service_description: null,
    estimated_completion: null,
    odometer_in: null,
    created_at: "",
    updated_at: "Yesterday",
  },
  {
    id: "JOB-1039",
    status: "received",
    customers: { id: "4", name: "Neha Gupta", phone: "+91 98000 44444" },
    vehicles: {
      id: "4",
      make: "Toyota",
      model: "Innova",
      registration: "MH04 GH 3456",
      type: "car",
    },
    mechanic: null,
    service_description: null,
    estimated_completion: null,
    odometer_in: null,
    created_at: "",
    updated_at: "Yesterday",
  },
  {
    id: "JOB-1038",
    status: "delivered",
    customers: { id: "5", name: "Sanjay Mehta", phone: "+91 98000 55555" },
    vehicles: {
      id: "5",
      make: "Maruti",
      model: "Dzire",
      registration: "GJ01 IJ 7890",
      type: "car",
    },
    mechanic: { id: "3", name: "Vikram S." },
    service_description: null,
    estimated_completion: null,
    odometer_in: null,
    created_at: "",
    updated_at: "2 days ago",
  },
  {
    id: "JOB-1037",
    status: "ready",
    customers: { id: "6", name: "Deepa Nair", phone: "+91 98000 66666" },
    vehicles: {
      id: "6",
      make: "Maruti",
      model: "WagonR",
      registration: "MH02 KL 2345",
      type: "car",
    },
    mechanic: { id: "2", name: "Suresh P." },
    service_description: null,
    estimated_completion: null,
    odometer_in: null,
    created_at: "",
    updated_at: "3 hrs ago",
  },
  {
    id: "JOB-1036",
    status: "received",
    customers: { id: "7", name: "Arjun Pillai", phone: "+91 98000 77777" },
    vehicles: {
      id: "7",
      make: "Hyundai",
      model: "Creta",
      registration: "TN09 MN 6789",
      type: "car",
    },
    mechanic: null,
    service_description: null,
    estimated_completion: null,
    odometer_in: null,
    created_at: "",
    updated_at: "3 days ago",
  },
];

// ── Columns ───────────────────────────────────────────────────────────────────

const cols: Column<Job>[] = [
  { key: "id", label: "Job ID", render: (r) => <Mono v={r.id} /> },
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
  {
    key: "vehicle_model",
    label: "Model",
    render: (r) => (
      <Muted v={`${r.vehicles?.make ?? ""} ${r.vehicles?.model ?? ""}`} />
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge status={r.status} />,
  },
  {
    key: "mechanic",
    label: "Mechanic",
    render: (r) => <>{r.mechanic?.name ?? "Unassigned"}</>,
  },
  {
    key: "updated_at",
    label: "Updated",
    render: (r) => <Muted v={r.updated_at} />,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Jobs({ role }: { role: Role }) {
  const [filter, setFilter] = useState<JobFilter>("All");

  const base =
    role === "mechanic"
      ? JOBS.filter((j) => j.mechanic?.name === "Ramesh K.")
      : JOBS;

  const rows =
    filter === "All"
      ? base
      : base.filter((j) => j.status === FILTER_MAP[filter]);

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

        {/* New Job button — owner only */}
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
            <i className="ti ti-plus" style={{ fontSize: 14 }} />
            New Job
          </button>
        )}
      </div>

      {/* Table card */}
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
            flexWrap: "wrap",
            gap: 8,
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
