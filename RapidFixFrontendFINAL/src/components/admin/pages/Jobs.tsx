"use client";
import { useState, useEffect, useCallback } from "react";
import { C } from "@/lib/constants";
import { DataTable } from "../atoms/DataTable";
import { jobsApi } from "@/lib/api";
import type { Role, Job, JobStatus, Column } from "@/lib/types";
import { NewJobModal } from "../atoms/NewJobModal";
import { JobStatusBadge } from "../atoms/JobStatusBadge";

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

// ── Component ─────────────────────────────────────────────────────────────────

export function Jobs({ role }: { role: Role }) {
  const [filter, setFilter] = useState<JobFilter>("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewJob, setShowNewJob] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = FILTER_MAP[filter];
      const res = await jobsApi.list({ status, limit: 50 });
      setJobs(res.data);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.error ?? "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ── Columns (inside component so fetchJobs + role are in scope) ──────────────

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
      render: (r) => (
        <JobStatusBadge
          jobId={r.id}
          current={r.status}
          onChanged={fetchJobs}
          readonly={role === "mechanic"}
        />
      ),
    },
    {
      key: "mechanic",
      label: "Mechanic",
      render: (r) => <>{r.mechanic?.name ?? "Unassigned"}</>,
    },
    {
      key: "updated_at",
      label: "Updated",
      render: (r) => <Muted v={new Date(r.updated_at).toLocaleDateString()} />,
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
            overflow: "visible",
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

        {role === "owner" && (
          <>
            <button
              onClick={() => setShowNewJob(true)}
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

            {showNewJob && (
              <NewJobModal
                onClose={() => setShowNewJob(false)}
                onCreated={fetchJobs}
              />
            )}
          </>
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
            {loading ? "Loading…" : `${total} job${total !== 1 ? "s" : ""}`}
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

        {loading ? (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: C.textSec,
              fontSize: 13,
            }}
          >
            Loading jobs…
          </div>
        ) : error ? (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: C.danger,
              fontSize: 13,
            }}
          >
            {error} —{" "}
            <span
              onClick={fetchJobs}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              retry
            </span>
          </div>
        ) : jobs.length > 0 ? (
          <DataTable columns={cols} rows={jobs} />
        ) : (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: C.textSec,
            }}
          >
            No jobs matching this filter
          </div>
        )}
      </div>
    </div>
  );
}
