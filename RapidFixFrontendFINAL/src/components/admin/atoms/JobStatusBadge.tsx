"use client";
import { useState, useRef, useEffect } from "react";
import { C, JOB_STATUS_CFG } from "@/lib/constants";
import { jobsApi } from "@/lib/api";
import { Badge } from "../atoms/Badge";
import type { JobStatus } from "@/lib/types";

const STATUSES = Object.keys(JOB_STATUS_CFG) as JobStatus[];

const STATUS_META: Record<
  JobStatus,
  { label: string; desc: string; icon: string }
> = {
  received: {
    label: "Received",
    desc: "Job logged, not yet assessed",
    icon: "ti-inbox",
  },
  diagnosed: {
    label: "Diagnosed",
    desc: "Issue identified, work pending",
    icon: "ti-stethoscope",
  },
  in_progress: {
    label: "In Progress",
    desc: "Actively being worked on",
    icon: "ti-tools",
  },
  ready: {
    label: "Ready",
    desc: "Done, awaiting customer pickup",
    icon: "ti-circle-check",
  },
  delivered: {
    label: "Delivered",
    desc: "Vehicle returned to customer",
    icon: "ti-flag",
  },
};

interface Props {
  jobId: string;
  current: JobStatus;
  onChanged?: (newStatus: JobStatus, waSent: boolean) => void;
  readonly?: boolean;
}

export function JobStatusBadge({ jobId, current, onChanged, readonly }: Props) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [waSent, setWaSent] = useState<boolean | null>(null);
  const [pending, setPending] = useState<JobStatus | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setNote("");
        setPending(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function changeStatus(next: JobStatus) {
    if (next === current || loading) return;
    setLoading(true);
    setPending(next);
    try {
      const res = await jobsApi.advanceStatus(
        jobId,
        next,
        note.trim() || undefined,
      );
      setWaSent(res.wa_sent);
      onChanged?.(next, res.wa_sent);
      setOpen(false);
      setNote("");
      setTimeout(() => setWaSent(null), 3000);
    } catch (e) {
      console.error("Status update failed:", e);
    } finally {
      setLoading(false);
      setPending(null);
    }
  }

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {/* Trigger */}
      <button
        onClick={(e) => {
          if (readonly) return;

          const rect = (
            e.currentTarget as HTMLButtonElement
          ).getBoundingClientRect();

          const isMobile = window.innerWidth < 768;

          setCoords({
            top: rect.bottom + 8,
            left: isMobile ? Math.max(12, window.innerWidth - 260) : rect.left,
          });

          setOpen((o) => !o);
        }}
        disabled={loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          background: open ? "#f0f2f5" : "none",
          border: open ? `1px solid ${C.border}` : "1px solid transparent",
          borderRadius: 6,
          padding: "3px 7px 3px 4px",
          cursor: readonly ? "default" : "pointer",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        {loading ? (
          <i
            className="ti ti-loader-2 ti-spin"
            style={{ fontSize: 13, color: C.textSec }}
          />
        ) : (
          <Badge status={current} />
        )}
        {!readonly && (
          <i
            className="ti ti-chevron-down"
            style={{
              fontSize: 11,
              color: C.textSec,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s",
            }}
          />
        )}
      </button>

      {/* WhatsApp sent flash */}
      {waSent && (
        <span
          style={{
            fontSize: 11,
            color: "#16a34a",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 4,
            padding: "2px 6px",
          }}
        >
          <i className="ti ti-brand-whatsapp" style={{ fontSize: 12 }} />{" "}
          Notified
        </span>
      )}

      {/* Popover */}
      {open && (
        <div
          style={{
            position: "fixed",

            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
            zIndex: 99999,
            width: 240,
            overflow: "hidden",
            top: 250,
            left: 1200,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "10px 14px 8px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.textSec,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Change Status
            </span>
            <button
              onClick={() => {
                setOpen(false);
                setNote("");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: C.textSec,
                padding: 2,
                lineHeight: 1,
              }}
            >
              <i className="ti ti-x" style={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Status options */}
          <div style={{ padding: "6px 8px" }}>
            {STATUSES.map((s) => {
              const isCurrent = s === current;
              const isPending = s === pending;
              const meta = STATUS_META[s];
              const cfg = JOB_STATUS_CFG[s];

              return (
                <button
                  key={s}
                  onClick={() => changeStatus(s)}
                  disabled={isCurrent || loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 7,
                    border: isCurrent
                      ? `1px solid ${C.border}`
                      : "1px solid transparent",
                    background: isCurrent ? "#f8f9fb" : "transparent",
                    cursor: isCurrent ? "default" : "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#f5f6f8";
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: cfg.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isPending ? (
                      <i
                        className="ti ti-loader-2 ti-spin"
                        style={{ fontSize: 14, color: cfg.text }}
                      />
                    ) : (
                      <i
                        className={`ti ${meta.icon}`}
                        style={{ fontSize: 14, color: cfg.text }}
                      />
                    )}
                  </span>

                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: isCurrent ? 600 : 400,
                        color: C.text,
                      }}
                    >
                      {meta.label}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 11,
                        color: C.textSec,
                        marginTop: 1,
                      }}
                    >
                      {meta.desc}
                    </span>
                  </span>

                  {isCurrent && (
                    <i
                      className="ti ti-check"
                      style={{ fontSize: 14, color: cfg.text, flexShrink: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Note input */}
          <div
            style={{
              padding: "6px 8px 10px",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <input
              placeholder="Add a note (optional)…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontFamily: "inherit",
                color: C.text,
                background: "#f8f9fb",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.accent)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
